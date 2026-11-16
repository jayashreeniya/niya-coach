"""Phase 1 - the NIYA triage taxonomy.

Twelve categories from the project brief plus two the diaspora context makes
unavoidable (financial precarity and discrimination/identity). Each category
carries inclusion signals, exclusion signals, urgency rules, a recommended
pathway and the counsellor capabilities required to serve it.

Every category is also mapped onto NIYA's *existing* production vocabulary:

  * ``niya_focus_area_ids`` -> ``assesment_test_type_answers.id`` values, which
    are what ``coach_specializations.focus_areas`` actually stores and what
    ``booked_slots_controller#check_coach_expertise`` intersects against.
  * ``niya_expertise`` -> ``coach_specializations.expertise`` labels, which are
    what ``accounts.expertise`` stores as a JSON array.

That mapping is the integration seam: it means a triage result can be turned
into the exact focus-area ID list the current Rails matcher already consumes,
without changing the production schema.

Gaps found while mapping (documented in docs/TAXONOMY.md): NIYA has no focus
area for academic functioning, visa/immigration stress, or discrimination,
despite "I'm a student" being a selectable work context. Those categories fall
back to the nearest existing IDs and are marked ``mapping_is_approximate``.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

from .types import Urgency, UserType

# Weight conventions for inclusion signals:
#   3.0  near-defining phrase for the category
#   2.0  strong evidence
#   1.0  supporting evidence
#   0.5  ambient / weakly indicative
Signal = Tuple[str, float]


# --------------------------------------------------------------------------
# Pathways
# --------------------------------------------------------------------------


@dataclass(frozen=True)
class Pathway:
    id: str
    label: str
    description: str
    first_session_within_hours: int
    session_plan: str
    modality: str
    next_action: str


PATHWAYS: Dict[str, Pathway] = {
    "study_recovery": Pathway(
        id="study_recovery",
        label="Academic functioning recovery",
        description=(
            "Re-establish attendance, break the avoidance loop, and stabilise the "
            "academic risk before it becomes an enrolment or visa problem."
        ),
        first_session_within_hours=24,
        session_plan="4 sessions over 4 weeks, weekly",
        modality="1:1 video",
        next_action=(
            "Offer the earliest slot within 24 hours with a counsellor experienced in "
            "international student academic recovery."
        ),
    ),
    "adjustment_support": Pathway(
        id="adjustment_support",
        label="Cultural adjustment and belonging",
        description=(
            "Structured support for relocation adjustment, isolation and building a "
            "social base in the destination country."
        ),
        first_session_within_hours=72,
        session_plan="4 sessions over 6 weeks, fortnightly after session 2",
        modality="1:1 video",
        next_action="Offer a first session within 3 days; suggest peer-group option if available.",
    ),
    "workplace_performance": Pathway(
        id="workplace_performance",
        label="Work performance stabilisation",
        description=(
            "Coaching for performance pressure, workload and confidence at work, "
            "including probation and performance-review situations."
        ),
        first_session_within_hours=48,
        session_plan="4 sessions over 4 weeks",
        modality="1:1 video",
        next_action="Offer a first session within 48 hours with a workplace coach.",
    ),
    "workplace_relational": Pathway(
        id="workplace_relational",
        label="Workplace relationships and conflict",
        description=(
            "Support for manager conflict, team dynamics and communication, including "
            "the power imbalance a visa-dependent employee faces."
        ),
        first_session_within_hours=48,
        session_plan="3 sessions over 3 weeks, with a communication plan",
        modality="1:1 video",
        next_action="Offer a first session within 48 hours with a workplace conflict coach.",
    ),
    "practical_stress_navigation": Pathway(
        id="practical_stress_navigation",
        label="Immigration and practical stress navigation",
        description=(
            "Emotional support around visa, status and immigration uncertainty. "
            "Explicitly does not include legal advice."
        ),
        first_session_within_hours=48,
        session_plan="3 sessions, timed around the applicant's key dates",
        modality="1:1 video",
        next_action=(
            "Offer a session before the next immigration deadline and signpost regulated "
            "legal advice separately. Counsellors must not give immigration advice."
        ),
    ),
    "relationship_support": Pathway(
        id="relationship_support",
        label="Relationship support",
        description="Individual or couples support for relationship distress, separation and conflict.",
        first_session_within_hours=72,
        session_plan="4 sessions over 6 weeks",
        modality="1:1 or couples video",
        next_action="Offer a first session within 3 days; confirm whether the partner will attend.",
    ),
    "family_systems": Pathway(
        id="family_systems",
        label="Family expectation and boundary work",
        description=(
            "Work on parental expectation, disclosure fear and obligation, with attention "
            "to the financial and honour dynamics common in migrant families."
        ),
        first_session_within_hours=48,
        session_plan="4 sessions over 5 weeks, including a disclosure-planning session",
        modality="1:1 video",
        next_action="Offer a first session within 48 hours with a family-dynamics counsellor.",
    ),
    "sleep_restoration": Pathway(
        id="sleep_restoration",
        label="Sleep and routine restoration",
        description="Behavioural work on sleep, daily structure and routine collapse.",
        first_session_within_hours=72,
        session_plan="3 sessions over 4 weeks with between-session tracking",
        modality="1:1 video",
        next_action="Offer a session within 3 days and start a sleep and routine log immediately.",
    ),
    "grief_transition": Pathway(
        id="grief_transition",
        label="Grief and major life transition",
        description=(
            "Bereavement and major transition support, including the distinct grief of "
            "being unable to travel home for a death or illness."
        ),
        first_session_within_hours=24,
        session_plan="5 sessions over 8 weeks, paced by the client",
        modality="1:1 video",
        next_action="Offer a session within 24 hours with a bereavement-experienced counsellor.",
    ),
    "financial_counselling": Pathway(
        id="financial_counselling",
        label="Financial stress support",
        description=(
            "Emotional support and practical structuring around money stress, tuition "
            "debt and family financial obligation. Not regulated financial advice."
        ),
        first_session_within_hours=72,
        session_plan="3 sessions over 4 weeks",
        modality="1:1 video",
        next_action="Offer a session within 3 days; signpost regulated debt advice separately.",
    ),
    "identity_belonging": Pathway(
        id="identity_belonging",
        label="Identity, discrimination and belonging",
        description=(
            "Support for racism, microaggression, accent and identity pressure in the "
            "destination country."
        ),
        first_session_within_hours=48,
        session_plan="4 sessions over 6 weeks",
        modality="1:1 video",
        next_action=(
            "Offer a session within 48 hours with a counsellor who shares or deeply "
            "understands the diaspora context. Do not assign a counsellor who will need "
            "the experience explained to them."
        ),
    ),
    "stabilisation": Pathway(
        id="stabilisation",
        label="Rapid emotional stabilisation",
        description=(
            "Short-notice stabilisation for acute distress that is not an emergency, "
            "with an explicit reassessment at the end of the first session."
        ),
        first_session_within_hours=12,
        session_plan="2 stabilisation sessions, then reassess and re-triage",
        modality="1:1 video, same-day where possible",
        next_action=(
            "Offer the earliest available slot today and re-triage after session 1. "
            "Flag for coordinator awareness even if no risk indicator fired."
        ),
    ),
    "clinical_referral": Pathway(
        id="clinical_referral",
        label="Clinical assessment referral",
        description=(
            "The presentation exceeds coaching scope. Route to a clinically qualified "
            "professional and to local medical services, not to a coach."
        ),
        first_session_within_hours=24,
        session_plan="Clinical intake, then a plan set by the clinician",
        modality="1:1 video with a clinically qualified counsellor",
        next_action=(
            "Route to a clinically qualified counsellor and advise the user to contact a "
            "local doctor. NIYA must not present this as a coaching engagement."
        ),
    ),
    "crisis_escalation": Pathway(
        id="crisis_escalation",
        label="Crisis escalation to a trained human",
        description=(
            "Safety indicators present. The system stops recommending and hands over to "
            "a trained human immediately, with country-relevant emergency information."
        ),
        first_session_within_hours=0,
        session_plan="Set by the responding human, not by the system",
        modality="Immediate human contact",
        next_action=(
            "Do not auto-book. Alert the on-call safety reviewer now, show country "
            "emergency guidance to the user, and log the decision for audit."
        ),
    ),
}


# --------------------------------------------------------------------------
# Categories
# --------------------------------------------------------------------------


@dataclass(frozen=True)
class Category:
    id: str
    label: str
    description: str
    pathway_id: str
    base_urgency: Urgency
    inclusion: List[Signal]
    exclusion: List[Signal] = field(default_factory=list)
    urgency_escalators: List[Tuple[str, Urgency]] = field(default_factory=list)
    required_capabilities: List[str] = field(default_factory=list)
    preferred_capabilities: List[str] = field(default_factory=list)
    themes: List[str] = field(default_factory=list)
    user_type_priors: Dict[UserType, float] = field(default_factory=dict)
    niya_focus_area_ids: List[int] = field(default_factory=list)
    niya_expertise: List[str] = field(default_factory=list)
    mapping_is_approximate: bool = False
    clinical_boundary: bool = False
    is_safety_category: bool = False


CATEGORIES: Dict[str, Category] = {}


def _register(category: Category) -> Category:
    CATEGORIES[category.id] = category
    return category


_register(
    Category(
        id="academic_avoidance",
        label="Academic avoidance and functioning collapse",
        description=(
            "The user has disengaged from study: missed classes, unsubmitted work, "
            "avoidance of supervisors, or academic risk they are hiding."
        ),
        pathway_id="study_recovery",
        base_urgency=Urgency.MODERATE,
        inclusion=[
            ("stopped attending", 3.0),
            ("stopped going to class", 3.0),
            ("not attending classes", 3.0),
            ("skipping classes", 3.0),
            ("skipping lectures", 3.0),
            ("missing classes", 2.5),
            ("missed classes", 2.5),
            ("haven't been to class", 3.0),
            ("have not been to class", 3.0),
            ("academic probation", 3.0),
            ("attendance", 1.5),
            ("dropped out", 2.5),
            ("failing", 2.0),
            ("failed my", 2.0),
            ("behind on coursework", 2.5),
            ("behind on my assignments", 2.5),
            ("missed the deadline", 2.0),
            ("not submitted", 2.0),
            ("haven't submitted", 2.0),
            # Weak on their own, but they are often the only concrete nouns left
            # in a short complaint once figurative language is masked out.
            # Longest-match-wins means "missed the deadline" still takes
            # precedence over the bare word when both are present.
            ("deadline", 1.0),
            ("deadlines", 1.0),
            ("submission", 1.2),
            ("cannot study", 2.0),
            ("can't study", 2.0),
            ("cannot focus on my studies", 2.0),
            ("assignment", 1.5),
            ("coursework", 1.5),
            ("lectures", 1.5),
            ("semester", 1.2),
            ("my grades", 1.5),
            ("exam", 1.2),
            ("exams", 1.2),
            ("thesis", 1.5),
            ("dissertation", 1.5),
            ("my supervisor", 1.0),
            ("my professor", 1.5),
            ("university", 0.8),
            ("college", 0.8),
            ("tutor", 0.8),
            ("procrastinating", 1.2),
            ("avoiding my", 1.0),
        ],
        exclusion=[
            ("my manager", 1.5),
            ("my boss", 1.5),
            ("performance review", 1.5),
            ("my team at work", 1.5),
            ("my colleague", 1.0),
            # Not every class is a lecture. "Stopped attending my gym classes"
            # scored 0.93 for academic avoidance on the strength of "stopped
            # attending" and "classes", which is the wrong support entirely for
            # someone describing withdrawal from exercise.
            ("gym", 2.5),
            ("gym classes", 3.0),
            ("running club", 2.5),
            ("yoga", 2.0),
            ("dance class", 2.5),
            ("swimming", 2.0),
            ("football", 2.0),
        ],
        urgency_escalators=[
            ("academic probation", Urgency.HIGH),
            ("about to be deregistered", Urgency.HIGH),
            ("lose my visa", Urgency.HIGH),
            ("exam tomorrow", Urgency.HIGH),
            ("exam is tomorrow", Urgency.HIGH),
            ("final warning", Urgency.HIGH),
            ("last chance", Urgency.HIGH),
            ("dropped out", Urgency.HIGH),
        ],
        required_capabilities=["international_student_experience"],
        preferred_capabilities=[
            "academic_systems_knowledge",
            "family_dynamics",
            "south_asian_diaspora",
        ],
        themes=["avoidance", "academic risk", "shame"],
        user_type_priors={UserType.STUDENT: 1.5, UserType.PROFESSIONAL: -1.0},
        # No academic focus area exists in NIYA; nearest are fear of failure,
        # imposter syndrome, self-doubt and stress.
        niya_focus_area_ids=[69, 70, 62, 51],
        niya_expertise=["Self Confidence", "workplace coaching"],
        mapping_is_approximate=True,
    )
)

_register(
    Category(
        id="adjustment_loneliness",
        label="Adjustment, isolation and loneliness",
        description=(
            "Relocation adjustment difficulty: no social base, homesickness, culture "
            "shock, feeling permanently outside the group."
        ),
        pathway_id="adjustment_support",
        base_urgency=Urgency.LOW,
        inclusion=[
            ("no friends", 3.0),
            ("don't have any friends", 3.0),
            ("do not have any friends", 3.0),
            ("haven't made any friends", 3.0),
            ("lonely", 3.0),
            ("loneliness", 3.0),
            ("isolated", 2.5),
            ("homesick", 3.0),
            ("miss home", 2.5),
            ("miss my family", 2.0),
            ("culture shock", 3.0),
            ("don't fit in", 2.5),
            ("do not fit in", 2.5),
            ("nobody to talk to", 3.0),
            ("no one to talk to", 3.0),
            ("hard to make friends", 2.5),
            ("difficult to make friends", 2.5),
            ("everyone here already", 2.0),
            ("new country", 1.5),
            ("moved here", 1.5),
            ("just moved", 1.5),
            ("alone", 1.5),
            ("all by myself", 2.0),
            ("weekends are", 1.0),
            ("eat alone", 2.0),
            ("nobody knows me", 2.0),
        ],
        exclusion=[
            ("my partner", 0.8),
            ("my husband", 0.8),
            ("my wife", 0.8),
        ],
        urgency_escalators=[
            ("haven't spoken to anyone in weeks", Urgency.HIGH),
            ("have not spoken to anyone in weeks", Urgency.HIGH),
            ("haven't left my room", Urgency.HIGH),
            ("have not left my room", Urgency.HIGH),
        ],
        required_capabilities=["south_asian_diaspora"],
        preferred_capabilities=[
            "first_generation_migrant",
            "international_student_experience",
            "identity_and_belonging",
        ],
        themes=["isolation", "cultural adjustment", "belonging"],
        user_type_priors={UserType.STUDENT: 0.4},
        niya_focus_area_ids=[27, 95, 53, 64],
        niya_expertise=["Emotional Fitness", "Mental health"],
    )
)

_register(
    Category(
        id="work_performance_pressure",
        label="Work performance pressure",
        description=(
            "Performance anxiety, workload overwhelm, probation or performance-review "
            "pressure, and confidence collapse at work."
        ),
        pathway_id="workplace_performance",
        base_urgency=Urgency.MODERATE,
        inclusion=[
            ("performance improvement plan", 3.0),
            ("performance review", 3.0),
            ("put on a pip", 3.0),
            ("probation at work", 3.0),
            ("my probation", 2.0),
            ("workload", 2.5),
            ("overworked", 2.5),
            ("working late every", 2.0),
            ("cannot keep up at work", 3.0),
            ("can't keep up at work", 3.0),
            ("imposter syndrome", 2.5),
            ("imposter", 2.0),
            ("not good enough at my job", 2.5),
            ("underperforming", 2.5),
            ("burnt out", 2.0),
            ("burned out", 2.0),
            ("burnout", 2.0),
            ("deadlines at work", 2.0),
            ("my job", 1.2),
            ("at work", 1.0),
            ("layoff", 2.0),
            ("laid off", 2.0),
            ("lose my job", 2.0),
            ("fired", 1.8),
            ("overtime", 1.5),
            ("first job", 1.5),
            ("new role", 1.2),
            ("targets", 1.2),
            # Signals match on whole words, so "at work" never fires on "at
            # workplace" - the string is there but "work" runs into "place".
            # Every one of these was written by a real user and matched nothing
            # at all, which sent the case to generic adjustment support at 12%
            # confidence.
            ("workplace", 1.0),
            ("work place", 1.0),
            ("at my job", 1.5),
            ("in my job", 1.5),
            ("work stress", 2.5),
            ("job stress", 2.5),
            ("stress at work", 2.5),
            ("work pressure", 2.5),
            ("pressure at work", 2.5),
            ("issues at work", 2.0),
            ("problems at work", 2.0),
            ("struggling at work", 2.5),
            ("struggling in my job", 2.5),
            ("not coping at work", 2.5),
            ("workplace coaching", 2.5),
            ("career coaching", 2.0),
            ("coaching for work", 2.0),
            ("internship", 1.2),
            ("interning", 1.2),
            ("my internship", 1.5),
        ],
        exclusion=[
            ("classes", 1.5),
            ("lectures", 1.5),
            ("semester", 1.5),
            ("my professor", 1.5),
            ("coursework", 1.5),
            ("my manager", 1.0),
            ("my boss", 1.0),
        ],
        urgency_escalators=[
            ("final warning", Urgency.HIGH),
            ("termination", Urgency.HIGH),
            ("lose my visa", Urgency.HIGH),
            ("last day is", Urgency.HIGH),
            ("laid off", Urgency.HIGH),
        ],
        required_capabilities=["workplace_coaching"],
        preferred_capabilities=["south_asian_diaspora", "immigration_stress"],
        themes=["performance pressure", "workload", "confidence"],
        user_type_priors={UserType.PROFESSIONAL: 1.5, UserType.STUDENT: -1.0},
        niya_focus_area_ids=[31, 69, 70, 26],
        niya_expertise=["workplace coaching"],
    )
)

_register(
    Category(
        id="manager_conflict",
        label="Manager and workplace conflict",
        description=(
            "Interpersonal conflict at work: manager behaviour, team dynamics, "
            "exclusion, or being managed unfairly."
        ),
        pathway_id="workplace_relational",
        base_urgency=Urgency.MODERATE,
        inclusion=[
            ("my manager", 3.0),
            ("my boss", 3.0),
            ("my line manager", 3.0),
            ("my supervisor at work", 3.0),
            ("micromanaging", 3.0),
            ("micromanages", 3.0),
            ("team lead", 2.0),
            ("my colleague", 2.0),
            ("my coworker", 2.0),
            ("my co-worker", 2.0),
            ("toxic workplace", 3.0),
            ("toxic team", 2.5),
            ("bullied at work", 3.0),
            ("bullying at work", 3.0),
            ("hostile", 2.0),
            ("went to hr", 2.5),
            ("reported to hr", 2.5),
            ("passed over", 2.5),
            ("took credit for my work", 3.0),
            ("excluded from meetings", 2.5),
            ("shouts at me", 2.5),
            ("humiliated me", 2.5),
            ("toxic work place", 3.0),
            ("workplace conflict", 3.0),
            ("workplace bullying", 3.0),
            ("bullied at my workplace", 3.0),
            ("issues with my manager", 3.0),
            ("problems with my manager", 3.0),
            ("my line manager", 3.0),
            ("my team lead", 2.5),
            ("my teammates", 2.0),
            ("people at work", 1.5),
            ("in front of the team", 2.0),
            ("performance feedback", 1.2),
        ],
        exclusion=[
            ("my professor", 1.5),
            ("classes", 1.2),
            ("my partner", 1.0),
        ],
        urgency_escalators=[
            ("threatened to fire me", Urgency.HIGH),
            ("threatened my visa", Urgency.HIGH),
            ("sponsorship", Urgency.HIGH),
        ],
        required_capabilities=["workplace_coaching", "leadership_conflict"],
        preferred_capabilities=["south_asian_diaspora", "immigration_stress"],
        themes=["workplace conflict", "power imbalance", "communication"],
        user_type_priors={UserType.PROFESSIONAL: 1.5, UserType.STUDENT: -1.0},
        niya_focus_area_ids=[30, 32, 33, 34],
        niya_expertise=["workplace coaching"],
    )
)

_register(
    Category(
        id="visa_immigration_anxiety",
        label="Visa and immigration anxiety",
        description=(
            "Distress driven by immigration status, applications, refusals and the "
            "conditional nature of the user's presence in the country."
        ),
        pathway_id="practical_stress_navigation",
        base_urgency=Urgency.MODERATE,
        inclusion=[
            ("visa", 3.0),
            ("my status", 2.0),
            ("work permit", 3.0),
            ("study permit", 3.0),
            ("permanent residency", 3.0),
            ("pr application", 3.0),
            ("immigration", 3.0),
            ("deported", 3.0),
            ("deportation", 3.0),
            ("sponsorship", 2.5),
            ("green card", 3.0),
            ("h1b", 3.0),
            ("h-1b", 3.0),
            ("lmia", 3.0),
            ("biometrics", 2.0),
            ("my application was refused", 3.0),
            ("application was rejected", 2.5),
            ("visa expires", 3.0),
            ("status expires", 3.0),
            ("extension", 1.5),
            ("home office", 2.5),
            ("uscis", 3.0),
            ("ircc", 3.0),
            ("border", 1.5),
            ("have to leave the country", 3.0),
            ("sent back", 2.0),
        ],
        exclusion=[],
        urgency_escalators=[
            ("expires next week", Urgency.HIGH),
            ("expires in", Urgency.HIGH),
            ("deported", Urgency.HIGH),
            ("hearing next week", Urgency.HIGH),
            ("was refused", Urgency.HIGH),
            ("have to leave the country", Urgency.HIGH),
            ("days to", Urgency.HIGH),
        ],
        required_capabilities=["immigration_stress"],
        preferred_capabilities=["south_asian_diaspora", "first_generation_migrant"],
        themes=["status insecurity", "uncertainty", "practical stress"],
        user_type_priors={},
        # No immigration focus area exists in NIYA; nearest are anxiety and stress.
        niya_focus_area_ids=[52, 51],
        niya_expertise=["Anxiety Depression"],
        mapping_is_approximate=True,
    )
)

_register(
    Category(
        id="relationship_conflict",
        label="Relationship conflict",
        description="Distress inside a romantic relationship, including separation and breakdown.",
        pathway_id="relationship_support",
        base_urgency=Urgency.LOW,
        inclusion=[
            ("my partner", 3.0),
            ("my boyfriend", 3.0),
            ("my girlfriend", 3.0),
            ("my husband", 3.0),
            ("my wife", 3.0),
            ("my fiance", 3.0),
            ("broke up", 3.0),
            ("breakup", 3.0),
            ("break up", 2.5),
            ("we keep fighting", 3.0),
            ("we fight", 2.5),
            ("long distance", 2.5),
            ("cheated on me", 3.0),
            ("divorce", 3.0),
            ("separated", 2.0),
            ("arranged marriage", 2.5),
            ("marriage", 1.5),
            ("our relationship", 2.5),
            ("she left me", 2.5),
            ("he left me", 2.5),
        ],
        exclusion=[
            ("my manager", 1.5),
            ("my boss", 1.5),
        ],
        urgency_escalators=[],
        required_capabilities=["couples_therapy"],
        preferred_capabilities=["south_asian_diaspora", "family_dynamics"],
        themes=["relationship distress", "separation"],
        user_type_priors={UserType.COUPLE: 2.0},
        niya_focus_area_ids=[28, 29, 38, 47],
        niya_expertise=["Relationship Counselling"],
    )
)

_register(
    Category(
        id="family_parent_pressure",
        label="Family and parental pressure",
        description=(
            "Obligation, expectation and disclosure fear toward parents or family, "
            "often amplified by the family's financial investment in the migration."
        ),
        pathway_id="family_systems",
        base_urgency=Urgency.MODERATE,
        inclusion=[
            ("my parents", 3.0),
            ("my mother", 2.5),
            ("my father", 2.5),
            ("my mom", 2.5),
            ("my dad", 2.5),
            ("scared to tell my parents", 3.0),
            ("afraid to tell my parents", 3.0),
            ("cannot tell my parents", 3.0),
            ("can't tell my parents", 3.0),
            ("tell my family", 2.5),
            ("disappoint", 2.5),
            ("their expectations", 2.5),
            ("family expectations", 3.0),
            ("they sacrificed", 3.0),
            ("sold their", 3.0),
            ("took a loan", 2.5),
            ("loan for my education", 3.0),
            ("back home", 1.5),
            ("family pressure", 3.0),
            ("pressure to get married", 3.0),
            ("marriage pressure", 3.0),
            ("what will people say", 2.5),
            ("log kya kahenge", 3.0),
            ("family honour", 2.5),
            ("let them down", 2.5),
            ("proud of me", 1.5),
        ],
        exclusion=[
            ("my manager", 1.0),
        ],
        urgency_escalators=[
            ("threatened to disown", Urgency.HIGH),
            ("disown me", Urgency.HIGH),
            ("cut me off", Urgency.HIGH),
        ],
        required_capabilities=["family_dynamics", "south_asian_diaspora"],
        preferred_capabilities=["first_generation_migrant", "international_student_experience"],
        themes=["parent pressure", "obligation", "disclosure fear", "shame"],
        user_type_priors={UserType.STUDENT: 0.5},
        niya_focus_area_ids=[45, 44, 64, 62],
        niya_expertise=["Relationship Counselling", "Emotional Fitness"],
    )
)

_register(
    Category(
        id="sleep_routine_breakdown",
        label="Sleep and routine breakdown",
        description="Collapse of sleep, eating and daily structure, with or without a clear driver.",
        pathway_id="sleep_restoration",
        base_urgency=Urgency.MODERATE,
        inclusion=[
            ("cannot sleep", 3.0),
            ("can't sleep", 3.0),
            ("not sleeping", 3.0),
            ("unable to sleep", 3.0),
            ("insomnia", 3.0),
            ("awake all night", 3.0),
            ("up all night", 2.5),
            ("sleep", 1.5),
            ("sleeping all day", 3.0),
            ("oversleeping", 2.5),
            ("no routine", 2.5),
            ("lost all routine", 3.0),
            ("body clock", 2.5),
            ("skipping meals", 2.5),
            ("not eating properly", 2.5),
            ("forget to eat", 2.5),
            ("in bed all day", 3.0),
            ("stay in bed", 2.0),
            ("cannot get out of bed", 2.5),
            ("can't get out of bed", 2.5),
            ("exhausted", 1.5),
            ("no energy", 1.5),
            ("tired all the time", 2.0),
            # "sleep" does not match "sleeping", so the most ordinary way of
            # describing the problem scored zero.
            ("sleeping", 1.5),
            ("sleep issues", 3.0),
            ("sleeping issues", 3.0),
            ("sleep problems", 3.0),
            ("sleeping problems", 3.0),
            ("sleeping badly", 3.0),
            ("trouble sleeping", 3.0),
            ("difficulty sleeping", 3.0),
            ("struggling to sleep", 3.0),
            ("poor sleep", 2.5),
            ("bad sleep", 2.0),
            ("sleep schedule", 2.0),
            ("sleepless", 2.5),
            ("barely sleeping", 3.0),
            ("hardly sleeping", 3.0),
            ("keep waking up", 2.5),
            ("wake up at", 1.5),
            ("tired", 1.2),
            ("jet lag", 1.5),
            ("night shifts", 1.5),
        ],
        exclusion=[],
        urgency_escalators=[
            ("not slept in days", Urgency.HIGH),
            ("haven't slept in days", Urgency.HIGH),
            ("have not slept in days", Urgency.HIGH),
            ("not eaten in days", Urgency.HIGH),
            ("haven't eaten in days", Urgency.HIGH),
        ],
        required_capabilities=["sleep_behavioural"],
        preferred_capabilities=["south_asian_diaspora"],
        themes=["sleep disruption", "routine collapse"],
        user_type_priors={},
        niya_focus_area_ids=[77, 80, 51],
        niya_expertise=["Mental health"],
    )
)

_register(
    Category(
        id="grief_life_transition",
        label="Grief and major life transition",
        description=(
            "Bereavement, terminal illness in the family, or a major involuntary life "
            "change, including grief complicated by distance from home."
        ),
        pathway_id="grief_transition",
        base_urgency=Urgency.HIGH,
        inclusion=[
            ("passed away", 3.0),
            ("died", 3.0),
            ("death of my", 3.0),
            ("funeral", 3.0),
            ("grief", 3.0),
            ("grieving", 3.0),
            ("lost my mother", 3.0),
            ("lost my father", 3.0),
            ("lost my", 2.0),
            ("terminally ill", 3.0),
            ("diagnosed with cancer", 3.0),
            ("in hospital back home", 3.0),
            ("could not go home", 2.5),
            ("couldn't go home", 2.5),
            ("miscarriage", 3.0),
            ("last rites", 3.0),
            ("cremation", 3.0),
            ("bereavement", 3.0),
        ],
        exclusion=[
            ("lost my job", 2.5),
            ("lost my visa", 2.5),
            ("lost my phone", 2.0),
        ],
        urgency_escalators=[],
        required_capabilities=["grief_and_loss"],
        preferred_capabilities=["south_asian_diaspora", "trauma_informed"],
        themes=["bereavement", "distance from family", "transition"],
        user_type_priors={},
        niya_focus_area_ids=[72, 48, 71],
        niya_expertise=["Mental health", "Emotional Fitness"],
    )
)

_register(
    Category(
        id="financial_precarity",
        label="Financial precarity",
        description=(
            "Money stress specific to the diaspora case: tuition debt, family loans, "
            "rent insecurity and work-hour limits imposed by a visa. Added to the "
            "brief's list because it appeared in a large share of realistic scenarios "
            "and NIYA already has a Financial Wellbeing category."
        ),
        pathway_id="financial_counselling",
        base_urgency=Urgency.MODERATE,
        inclusion=[
            ("cannot afford", 3.0),
            ("can't afford", 3.0),
            ("no money", 3.0),
            ("out of money", 3.0),
            ("in debt", 3.0),
            ("debt", 2.5),
            ("education loan", 3.0),
            ("student loan", 3.0),
            ("tuition fee", 3.0),
            ("tuition fees", 3.0),
            ("pay my rent", 3.0),
            ("rent", 2.0),
            ("bills", 2.0),
            ("broke", 2.0),
            ("no savings", 2.5),
            ("financial", 2.0),
            ("money", 1.5),
            ("expensive", 1.5),
            ("send money home", 3.0),
            ("supporting my family", 2.0),
            ("part time job", 2.0),
            ("hours i can work", 2.5),
            ("twenty hours", 2.0),
        ],
        exclusion=[],
        urgency_escalators=[
            ("evicted", Urgency.HIGH),
            ("eviction", Urgency.HIGH),
            ("nowhere to live", Urgency.HIGH),
            ("nowhere to stay", Urgency.HIGH),
            ("not eaten", Urgency.HIGH),
        ],
        required_capabilities=["financial_wellbeing"],
        preferred_capabilities=["south_asian_diaspora", "international_student_experience"],
        themes=["financial stress", "obligation"],
        user_type_priors={UserType.STUDENT: 0.4},
        niya_focus_area_ids=[88, 89, 90],
        niya_expertise=["workplace coaching"],
        mapping_is_approximate=True,
    )
)

_register(
    Category(
        id="discrimination_identity",
        label="Discrimination, racism and identity",
        description=(
            "Racism, microaggression, accent and name-based exclusion, and identity "
            "pressure. Added to the brief's list because this is a defining diaspora "
            "experience and mis-routing it to generic counselling reliably fails."
        ),
        pathway_id="identity_belonging",
        base_urgency=Urgency.MODERATE,
        inclusion=[
            ("racist", 3.0),
            ("racism", 3.0),
            ("discriminated", 3.0),
            ("discrimination", 3.0),
            ("because of my accent", 3.0),
            ("my accent", 2.5),
            ("microaggression", 3.0),
            ("microaggressions", 3.0),
            ("because i am indian", 3.0),
            ("because i'm indian", 3.0),
            ("brown", 2.0),
            ("immigrant", 1.5),
            ("my name", 1.5),
            ("mispronounce", 2.5),
            ("pronounce my name", 2.5),
            ("treated differently", 2.5),
            ("left out because", 2.5),
            ("go back to your country", 3.0),
            ("go back to my country", 3.0),
            ("go back to their country", 3.0),
            ("othered", 2.5),
            ("token", 1.5),
            ("stereotype", 2.5),
            ("profiled", 2.5),
        ],
        exclusion=[],
        urgency_escalators=[
            ("physically", Urgency.HIGH),
            ("spat", Urgency.HIGH),
            ("attacked", Urgency.HIGH),
        ],
        required_capabilities=["identity_and_belonging", "south_asian_diaspora"],
        preferred_capabilities=["first_generation_migrant", "trauma_informed"],
        themes=["discrimination", "belonging", "identity"],
        user_type_priors={},
        niya_focus_area_ids=[64, 65, 61],
        niya_expertise=["Emotional Fitness", "Self Confidence"],
        mapping_is_approximate=True,
    )
)

_register(
    Category(
        id="acute_distress",
        label="Urgent emotional distress",
        description=(
            "The user is acutely overwhelmed right now but has expressed no risk "
            "indicator. Fast human contact, no clinical assumption."
        ),
        pathway_id="stabilisation",
        base_urgency=Urgency.HIGH,
        inclusion=[
            ("panic attack", 3.0),
            ("panic attacks", 3.0),
            ("breaking down", 3.0),
            ("break down", 2.0),
            ("cannot cope", 3.0),
            ("can't cope", 3.0),
            ("falling apart", 3.0),
            ("cannot function", 3.0),
            ("can't function", 3.0),
            ("overwhelmed", 2.5),
            ("crying all the time", 3.0),
            ("crying every day", 3.0),
            ("keep crying", 2.5),
            ("at my limit", 3.0),
            ("breaking point", 3.0),
            ("desperate", 2.5),
            ("hopeless", 2.5),
            ("cannot take it anymore", 3.0),
            ("can't take it anymore", 3.0),
            ("cannot do this anymore", 2.5),
            ("shaking", 2.0),
            ("chest feels tight", 2.5),
            ("i need help now", 3.0),
            ("i need to talk to someone today", 3.0),
        ],
        exclusion=[],
        urgency_escalators=[
            ("right now", Urgency.HIGH),
            ("today", Urgency.HIGH),
        ],
        required_capabilities=["crisis_intervention"],
        preferred_capabilities=["trauma_informed", "south_asian_diaspora"],
        themes=["acute distress", "overwhelm"],
        user_type_priors={},
        niya_focus_area_ids=[51, 52, 54],
        niya_expertise=["Anxiety Depression", "Mental health"],
    )
)

_register(
    Category(
        id="clinical_escalation",
        label="Possible clinical escalation",
        description=(
            "Indicators that exceed coaching scope: existing diagnosis, medication "
            "questions, prolonged functional collapse, disordered eating, dependency."
        ),
        pathway_id="clinical_referral",
        base_urgency=Urgency.HIGH,
        inclusion=[
            ("diagnosed with", 3.0),
            ("my psychiatrist", 3.0),
            ("my therapist", 2.0),
            ("medication", 3.0),
            ("antidepressant", 3.0),
            ("antidepressants", 3.0),
            ("stopped taking my", 3.0),
            ("ptsd", 3.0),
            ("bipolar", 3.0),
            ("ocd", 3.0),
            ("adhd", 2.5),
            ("eating disorder", 3.0),
            ("bulimia", 3.0),
            ("anorexia", 3.0),
            ("purging", 3.0),
            ("relapse", 3.0),
            ("drinking every day", 3.0),
            ("drinking to cope", 3.0),
            ("self medicating", 3.0),
            ("self-medicating", 3.0),
            ("dissociating", 3.0),
            ("flashbacks", 3.0),
            ("clinical depression", 3.0),
            ("severe depression", 3.0),
            ("been depressed for", 2.5),
            ("psychiatric", 3.0),
            ("hospitalised", 3.0),
            ("hospitalized", 3.0),
            ("sectioned", 3.0),
        ],
        exclusion=[],
        urgency_escalators=[
            ("stopped taking my medication", Urgency.HIGH),
            ("ran out of my medication", Urgency.HIGH),
        ],
        required_capabilities=["clinical_supervision"],
        preferred_capabilities=["trauma_informed", "south_asian_diaspora", "substance_awareness"],
        themes=["clinical indicators", "beyond coaching scope"],
        user_type_priors={},
        niya_focus_area_ids=[54, 55, 58, 60, 71, 75],
        niya_expertise=["Mental health"],
        clinical_boundary=True,
    )
)

_register(
    Category(
        id="immediate_safety_risk",
        label="Immediate safety risk",
        description=(
            "Assigned only by the safety layer. The classifier cannot select this "
            "category on lexical evidence alone."
        ),
        pathway_id="crisis_escalation",
        base_urgency=Urgency.CRITICAL,
        inclusion=[],
        exclusion=[],
        urgency_escalators=[],
        required_capabilities=["crisis_intervention", "clinical_supervision"],
        preferred_capabilities=["trauma_informed", "south_asian_diaspora"],
        themes=["safety risk"],
        user_type_priors={},
        niya_focus_area_ids=[39, 40, 60],
        niya_expertise=["Mental health"],
        is_safety_category=True,
    )
)


# --------------------------------------------------------------------------
# Cross-cutting themes
# --------------------------------------------------------------------------

# Themes are reported independently of the winning category, because the
# example in the brief lists "avoidance, sleep disruption, parent pressure,
# academic risk" for a single case.
THEME_LEXICON: Dict[str, List[str]] = {
    "avoidance": [
        "stopped attending",
        "stopped going",
        "avoiding",
        "skipping",
        "haven't been",
        "have not been",
        "ignoring emails",
        "cancelled on",
        "hiding",
    ],
    "sleep disruption": [
        "cannot sleep",
        "can't sleep",
        "not sleeping",
        "insomnia",
        "awake all night",
        "up all night",
        "sleeping all day",
        "nightmares",
    ],
    "parent pressure": [
        "my parents",
        "tell my parents",
        "disappoint",
        "they sacrificed",
        "family expectations",
        "log kya kahenge",
        "let them down",
    ],
    "academic risk": [
        "academic probation",
        "failing",
        "attendance",
        "deregistered",
        "dropped out",
        "missed the deadline",
        "my grades",
    ],
    "financial strain": [
        "cannot afford",
        "can't afford",
        "debt",
        "loan",
        "rent",
        "no money",
        "tuition",
    ],
    "isolation": [
        "lonely",
        "no friends",
        "nobody to talk to",
        "no one to talk to",
        "isolated",
        "alone",
    ],
    "shame": [
        "ashamed",
        "embarrassed",
        "failure",
        "let everyone down",
        "disappoint",
        "what will people say",
    ],
    "status insecurity": [
        "visa",
        "permit",
        "deported",
        "immigration",
        "sponsorship",
        "status expires",
    ],
    "somatic symptoms": [
        "chest",
        "headaches",
        "stomach",
        "shaking",
        "cannot breathe",
        "can't breathe",
        "heart racing",
    ],
    "functional decline": [
        "cannot function",
        "can't function",
        "stopped going",
        "in bed all day",
        "not eating",
        "stopped answering",
    ],
    "hopelessness": [
        "hopeless",
        "no point",
        "pointless",
        "nothing will change",
        "given up",
    ],
    "discrimination": [
        "racist",
        "racism",
        "discriminated",
        "my accent",
        "go back to your country",
    ],
}


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------

#: Categories the classifier is allowed to choose from on its own.
SELECTABLE_CATEGORY_IDS: List[str] = [
    cid for cid, cat in CATEGORIES.items() if not cat.is_safety_category
]


def get_category(category_id: str) -> Category:
    if category_id not in CATEGORIES:
        raise KeyError(f"Unknown category: {category_id!r}")
    return CATEGORIES[category_id]


def get_pathway(pathway_id: str) -> Pathway:
    if pathway_id not in PATHWAYS:
        raise KeyError(f"Unknown pathway: {pathway_id!r}")
    return PATHWAYS[pathway_id]


def pathway_for_category(category_id: str) -> Pathway:
    return get_pathway(get_category(category_id).pathway_id)


def niya_focus_area_ids(category_ids: List[str]) -> List[int]:
    """Translate triage categories into the focus-area IDs the existing Rails
    matcher (`check_coach_expertise`) already intersects against."""
    seen: List[int] = []
    for cid in category_ids:
        category = CATEGORIES.get(cid)
        if category is None:
            continue
        for fid in category.niya_focus_area_ids:
            if fid not in seen:
                seen.append(fid)
    return seen


def niya_expertise_labels(category_ids: List[str]) -> List[str]:
    """Translate triage categories into `coach_specializations.expertise` labels."""
    seen: List[str] = []
    for cid in category_ids:
        category = CATEGORIES.get(cid)
        if category is None:
            continue
        for label in category.niya_expertise:
            if label not in seen:
                seen.append(label)
    return seen


def all_capabilities() -> List[str]:
    caps: List[str] = []
    for category in CATEGORIES.values():
        for cap in list(category.required_capabilities) + list(category.preferred_capabilities):
            if cap not in caps:
                caps.append(cap)
    return sorted(caps)
