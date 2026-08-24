"""Phase 4 - the rule-based safety layer.

Design commitments, in priority order:

1. **Rules only.** No model call happens here. The brief is explicit that a
   language model's confidence score must not be the thing standing between a
   user and an emergency, so this module is pure pattern matching and runs
   whether or not an LLM is configured, reachable, or correct.

2. **Recall over precision.** For safety cases a false positive costs a
   coordinator two minutes; a false negative can cost a life. Every ambiguous
   decision resolves toward flagging.

3. **Softening never clears.** Negation, third-party attribution and historical
   framing *downgrade* a hit, they never delete it. "My friend is suicidal"
   still reaches a human, because the user is carrying something heavy and
   because people routinely disclose their own risk in the third person.

4. **The system stops deciding.** When an ACTIVE flag fires the engine does not
   recommend a pathway, does not auto-book, and does not offer clinical advice.
   It hands over and logs.

Severity ladder
---------------
ACTIVE    present tense, about the user, no mitigating context -> emergency routing
ELEVATED  clearly present but without stated intent or immediacy -> urgent human review
CONTEXT   negated, historical, hypothetical, or about someone else -> human review

The one thing that is *fully* suppressed is a small set of fixed idioms
("this deadline is killing me"), which are masked out before any rule runs.
That list is deliberately tiny and literal.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

from . import textutil
from .emergency import resources_for
from .types import (
    EmergencyResource,
    RiskFlag,
    RiskFlagHit,
    RiskSeverity,
    SafetyAssessment,
    Urgency,
)


# --------------------------------------------------------------------------
# Idioms - the only full suppression in the module
# --------------------------------------------------------------------------

# The list itself now lives in textutil, because the classifier needs exactly
# the same masking. Re-exported here so `safety.IDIOM_PATTERNS` keeps working
# and so the API's /safety/rules endpoint can still describe it.
IDIOM_PATTERNS: Tuple[str, ...] = textutil.FIGURATIVE_PATTERNS
_mask_idioms = textutil.mask_figurative


# --------------------------------------------------------------------------
# Softeners
# --------------------------------------------------------------------------

# Looked for in the text immediately preceding a hit.
NEGATION_PATTERNS: Tuple[str, ...] = (
    r"\b(?:don'?t|do not|does not|doesn'?t|never|not)\s+(?:want|wanna|plan|intend|going)\b",
    r"\bwould\s+never\b",
    r"\bwouldn'?t\s+(?:ever|actually)\b",
    r"\bno\s+(?:plans?|intention|thoughts?)\s+(?:of|to)\b",
    r"\bi'?m\s+not\s+(?:going\s+to|suicidal|planning)\b",
    r"\bi\s+am\s+not\s+(?:going\s+to|suicidal|planning)\b",
    r"\bnot\s+(?:that|like)\s+i\b",
    r"\bhave\s+never\b",
    r"\bhaven'?t\s+(?:ever|actually)\b",
    r"\bto\s+be\s+clear\s+i\s+(?:don'?t|am not)\b",
)

# Flags where a mention of another person means the statement is ABOUT them, so
# third-party framing genuinely reduces the immediacy of risk to this user.
#
# Abuse and threat-to-others are deliberately excluded. In "my husband took my
# passport" or "I am scared of what I might do to my brother", the other person
# is the perpetrator or the target - not the subject of the disclosure. Softening
# those on the presence of "my husband" would systematically downgrade exactly
# the domestic-abuse cases this layer exists to catch.
THIRD_PARTY_SOFTENABLE: Tuple[RiskFlag, ...] = (
    RiskFlag.SELF_HARM_SUICIDE,
    RiskFlag.PSYCHOSIS_DISORIENTATION,
    RiskFlag.MEDICAL_EMERGENCY,
    RiskFlag.SUBSTANCE_EMERGENCY,
    RiskFlag.MINOR_SAFEGUARDING,
)

# Looked for in the wider window - attributes the statement to someone else.
THIRD_PARTY_PATTERNS: Tuple[str, ...] = (
    r"\bmy\s+(?:friend|roommate|flatmate|classmate|colleague|cousin|brother|sister|"
    r"mother|father|mom|dad|partner|husband|wife|boyfriend|girlfriend|neighbour|neighbor|student)\b",
    r"\bsomeone\s+i\s+know\b",
    r"\ba\s+friend\s+of\s+mine\b",
    r"\bhe\s+(?:said|told|is|keeps|threatened)\b",
    r"\bshe\s+(?:said|told|is|keeps|threatened)\b",
    r"\bthey\s+(?:said|told|are)\b",
    r"\bi'?m\s+worried\s+about\s+(?:him|her|them|my)\b",
    r"\bi\s+am\s+worried\s+about\s+(?:him|her|them|my)\b",
    r"\bin\s+(?:a\s+)?(?:film|movie|book|show|series|news)\b",
)

# Looked for in the wider window - places the statement in the past.
HISTORICAL_PATTERNS: Tuple[str, ...] = (
    r"\b(?:years?|months?|decades?)\s+ago\b",
    r"\bwhen\s+i\s+was\s+(?:a\s+)?(?:kid|child|teenager|younger|in\s+school)\b",
    r"\bused\s+to\b",
    r"\bin\s+the\s+past\b",
    r"\bback\s+then\b",
    r"\bat\s+the\s+time\b",
    r"\blast\s+year\b",
    r"\bi\s+have\s+recovered\b",
    r"\bi'?ve\s+recovered\b",
    r"\bthat\s+phase\s+is\s+over\b",
    r"\bno\s+longer\s+feel\b",
)


# --------------------------------------------------------------------------
# Rules
# --------------------------------------------------------------------------


@dataclass(frozen=True)
class SafetyRule:
    id: str
    flag: RiskFlag
    severity: RiskSeverity
    patterns: Tuple[str, ...]
    description: str
    #: If any of these phrases appear anywhere, drop one severity step. Used
    #: where a symptom is shared between an emergency and a common non-emergency
    #: presentation (breathlessness in a panic attack, for example).
    soften_if_present: Tuple[str, ...] = ()


SAFETY_RULES: Tuple[SafetyRule, ...] = (
    # ---------------- self-harm and suicide ----------------
    SafetyRule(
        id="SH-01",
        flag=RiskFlag.SELF_HARM_SUICIDE,
        severity=RiskSeverity.ACTIVE,
        description="Explicit suicidal statement or plan",
        patterns=(
            r"\bkill(?:ing)?\s+myself\b",
            r"\bend(?:ing)?\s+(?:my\s+life|it\s+all|things)\b",
            r"\btake\s+my\s+own\s+life\b",
            r"\bsuicid(?:e|al)\b",
            r"\bwant\s+to\s+die\b",
            r"\bwish\s+i\s+(?:was|were)\s+dead\b",
            r"\bbetter\s+off\s+(?:dead|without\s+me)\b",
            r"\beveryone\s+would\s+be\s+better\s+off\b",
            r"\bno\s+(?:point|reason)\s+(?:in\s+)?(?:living|being\s+alive|going\s+on)\b",
            r"\bdon'?t\s+want\s+to\s+(?:be\s+here|wake\s+up|live|exist)\b",
            r"\bdo\s+not\s+want\s+to\s+(?:be\s+here|wake\s+up|live|exist)\b",
            r"\bplan\s+to\s+end\b",
            r"\bwrote\s+(?:a\s+)?(?:note|letter)\s+to\s+my\s+(?:family|parents)\b",
            r"\bsaying\s+goodbye\s+to\s+everyone\b",
            r"\bgiving\s+away\s+my\s+(?:things|belongings|stuff)\b",
        ),
    ),
    SafetyRule(
        id="SH-02",
        flag=RiskFlag.SELF_HARM_SUICIDE,
        severity=RiskSeverity.ACTIVE,
        description="Self-injury",
        patterns=(
            r"\bcut(?:ting)?\s+myself\b",
            r"\bhurt(?:ing)?\s+myself\b",
            r"\bharm(?:ing)?\s+myself\b",
            # Inflections matter: "self harmed" must match as readily as "self harm".
            r"\bself[\s\-]?harm(?:ed|ing|s)?\b",
            r"\bburn(?:ing)?\s+myself\b",
            r"\boverdos(?:e|ed|ing)\b",
            # People rarely say "cutting myself" - they say "cutting again".
            # The bare verb is not safe to match on ("cutting classes",
            # "cutting costs"), so it is anchored to a relapse framing.
            r"\bcutting\s+again\b",
            r"\b(?:started|been)\s+cutting\b(?!\s+(?:class|classes|lectures|down|back|out|cost|costs|corners|hair|the))",
            # Widened from "a bunch of / too many pills": the quantity is often
            # described loosely and the owner of the pills named in between,
            # as in "took a handful of my flatmates pills".
            r"\btook\s+(?:a\s+(?:bunch|handful|load|packet|bottle|box)\s+of|too\s+many|all\s+(?:of\s+)?(?:my|the|his|her))\s+(?:\w+\s+){0,3}pills\b",
            r"\btook\s+a\s+handful\s+of\b",
            r"\bjump(?:ing)?\s+(?:off|in\s+front\s+of)\b",
        ),
    ),
    SafetyRule(
        id="SH-03",
        flag=RiskFlag.SELF_HARM_SUICIDE,
        severity=RiskSeverity.ELEVATED,
        description="Passive ideation and hopelessness with a life-weariness framing",
        patterns=(
            r"\btired\s+of\s+living\b",
            r"\btired\s+of\s+(?:it\s+all|everything)\b",
            r"\bcan'?t\s+go\s+on\b",
            r"\bcannot\s+go\s+on\b",
            r"\bdon'?t\s+see\s+(?:a\s+)?(?:future|way\s+out)\b",
            r"\bdo\s+not\s+see\s+(?:a\s+)?(?:future|way\s+out)\b",
            r"\bnothing\s+to\s+live\s+for\b",
            r"\bwant\s+to\s+disappear\b",
            r"\bdisappear\s+forever\b",
            r"\bnever\s+wake\s+up\b",
            r"\bwhat'?s\s+the\s+point\s+of\s+(?:any\s+of\s+)?(?:it|this|anything)\b",
            # "I do not see the point in any of this anymore" - the same thought
            # as "what's the point", phrased as a statement rather than a
            # question. The original patterns only covered the question form.
            r"\b(?:don'?t|do\s+not)\s+see\s+the\s+point\b",
            r"\bthe\s+point\s+(?:in|of)\s+any\s+of\s+this\b",
            # "I just want it to stop" is how people describe wanting to be dead
            # without saying so. This will occasionally fire on someone who wants
            # harassment to stop; that is the trade the brief asks for, and this
            # rule is ELEVATED, so it routes to a human rather than to emergency
            # services.
            r"\bwant\s+(?:it|this|everything|it\s+all|all\s+of\s+this)\s+to\s+stop\b",
        ),
    ),
    # ---------------- abuse and immediate danger ----------------
    SafetyRule(
        id="AB-01",
        flag=RiskFlag.ABUSE_OR_DANGER,
        severity=RiskSeverity.ACTIVE,
        description="Physical violence toward the user",
        patterns=(
            r"\b(?:hits?|hitting|hit)\s+me\b",
            r"\b(?:beats?|beating|beat)\s+me\b",
            r"\bpunch(?:ed|es|ing)?\s+me\b",
            r"\bslapp?(?:ed|s|ing)\s+me\b",
            r"\bstrangl(?:e|ed|ing)\b",
            r"\bchok(?:e|ed|ing)\s+me\b",
            r"\bthrew\s+(?:something\s+at|me)\b",
            r"\bdomestic\s+(?:violence|abuse)\b",
            r"\bphysically\s+abus(?:e|ed|ive)\b",
            r"\bhe\s+(?:hurt|hurts)\s+me\b",
            r"\bshe\s+(?:hurt|hurts)\s+me\b",
        ),
    ),
    SafetyRule(
        id="AB-02",
        flag=RiskFlag.ABUSE_OR_DANGER,
        severity=RiskSeverity.ACTIVE,
        description="Threats, coercive control and confinement",
        patterns=(
            r"\bthreaten(?:s|ed|ing)?\s+to\s+(?:kill|hurt|harm|report)\b",
            r"\bthreaten(?:s|ed|ing)?\s+me\b",
            r"\bafraid\s+(?:of|for)\s+my\s+life\b",
            r"\bscared\s+(?:for\s+my\s+life|he\s+will|she\s+will|they\s+will)\b",
            r"\bnot\s+safe\s+(?:at\s+home|here|where\s+i)\b",
            r"\block(?:ed|s)\s+me\s+in\b",
            r"\bwon'?t\s+let\s+me\s+leave\b",
            r"\bwill\s+not\s+let\s+me\s+leave\b",
            r"\btook\s+my\s+passport\b",
            r"\bkeeps?\s+my\s+passport\b",
            r"\bconfiscated\s+my\s+passport\b",
            # Confinement described from the victim's side rather than the
            # controller's: "I am not allowed to leave the house."
            r"\bnot\s+allowed\s+to\s+(?:leave|go\s+out|go\s+outside)\b",
            r"\bnot\s+allowed\s+(?:out|outside)\b",
            r"\bnot\s+allowed\s+to\s+(?:see|speak\s+to|talk\s+to|call)\s+(?:anyone|my\s+friends|friends|my\s+family)\b",
            r"\bcontrols\s+(?:all\s+)?my\s+money\b",
            r"\bstalking\s+me\b",
            r"\bfollowing\s+me\s+home\b",
            r"\btrafficking\b",
        ),
    ),
    SafetyRule(
        id="AB-03",
        flag=RiskFlag.ABUSE_OR_DANGER,
        severity=RiskSeverity.ACTIVE,
        description="Sexual violence",
        patterns=(
            r"\brap(?:e|ed|ing)\b",
            r"\bsexual(?:ly)?\s+assault(?:ed)?\b",
            r"\bmolest(?:ed|ing)?\b",
            r"\bforced\s+me\s+to\s+(?:have\s+sex|sleep\s+with)\b",
            r"\bwithout\s+my\s+consent\b",
        ),
    ),
    # ---------------- psychosis and disorientation ----------------
    SafetyRule(
        id="PS-01",
        flag=RiskFlag.PSYCHOSIS_DISORIENTATION,
        severity=RiskSeverity.ACTIVE,
        description="Hallucinations and loss of reality contact",
        patterns=(
            r"\bhearing\s+voices\b",
            r"\bvoices\s+(?:in\s+my\s+head|telling\s+me|talking\s+to\s+me)\b",
            r"\bseeing\s+(?:things|people)\s+that\s+(?:aren'?t|are\s+not)\s+there\b",
            r"\bhallucinat(?:e|ing|ions?)\b",
            r"\bcan'?t\s+tell\s+what'?s\s+real\b",
            r"\bnot\s+sure\s+what\s+is\s+real\b",
            r"\bdon'?t\s+know\s+(?:where\s+i\s+am|what\s+day|who\s+i\s+am)\b",
            r"\bimplanted\s+(?:a\s+)?(?:chip|device)\b",
            r"\breading\s+my\s+(?:mind|thoughts)\b",
            r"\bpoisoning\s+my\s+food\b",
            # Persecutory content is almost never phrased in clinical terms.
            # "Poisoning my food" is what a clinician writes; "putting something
            # in my food" is what the person says.
            r"\bputting\s+something\s+in\s+my\s+(?:food|drink|water|tea|coffee)\b",
            # Anchored to hearing people talk *about me* - hearing neighbours
            # through a wall is an ordinary complaint about a thin flat.
            r"\bhear\s+(?:them|people|voices|him|her|everyone)\s+(?:talking|whispering|laughing)\s+about\s+me\b",
        ),
    ),
    SafetyRule(
        id="PS-02",
        flag=RiskFlag.PSYCHOSIS_DISORIENTATION,
        severity=RiskSeverity.ELEVATED,
        description="Persecutory ideation and dissociation, which also have loose colloquial uses",
        patterns=(
            r"\bbeing\s+(?:watched|followed|monitored|controlled)\b",
            r"\bthey\s+are\s+all\s+(?:against|watching)\s+me\b",
            r"\bparanoid\b",
            r"\bdissociat(?:e|ing|ion)\b",
            r"\blost\s+time\b",
            r"\bout\s+of\s+my\s+body\b",
        ),
    ),
    # ---------------- medical emergency ----------------
    SafetyRule(
        id="ME-01",
        flag=RiskFlag.MEDICAL_EMERGENCY,
        severity=RiskSeverity.ACTIVE,
        description="Acute medical presentation",
        patterns=(
            r"\bchest\s+pain\b",
            r"\bheart\s+attack\b",
            r"\bstroke\b",
            r"\bseizure\b",
            r"\bcollapsed\b",
            r"\bfainted\b",
            r"\bpassed\s+out\b",
            r"\bunconscious\b",
            r"\bbleeding\s+(?:a\s+lot|heavily|badly)\b",
            r"\bcoughing\s+up\s+blood\b",
            r"\bcall(?:ed)?\s+an\s+ambulance\b",
        ),
        # Breathlessness and chest tightness are also panic symptoms.
        soften_if_present=("panic attack", "panic attacks", "anxiety attack"),
    ),
    SafetyRule(
        id="ME-02",
        flag=RiskFlag.MEDICAL_EMERGENCY,
        severity=RiskSeverity.ELEVATED,
        description="Breathlessness and prolonged non-eating",
        patterns=(
            r"\bcan'?t\s+breathe\b",
            r"\bcannot\s+breathe\b",
            r"\bcould\s+not\s+breathe\b",
            r"\bstruggling\s+to\s+breathe\b",
            # Both the contracted and uncontracted forms, and a numeral or word
            # count between the verb and "days" ("not slept in four days").
            r"\b(?:haven'?t|have\s+not|has\s+not|hasn'?t)\s+eaten\s+(?:in|for)\s+(?:\w+\s+)?(?:days?|weeks?)\b",
            r"\bnot\s+eaten\s+(?:anything\s+)?(?:in|for)\s+(?:\w+\s+)?(?:days?|weeks?)\b",
            r"\b(?:haven'?t|have\s+not|has\s+not|hasn'?t)\s+slept\s+(?:in|for)\s+(?:\w+\s+)?(?:days?|weeks?)\b",
            r"\bnot\s+slept\s+(?:in|for)\s+(?:\w+\s+)?(?:days?|weeks?)\b",
        ),
    ),
    # ---------------- substance emergency ----------------
    SafetyRule(
        id="SU-01",
        flag=RiskFlag.SUBSTANCE_EMERGENCY,
        severity=RiskSeverity.ACTIVE,
        description="Acute intoxication, overdose or withdrawal",
        patterns=(
            r"\bod'?d\b",
            r"\btook\s+too\s+many\b",
            r"\bwithdrawal\b",
            r"\bshaking\s+without\s+(?:a\s+drink|drinking)\b",
            r"\bblack(?:ed)?\s+out\s+(?:again|last\s+night|from\s+drinking)\b",
            r"\bcan'?t\s+stop\s+drinking\b",
            r"\bcannot\s+stop\s+drinking\b",
            r"\bdrinking\s+(?:all\s+day|from\s+the\s+morning|in\s+the\s+morning)\b",
            r"\binjecting\b",
        ),
    ),
    SafetyRule(
        id="SU-02",
        flag=RiskFlag.SUBSTANCE_EMERGENCY,
        severity=RiskSeverity.ELEVATED,
        description="Dependent-pattern use",
        patterns=(
            r"\bdrinking\s+every\s+(?:day|night)\b",
            r"\bdrink\s+to\s+(?:cope|sleep|forget|function)\b",
            # "I have a drink most evenings to get to sleep" - the minimising
            # phrasing that dependent drinking is usually first described in.
            r"\bdrink\s+(?:most|every)\s+(?:evening|night|day)s?\b",
            r"\bdrinking\s+(?:most|every)\s+(?:evening|night|day)s?\b",
            r"\bdrink\s+(?:my|our)?\s*self\s+to\s+sleep\b",
            r"\busing\s+(?:again|drugs)\b",
            r"\bhigh\s+(?:all\s+day|every\s+day)\b",
            r"\bpills\s+to\s+(?:sleep|cope|get\s+through)\b",
        ),
    ),
    # ---------------- threat to others ----------------
    SafetyRule(
        id="HO-01",
        flag=RiskFlag.HARM_TO_OTHERS,
        severity=RiskSeverity.ACTIVE,
        description="Stated intent or fear of harming another person",
        patterns=(
            r"\b(?:want|going)\s+to\s+(?:hurt|kill|attack|hit)\s+(?:him|her|them|someone|people|my)\b",
            r"\bscared\s+i\s+(?:will|might|could)\s+hurt\b",
            r"\bafraid\s+i\s+(?:will|might|could)\s+hurt\b",
            r"\bmight\s+(?:hurt|do\s+something\s+to)\s+(?:him|her|them|someone|my)\b",
            r"\blose\s+control\s+and\s+hurt\b",
            r"\bhurt\s+my\s+(?:child|baby|kid|kids|children)\b",
            # Fear of one's own capacity for violence, stated without naming the
            # act: "I am scared of what I might do."
            r"\b(?:scared|afraid|frightened|terrified)\s+of\s+what\s+i\s+(?:might|will|could|may)\s+do\b",
            r"\bwhat\s+i\s+might\s+do\s+to\s+(?:him|her|them|someone)\b",
        ),
    ),
    # ---------------- safeguarding ----------------
    SafetyRule(
        id="MS-01",
        flag=RiskFlag.MINOR_SAFEGUARDING,
        severity=RiskSeverity.ELEVATED,
        description="Self-reported age below 18",
        patterns=(
            r"\bi\s+am\s+(?:1[0-7]|[1-9])\s+years?\s+old\b",
            r"\bi'?m\s+(?:1[0-7]|[1-9])\s+years?\s+old\b",
            # Age is usually given bare, and as often in words as in digits:
            # "I am sixteen and my parents sent me here."
            r"\bi\s+am\s+(?:1[0-7])\b",
            r"\bi'?m\s+(?:1[0-7])\b",
            r"\bi\s+am\s+(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen)\b",
            r"\bi'?m\s+(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen)\b",
            r"\bi'?m\s+still\s+in\s+(?:high\s+school|school)\b",
            r"\bmy\s+guardian\b",
        ),
    ),
)


# --------------------------------------------------------------------------
# Severity arithmetic
# --------------------------------------------------------------------------

_SEVERITY_LADDER = [RiskSeverity.CONTEXT, RiskSeverity.ELEVATED, RiskSeverity.ACTIVE]


def _downgrade(severity: RiskSeverity, steps: int = 1) -> RiskSeverity:
    index = _SEVERITY_LADDER.index(severity)
    return _SEVERITY_LADDER[max(0, index - steps)]


def _max_severity(a: RiskSeverity, b: RiskSeverity) -> RiskSeverity:
    return a if _SEVERITY_LADDER.index(a) >= _SEVERITY_LADDER.index(b) else b


def _matches_any(text: str, patterns: Tuple[str, ...]) -> Optional[str]:
    for pattern in patterns:
        spans = textutil.find_regex_spans(text, pattern)
        if spans:
            start, end = spans[0]
            return text[start:end].strip()
    return None


# --------------------------------------------------------------------------
# Public entry point
# --------------------------------------------------------------------------


def evaluate_safety(
    raw_text: str,
    country: str = "unknown",
    age: Optional[int] = None,
) -> SafetyAssessment:
    """Run the rule layer over an intake. Never raises on user input."""
    assessment = SafetyAssessment()
    normalised = textutil.normalise(raw_text or "")
    if not normalised:
        return assessment

    masked, idioms = _mask_idioms(normalised)
    if idioms:
        assessment.rationale.append(
            "Ignored figurative language: " + ", ".join(sorted(set(idioms)))
        )

    aggregated: Dict[RiskFlag, RiskFlagHit] = {}

    for rule in SAFETY_RULES:
        for pattern in rule.patterns:
            for start, end in textutil.find_regex_spans(masked, pattern):
                span_text = masked[start:end].strip()
                severity = rule.severity
                softened_by: List[str] = []

                before = textutil.preceding(masked, start, size=45)
                around = textutil.window(masked, start, end, size=90)

                negation = _matches_any(before, NEGATION_PATTERNS)
                if negation:
                    severity = RiskSeverity.CONTEXT
                    softened_by.append(f"negated by '{negation}'")

                if rule.flag in THIRD_PARTY_SOFTENABLE:
                    third_party = _matches_any(around, THIRD_PARTY_PATTERNS)
                    if third_party:
                        severity = _downgrade(severity, 2)
                        softened_by.append(f"attributed to another person ('{third_party}')")

                historical = _matches_any(around, HISTORICAL_PATTERNS)
                if historical:
                    # Past abuse still carries present risk far more often than a
                    # past panic attack does, so it drops one step, not two.
                    steps = 2 if rule.flag in THIRD_PARTY_SOFTENABLE else 1
                    severity = _downgrade(severity, steps)
                    softened_by.append(f"framed as past ('{historical}')")

                if rule.soften_if_present and textutil.contains_any_phrase(
                    masked, rule.soften_if_present
                ):
                    severity = _downgrade(severity, 1)
                    softened_by.append("co-occurs with a panic presentation")

                existing = aggregated.get(rule.flag)
                if existing is None:
                    aggregated[rule.flag] = RiskFlagHit(
                        flag=rule.flag,
                        severity=severity,
                        rule_ids=[rule.id],
                        matched_spans=[span_text],
                        softened_by=softened_by,
                    )
                else:
                    existing.severity = _max_severity(existing.severity, severity)
                    if rule.id not in existing.rule_ids:
                        existing.rule_ids.append(rule.id)
                    if span_text not in existing.matched_spans:
                        existing.matched_spans.append(span_text)
                    for note in softened_by:
                        if note not in existing.softened_by:
                            existing.softened_by.append(note)

    # Structured age beats anything inferred from prose.
    if age is not None and age < 18:
        hit = aggregated.get(RiskFlag.MINOR_SAFEGUARDING)
        if hit is None:
            aggregated[RiskFlag.MINOR_SAFEGUARDING] = RiskFlagHit(
                flag=RiskFlag.MINOR_SAFEGUARDING,
                severity=RiskSeverity.ACTIVE,
                rule_ids=["MS-STRUCTURED"],
                matched_spans=[f"declared age {age}"],
            )
        else:
            hit.severity = RiskSeverity.ACTIVE
            hit.rule_ids.append("MS-STRUCTURED")

    if not aggregated:
        return assessment

    assessment.flags = sorted(
        aggregated.values(),
        key=lambda hit: (-_SEVERITY_LADDER.index(hit.severity), hit.flag.value),
    )
    assessment.triggered = True
    assessment.requires_human_review = True  # every hit reaches a human, always

    severities = [hit.severity for hit in assessment.flags]
    if RiskSeverity.ACTIVE in severities:
        assessment.urgency_floor = Urgency.CRITICAL
        assessment.block_automated_pathway = True
    elif RiskSeverity.ELEVATED in severities:
        assessment.urgency_floor = Urgency.HIGH
    else:
        assessment.urgency_floor = Urgency.MODERATE

    for hit in assessment.flags:
        detail = f"{hit.flag.value}: {hit.severity.value} ({', '.join(hit.rule_ids)})"
        if hit.softened_by:
            detail += " - softened because " + "; ".join(hit.softened_by)
        assessment.rationale.append(detail)

    if assessment.urgency_floor.rank >= Urgency.HIGH.rank:
        assessment.emergency_resources = resources_for(country)

    return assessment


def unsafe_flag_values() -> List[str]:
    """The flags that count as 'unsafe case' when measuring recall."""
    return [flag.value for flag in RiskFlag]


def describe_rules() -> List[Dict[str, object]]:
    """Used by the review dashboard so a coordinator can see what the layer looks for."""
    return [
        {
            "id": rule.id,
            "flag": rule.flag.value,
            "severity": rule.severity.value,
            "description": rule.description,
            "pattern_count": len(rule.patterns),
        }
        for rule in SAFETY_RULES
    ]
