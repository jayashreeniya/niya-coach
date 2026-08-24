"""Text normalisation and phrase matching shared by the safety layer and the
classifier.

Deliberately boring and deterministic: the same input must always produce the
same spans, because the safety layer's decisions are audited.
"""

from __future__ import annotations

import re
import unicodedata
from functools import lru_cache
from typing import Iterable, List, Tuple

# Characters kept during normalisation. Apostrophes are preserved so "can't"
# survives, hyphens so "h-1b" and "self-medicating" survive.
_KEEP = re.compile(r"[^a-z0-9'\- ]+")
_WHITESPACE = re.compile(r"\s+")

_APOSTROPHES = {
    "\u2018": "'",
    "\u2019": "'",
    "\u201b": "'",
    "\u02bc": "'",
    "\u00b4": "'",
    "`": "'",
}

_DASHES = {
    "\u2010": "-",
    "\u2011": "-",
    "\u2012": "-",
    "\u2013": "-",
    "\u2014": "-",
    "\u2015": "-",
}


def normalise(text: str) -> str:
    """Lowercase, fold unicode punctuation, strip everything else to spaces."""
    if not text:
        return ""
    text = unicodedata.normalize("NFKC", text)
    for source, target in _APOSTROPHES.items():
        text = text.replace(source, target)
    for source, target in _DASHES.items():
        text = text.replace(source, target)
    text = text.lower()
    text = _KEEP.sub(" ", text)
    text = _WHITESPACE.sub(" ", text)
    return text.strip()


@lru_cache(maxsize=4096)
def _phrase_pattern(phrase: str) -> "re.Pattern[str]":
    """Word-boundary-ish match that tolerates apostrophes and hyphens.

    Plain ``\\b`` misbehaves around apostrophes, so explicit lookarounds on the
    alphanumeric class are used instead.
    """
    escaped = re.escape(phrase.strip().lower())
    # Allow flexible internal whitespace so "can  not" still matches "can not".
    escaped = escaped.replace(r"\ ", r"\s+")
    return re.compile(r"(?<![a-z0-9])" + escaped + r"(?![a-z0-9])")


@lru_cache(maxsize=2048)
def _regex_pattern(pattern: str) -> "re.Pattern[str]":
    return re.compile(pattern)


def find_phrase_spans(normalised_text: str, phrase: str) -> List[Tuple[int, int]]:
    return [m.span() for m in _phrase_pattern(phrase).finditer(normalised_text)]


def contains_phrase(normalised_text: str, phrase: str) -> bool:
    return _phrase_pattern(phrase).search(normalised_text) is not None


def contains_any_phrase(normalised_text: str, phrases: Iterable[str]) -> bool:
    return any(contains_phrase(normalised_text, phrase) for phrase in phrases)


def find_regex_spans(normalised_text: str, pattern: str) -> List[Tuple[int, int]]:
    return [m.span() for m in _regex_pattern(pattern).finditer(normalised_text)]


def window(normalised_text: str, start: int, end: int, size: int = 70) -> str:
    """Characters surrounding a match, used for negation and attribution checks."""
    lo = max(0, start - size)
    hi = min(len(normalised_text), end + size)
    return normalised_text[lo:hi]


def preceding(normalised_text: str, start: int, size: int = 70) -> str:
    return normalised_text[max(0, start - size) : start]


def word_count(normalised_text: str) -> int:
    if not normalised_text:
        return 0
    return len(normalised_text.split())


_SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+")


def sentences(raw_text: str) -> List[str]:
    if not raw_text:
        return []
    return [part.strip() for part in _SENTENCE_SPLIT.split(raw_text.strip()) if part.strip()]


def mask_spans(text: str, spans: Iterable[Tuple[int, int]]) -> str:
    """Blank out character ranges, preserving offsets so later spans stay valid."""
    if not text:
        return text
    chars = list(text)
    for start, end in spans:
        for index in range(max(0, start), min(len(chars), end)):
            chars[index] = " "
    return "".join(chars)


# --------------------------------------------------------------------------
# Figurative language
# --------------------------------------------------------------------------

# English is full of death and violence metaphors that mean nothing of the sort.
# These are masked out before ANY analysis - both the safety layer and the
# classifier - because they mislead both.
#
# This list lives here rather than in safety.py because it turned out the
# classifier needed it just as much: "my laptop battery died" was scoring 3.0 on
# the grief category's "died" signal and routing a deadline complaint to a
# bereavement specialist at high urgency.
#
# The list is deliberately short and literal. Every entry must be a phrase that
# is figurative in essentially all contexts - anything ambiguous belongs in the
# safety layer's softening ladder instead, where it downgrades rather than
# disappears.
FIGURATIVE_PATTERNS: Tuple[str, ...] = (
    # One optional intervening adverb, so "is absolutely killing me" matches too.
    r"(?:is|are|was|were|it'?s|this is|they'?re)\s+(?:\w+\s+)?killing\s+me",
    r"killing\s+me\s+(?:softly|slowly)\b",
    r"\bdying\s+to\s+(?:go|see|meet|eat|know|visit|try|get|hear|find)\b",
    r"\bdying\s+for\s+a\b",
    r"\bdead\s+tired\b",
    r"\bbored\s+to\s+death\b",
    r"\bscared\s+to\s+death\s+of\s+(?:public speaking|flying|spiders|exams?)\b",
    r"\bcould\s+(?:kill|murder)\s+for\s+a\b",
    r"\bkill\s+time\b",
    r"\bkilled\s+it\b",
    r"\bdead\s+line\b",
    r"\bdied\s+laughing\b",
    # Devices and services "dying" - the source of the grief false positive.
    r"\b(?:my\s+)?(?:phone|laptop|computer|battery|car|wifi|internet|signal|screen|charger)\s+died\b",
    r"\bbattery\s+(?:is\s+)?dead\b",
    r"\bdead\s+(?:battery|zone|end)\b",
)


def mask_figurative(normalised_text: str) -> Tuple[str, List[str]]:
    """Blank out figurative death/violence idioms.

    Returns (masked_text, matched_idioms). Offsets are preserved, so spans found
    afterwards still index correctly into the original normalised string.
    """
    if not normalised_text:
        return normalised_text, []

    spans: List[Tuple[int, int]] = []
    matched: List[str] = []
    for pattern in FIGURATIVE_PATTERNS:
        for start, end in find_regex_spans(normalised_text, pattern):
            spans.append((start, end))
            matched.append(normalised_text[start:end])

    if not spans:
        return normalised_text, []
    return mask_spans(normalised_text, spans), matched
