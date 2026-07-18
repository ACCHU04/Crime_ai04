"""
AI: Rule-based SQL Agent — no LLM required.

Architecture:
    run_nl_query(query)
        └── QueryParser.parse(query)   → ParsedIntent (entities extracted)
        └── SQLBuilder.build(intent)   → sql string + params
        └── execute_query(sql, params) → List[dict] results

Supported query patterns (all case-insensitive):
  Crime type:   "show burglary cases", "theft cases", "cyber crime", "murder"
  Location:     "cases in Mysuru", "crimes in Bengaluru"
  FIR:          "show FIR 102", "FIR number FIR2026001"
  Status:       "pending investigations", "open cases", "closed cases"
  Time:         "cases this month", "cases this year"
  Combined:     "burglary cases in Mysuru", "pending theft in Bengaluru"
  Catchall:     "show all cases", "all FIRs", "list cases"

To add a new pattern: add a keyword to _CRIME_TYPES or _DISTRICTS,
or add a new branch in QueryParser.parse() — nothing else changes.
"""

from __future__ import annotations

import re
import logging
from dataclasses import dataclass, field
from typing import Optional

from sqlalchemy.orm import Session

from app.services.database_service import execute_query

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Known entities (extend as the dataset grows)
# ---------------------------------------------------------------------------

_CRIME_TYPES: dict[str, str] = {
    # keyword in query         : exact crimesubheadname in DB
    "burglary":                  "burglary",
    "theft":                     "theft",
    "robbery":                   "robbery",
    "murder":                    "murder",
    "assault":                   "assault",
    "rape":                      "rape",
    "kidnapping":                "kidnapping",
    "cyber crime":               "cyber crime",
    "cybercrime":                "cyber crime",
    "fraud":                     "fraud",
    "cheating":                  "cheating",
    "dacoity":                   "dacoity",
    "hit and run":               "hit and run",
    "motor vehicle theft":       "motor vehicle theft",
    "chain snatching":           "chain snatching",
}

_DISTRICTS: list[str] = [
    "mysuru", "mysore",
    "bengaluru", "bangalore",
    "mangaluru", "mangalore",
    "hubballi", "hubli",
    "belagavi", "belgaum",
    "dharwad",
    "kalaburagi", "gulbarga",
    "shivamogga", "shimoga",
    "tumakuru", "tumkur",
    "vijayapura", "bijapur",
    "ballari", "bellary",
    "raichur",
    "davangere",
    "hassan",
    "udupi",
    "chitradurga",
    "kodagu", "coorg",
]

# District aliases → canonical name for the DB lookup
_DISTRICT_ALIASES: dict[str, str] = {
    "mysore":    "mysuru",
    "bangalore": "bengaluru",
    "mangalore": "mangaluru",
    "hubli":     "hubballi",
    "belgaum":   "belagavi",
    "gulbarga":  "kalaburagi",
    "shimoga":   "shivamogga",
    "tumkur":    "tumakuru",
    "bijapur":   "vijayapura",
    "bellary":   "ballari",
    "coorg":     "kodagu",
}

_STATUS_KEYWORDS: dict[str, str] = {
    "pending":              "Under Investigation",
    "under investigation":  "Under Investigation",
    "chargesheet":          "Chargesheet Filed",
    "closed":               "Closed",
    "trial":                "Pending Trial",
    "convicted":            "Convicted",
    "acquitted":            "Acquitted",
}


# ---------------------------------------------------------------------------
# Parsed intent dataclass
# ---------------------------------------------------------------------------

@dataclass
class ParsedIntent:
    crime_type:  Optional[str] = None   # normalised DB value
    district:    Optional[str] = None   # normalised DB value
    fir_number:  Optional[str] = None   # e.g. "FIR2026001"
    status:      Optional[str] = None   # DB status string
    this_month:  bool          = False
    this_year:   bool          = False
    list_all:    bool          = False  # "show all cases / all FIRs"


# ---------------------------------------------------------------------------
# Parser — extracts entities from natural language
# ---------------------------------------------------------------------------

