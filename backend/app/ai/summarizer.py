"""AI: Summarizer — rule-based extractive summarizer with entity extraction."""

from __future__ import annotations

import re
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Common Indian names for entity detection (partial list for demo)
_NAME_PREFIXES = [
    "mr", "mrs", "ms", "shri", "smt", "kumari",
]

# Place indicators
_PLACE_KEYWORDS = [
    "near", "at", "in", "behind", "next to", "opposite",
    "junction", "road", "street", "nagar", "colony", "layout",
    "market", "station", "bus stop", "hospital", "school",
]


def summarize_case(description: str, max_sentences: int = 3) -> str:
    """
    Generate a structured summary of a case description.

    Strategy:
    1. Split into sentences
    2. Score sentences by importance (entity density, action verbs)
    3. Extract key entities (names, places, dates)
    4. Return top sentences + entity summary
    """
    if not description or not description.strip():
        return "No description provided."

    sentences = _split_sentences(description)

    if len(sentences) <= max_sentences:
        return description.strip()

    # Score each sentence
    scored = []
    for sent in sentences:
        score = _score_sentence(sent)
        scored.append((sent, score))

    # Sort by score, take top N
    scored.sort(key=lambda x: x[1], reverse=True)
    top_sentences = [s for s, _ in scored[:max_sentences]]

    # Re-order by original position for coherence
    ordered = sorted(top_sentences, key=lambda s: description.index(s) if s in description else 0)

    summary = ". ".join(s.strip().rstrip(".") for s in ordered) + "."

    # Append entity summary
    entities = extract_entities(description)
    entity_parts = []
    if entities["names"]:
        entity_parts.append(f"Persons involved: {', '.join(entities['names'][:3])}")
    if entities["places"]:
        entity_parts.append(f"Locations: {', '.join(entities['places'][:2])}")
    if entity_parts:
        summary += " " + " ".join(entity_parts)

    return summary


def extract_entities(text: str) -> dict:
    """
    Extract key entities from case description text.
    Returns {names: [...], places: [...], dates: [...], amounts: [...]}
    """
    entities: dict[str, list[str]] = {
        "names": [],
        "places": [],
        "dates": [],
        "amounts": [],
    }

    # Names: capitalized words near name prefixes
    name_pattern = r"(?:mr|mrs|ms|shri|smt|kumari)\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)"
    for match in re.finditer(name_pattern, text, re.IGNORECASE):
        name = match.group(1).strip()
        if name and name not in entities["names"]:
            entities["names"].append(name)

    # Standalone capitalized proper nouns (potential names/places)
    proper_nouns = re.findall(r"\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})*)\b", text)
    for noun in proper_nouns:
        if noun.lower() not in {"the", "and", "but", "for", "not", "was", "had", "case", "police", "station", "report"}:
            if noun not in entities["names"] and noun not in entities["places"]:
                # Heuristic: if preceded by a place keyword, it's a place
                idx = text.find(noun)
                preceding = text[max(0, idx - 20):idx].lower()
                if any(pk in preceding for pk in _PLACE_KEYWORDS):
                    entities["places"].append(noun)
                elif len(entities["names"]) < 5:
                    entities["names"].append(noun)

    # Dates
    date_patterns = [
        r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b",
        r"\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b",
    ]
    for pattern in date_patterns:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            date_str = match.group(1)
            if date_str not in entities["dates"]:
                entities["dates"].append(date_str)

    # Amounts (money)
    amount_pattern = r"(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{2})?)"
    for match in re.finditer(amount_pattern, text):
        entities["amounts"].append(f"Rs. {match.group(1)}")

    return entities


def _split_sentences(text: str) -> list[str]:
    """Split text into sentences."""
    # Handle common abbreviations
    text = re.sub(r"\b(e\.g|i\.e|vs|Dr|Mr|Mrs|Ms)\.", r"\1<DOT>", text)
    sentences = re.split(r"(?<=[.!?])\s+", text)
    return [s.replace("<DOT>", ".").strip() for s in sentences if s.strip()]


def _score_sentence(sentence: str) -> float:
    """Score a sentence by importance for summarization."""
    score = 0.0
    lower = sentence.lower()

    # Action verbs indicate important events
    action_verbs = [
        "arrested", "registered", "filed", "occurred", "incident",
        "suspect", "victim", "accused", "police", "investigation",
        "evidence", "witness", "cctv", "forensic", "statement",
        "stolen", "recovered", "detected", "charged", "convicted",
    ]
    for verb in action_verbs:
        if verb in lower:
            score += 1.0

    # Entity density bonus
    if re.search(r"[A-Z][a-z]+", sentence):
        score += 0.5

    # Specificity (numbers, dates)
    if re.search(r"\d+", sentence):
        score += 0.3

    # First and last sentences often contain key info
    score += 0.2

    # Penalize very short sentences
    if len(sentence.split()) < 4:
        score -= 0.5

    return score