class QueryParser:
    """Extract structured intent from a free-text query string."""

    # FIR patterns: "FIR 102", "FIR-2026-001", "FIR number FIR2026001"
    _FIR_RE = re.compile(r"\bfir[\s\-]*([\w\d]+)\b", re.IGNORECASE)

    def parse(self, query: str) -> ParsedIntent:
        q = query.lower().strip()
        intent = ParsedIntent()

        # --- FIR number ---
        m = self._FIR_RE.search(q)
        if m:
            intent.fir_number = m.group(1).upper()
            return intent          # FIR lookup is precise — ignore other filters

        # --- Crime type (longest match wins) ---
        for keyword in sorted(_CRIME_TYPES, key=len, reverse=True):
            if keyword in q:
                intent.crime_type = _CRIME_TYPES[keyword]
                break

        # --- District ---
        for district in sorted(_DISTRICTS, key=len, reverse=True):
            if district in q:
                canon = _DISTRICT_ALIASES.get(district, district)
                intent.district = canon
                break

        # --- Status ---
        for keyword, status_value in _STATUS_KEYWORDS.items():
            if keyword in q:
                intent.status = status_value
                break

        # --- Time filters ---
        if "this month" in q or "current month" in q:
            intent.this_month = True
        elif "this year" in q or "current year" in q:
            intent.this_year = True

        # --- Catchall: "all cases", "all firs", "list cases" ---
        if not any([intent.crime_type, intent.district,
                    intent.status, intent.this_month, intent.this_year]):
            intent.list_all = True

        return intent


# ---------------------------------------------------------------------------
# SQL Builder — constructs parameterised SQL from ParsedIntent
# ---------------------------------------------------------------------------

_BASE_FROM = """
FROM   casemaster c
JOIN   crimesubhead cs ON c.crimesubheadid = cs.crimesubheadid
JOIN   district     d  ON c.districtid     = d.districtid
JOIN   casestatus   cst ON c.casestatusid  = cst.casestatusid
"""

_BASE_SELECT = f"""
    SELECT
        c.caseid,
        c.firnumber,
        c.occurrencedate,
        cs.crimesubheadname          AS crime_type,
        d.districtname               AS district,
        cst.statusname               AS status
    {_BASE_FROM}
"""


class SQLBuilder:
    """Build a parameterised SQL query from a ParsedIntent."""

    def build(self, intent: ParsedIntent) -> tuple[str, dict]:
        """Returns (sql_string, params_dict)."""

        # --- Single FIR lookup ---
        if intent.fir_number:
            sql = _BASE_SELECT + "WHERE UPPER(c.firnumber) = :fir"
            return sql, {"fir": intent.fir_number}

        # --- Filtered query ---
        clauses: list[str] = []
        params:  dict      = {}

        if intent.crime_type:
            clauses.append("LOWER(cs.crimesubheadname) = :crime_type")
            params["crime_type"] = intent.crime_type.lower()

        if intent.district:
            clauses.append("LOWER(d.districtname) = :district")
            params["district"] = intent.district.lower()

        if intent.status:
            clauses.append("LOWER(cst.statusname) = :status")
            params["status"] = intent.status.lower()

        if intent.this_month:
            clauses.append(
                "DATE_TRUNC('month', c.occurrencedate) = DATE_TRUNC('month', CURRENT_DATE)"
            )

        if intent.this_year:
            clauses.append(
                "DATE_TRUNC('year', c.occurrencedate) = DATE_TRUNC('year', CURRENT_DATE)"
            )

        where = ("WHERE " + "\n      AND ".join(clauses)) if clauses else ""
        sql = _BASE_SELECT + where + "\nORDER BY c.occurrencedate DESC\nLIMIT 100"
        return sql, params


# ---------------------------------------------------------------------------
# Public API — called by the orchestrator
# ---------------------------------------------------------------------------

_parser = QueryParser()
_builder = SQLBuilder()


def run_nl_query(natural_language_query: str, db: Session | None = None) -> dict:
    """
    Parse a natural-language query, build SQL, execute it, return results.

    Args:
        natural_language_query: Free-text from the user.
        db: Optional — not used (database_service manages its own session),
            kept for backward-compat with the orchestrator signature.

    Returns:
        {
            "query":   original text,
            "intent":  parsed intent summary,
            "sql":     executed SQL string,
            "results": list of row dicts,
            "count":   number of rows returned,
        }
    """
    logger.info("sql_agent parsing: %r", natural_language_query)

    intent = _parser.parse(natural_language_query)
    sql, params = _builder.build(intent)

    logger.debug("sql_agent executing SQL:\n%s\nparams=%s", sql, params)

    results = execute_query(sql, params)

    return {
        "query":   natural_language_query,
        "intent": {
            "crime_type": intent.crime_type,
            "district":   intent.district,
            "fir_number": intent.fir_number,
            "status":     intent.status,
            "this_month": intent.this_month,
            "this_year":  intent.this_year,
            "list_all":   intent.list_all,
        },
        "sql":     sql.strip(),
        "results": results,
        "count":   len(results),
    }
