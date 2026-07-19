"""
AI Orchestrator — single entry point for all AI operations.

Responsibilities:
  1. Classify incoming request intent
  2. Route to the appropriate agent / service
  3. Return a unified OrchestratorResult so callers never import individual agents directly

Flow:
    router / service
        └── orchestrator.run(request)
                ├── sql_agent.run_nl_query()          → "show me all open cases in Delhi"
                ├── analytics_service.*                → "which district has the highest crime?"
                ├── graph_service.*                    → "show associates of Ramesh"
                ├── investigation_agent.investigate()  → "investigate case FIR-2024-001"
                └── summarizer.summarize_case()        → "summarize case description …"

Intent classification is keyword-based now; swap _classify_intent() with an
LLM classifier (e.g. OpenAI function-calling) when ready.
"""

from __future__ import annotations

import enum
import logging
from dataclasses import dataclass, field
from typing import Any, Optional

from sqlalchemy.orm import Session

from app.ai import sql_agent, investigation_agent, summarizer

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Intent enum
# ---------------------------------------------------------------------------

class Intent(str, enum.Enum):
    SQL_QUERY   = "sql_query"       # natural-language → SQL data retrieval
    ANALYTICS   = "analytics"       # dashboard stats, trends, hotspots
    GRAPH       = "graph"           # criminal network / relationship queries
    INVESTIGATE = "investigate"     # deep case analysis / reasoning
    SUMMARIZE   = "summarize"       # condense a description
    UNKNOWN     = "unknown"         # fallback / unrecognised


# ---------------------------------------------------------------------------
# Unified result shape
# ---------------------------------------------------------------------------

@dataclass
class OrchestratorResult:
    intent:   Intent
    agent:    str                    # which agent handled this
    payload:  Any                    # agent-specific output
    error:    Optional[str] = None   # set if an exception occurred
    metadata: dict         = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Request shapes
# ---------------------------------------------------------------------------

@dataclass
class OrchestratorRequest:
    """
    Callers build this and pass it to Orchestrator.run().

    - query:       free-text from the user / upstream service
    - case_data:   pre-fetched case dict (required for INVESTIGATE / SUMMARIZE)
    - db:          SQLAlchemy session (required for SQL_QUERY, ANALYTICS, GRAPH)
    - intent_hint: skip classification and force a specific intent
    """
    query:       str
    case_data:   Optional[dict]   = None
    db:          Optional[Session] = None
    intent_hint: Optional[Intent]  = None


# ---------------------------------------------------------------------------
# Keyword-based intent classifier (replace with LLM when ready)
# ---------------------------------------------------------------------------

_GRAPH_KEYWORDS = frozenset({
    "network", "associates", "connected", "linked", "common accused",
    "relationships", "connections", "who knows whom", "repeat offender network",
    "criminal network", "gang", " associates of", "associate of",
    "who is connected", "linked to", "knows whom", "relationship between",
})

_ANALYTICS_KEYWORDS = frozenset({
    "dashboard", "stats", "statistics", "summary", "trend", "trends",
    "hotspot", "hotspots", "pending", "repeat offender", "highest crime",
    "most cases", "increasing", "decreasing", "crime rate", "crime summary",
    "which district", "which crime", "overall", "overview of crime",
    "how many cases", "total cases", "convicted", "closed cases",
    "district wise", "crime wise", "compare districts", "compare crimes",
    "monthly", "weekly", "yearly", "last month", "this year",
    "repeat offenders", "serial", "pattern", "cluster",
})

_INVESTIGATE_KEYWORDS = frozenset({
    "investigate", "analyse", "analyze", "deep dive", "cross-reference",
    "suspect history", "pattern", "link", "connect", "related cases",
    "who did", "suspect", "motive", "evidence", "alibi",
    "timeline of", "what happened", "case details", "case summary",
    "case for", "brief on", "analysis of",
})

_SUMMARIZE_KEYWORDS = frozenset({
    "summarize", "summarise", "brief", "overview", "tldr",
    "short description", "in brief", "summary", "tell me about",
    "describe", "what is this case about", "explain",
})

_SQL_KEYWORDS = frozenset({
    "show", "list", "count", "how many", "find", "get", "fetch",
    "select", "search", "give me", "what are", "which",
    "display", "retrieve", "lookup", "look up", "all cases",
    "all firs", "pending cases", "open cases",
})


def _classify_intent(query: str) -> Intent:
    """
    Keyword scan → Intent.  Order matters: most specific first.
    Swap for an LLM classifier in production.
    """
    lower = query.lower()

    # Graph queries are very specific — check first
    if any(kw in lower for kw in _GRAPH_KEYWORDS):
        return Intent.GRAPH

    # Analytics queries — specific analytical language
    if any(kw in lower for kw in _ANALYTICS_KEYWORDS):
        return Intent.ANALYTICS

    if any(kw in lower for kw in _INVESTIGATE_KEYWORDS):
        return Intent.INVESTIGATE

    if any(kw in lower for kw in _SUMMARIZE_KEYWORDS):
        return Intent.SUMMARIZE

    if any(kw in lower for kw in _SQL_KEYWORDS):
        return Intent.SQL_QUERY

    return Intent.UNKNOWN


# ---------------------------------------------------------------------------
# Orchestrator
# ---------------------------------------------------------------------------

class Orchestrator:
    """
    Stateless orchestrator — instantiate once (e.g. at app startup) and
    call .run() for every incoming AI request.
    """

    def run(self, request: OrchestratorRequest) -> OrchestratorResult:
        """
        Classify → route → return OrchestratorResult.
        Never raises; exceptions are caught and surfaced in result.error.
        """
        intent = request.intent_hint or _classify_intent(request.query)
        logger.info("Orchestrator routing intent=%s query=%r", intent, request.query[:80])

        try:
            if intent == Intent.SQL_QUERY:
                return self._handle_sql(request, intent)

            if intent == Intent.ANALYTICS:
                return self._handle_analytics(request, intent)

            if intent == Intent.GRAPH:
                return self._handle_graph(request, intent)

            if intent == Intent.INVESTIGATE:
                return self._handle_investigate(request, intent)

            if intent == Intent.SUMMARIZE:
                return self._handle_summarize(request, intent)

            # UNKNOWN — return a helpful fallback
            return OrchestratorResult(
                intent=intent,
                agent="none",
                payload={"message": "Could not determine intent. Try rephrasing your query."},
                metadata={"query": request.query},
            )

        except Exception as exc:  # noqa: BLE001
            logger.exception("Orchestrator error for query=%r", request.query)
            return OrchestratorResult(
                intent=intent,
                agent="error",
                payload=None,
                error=str(exc),
            )

    # ------------------------------------------------------------------
    # Private handlers
    # ------------------------------------------------------------------

    def _handle_sql(self, req: OrchestratorRequest, intent: Intent) -> OrchestratorResult:
        result = sql_agent.run_nl_query(
            natural_language_query=req.query,
            db=req.db,
        )
        return OrchestratorResult(intent=intent, agent="sql_agent", payload=result)

    def _handle_analytics(self, req: OrchestratorRequest, intent: Intent) -> OrchestratorResult:
        from app.services.analytics_service import (
            get_dashboard_stats, get_monthly_trend, get_repeat_offenders, get_pending_cases,
        )
        from app.services.hotspot import calculate_hotspots

        if not req.db:
            return OrchestratorResult(
                intent=intent, agent="analytics_service",
                payload=None, error="Database session required for analytics queries.",
            )

        lower = req.query.lower()

        if any(kw in lower for kw in ("dashboard", "overall", "total")):
            stats = get_dashboard_stats(req.db)
            return OrchestratorResult(
                intent=intent, agent="analytics_service",
                payload={"type": "dashboard", "data": stats.model_dump()},
            )

        if any(kw in lower for kw in ("hotspot", "hotspots", "which district", "highest crime")):
            hotspots = calculate_hotspots(req.db, top_n=10)
            return OrchestratorResult(
                intent=intent, agent="analytics_service",
                payload={"type": "hotspots", "data": hotspots},
            )

        if any(kw in lower for kw in ("trend", "trends", "increasing", "decreasing", "monthly")):
            trends = get_monthly_trend(req.db, months=12)
            return OrchestratorResult(
                intent=intent, agent="analytics_service",
                payload={"type": "trends", "data": [t.model_dump() for t in trends]},
            )

        if any(kw in lower for kw in ("repeat offender", "repeat offenders")):
            offenders = get_repeat_offenders(req.db, min_cases=2)
            return OrchestratorResult(
                intent=intent, agent="analytics_service",
                payload={"type": "repeat_offenders", "data": [r.model_dump() for r in offenders]},
            )

        if any(kw in lower for kw in ("pending", "open cases", "under investigation")):
            pending = get_pending_cases(req.db)
            return OrchestratorResult(
                intent=intent, agent="analytics_service",
                payload={"type": "pending_cases", "data": [p.model_dump() for p in pending]},
            )

        # Default: return dashboard stats
        stats = get_dashboard_stats(req.db)
        return OrchestratorResult(
            intent=intent, agent="analytics_service",
            payload={"type": "dashboard", "data": stats.model_dump()},
        )

    def _handle_graph(self, req: OrchestratorRequest, intent: Intent) -> OrchestratorResult:
        from app.services.graph_service import (
            build_crime_graph, get_person_associates, get_common_accused,
        )

        if not req.db:
            return OrchestratorResult(
                intent=intent, agent="graph_service",
                payload=None, error="Database session required for graph queries.",
            )

        lower = req.query.lower()

        # Extract person name from query: "associates of Ramesh" → "Ramesh"
        if "associates of" in lower:
            name_part = lower.split("associates of")[-1].strip()
            # Take the first word(s) as the name
            person_name = name_part.split()[0].strip().title() if name_part else ""
            if person_name:
                result = get_person_associates(req.db, person_name)
                return OrchestratorResult(
                    intent=intent, agent="graph_service",
                    payload={"type": "person_network", "data": result.model_dump()},
                )

        if any(kw in lower for kw in ("common accused", "repeat offender network")):
            result = get_common_accused(req.db)
            return OrchestratorResult(
                intent=intent, agent="graph_service",
                payload={"type": "common_accused", "data": result.model_dump()},
            )

        # Default: return full crime network
        result = build_crime_graph(req.db)
        return OrchestratorResult(
            intent=intent, agent="graph_service",
            payload={"type": "full_network", "data": result.model_dump()},
        )

    def _handle_investigate(self, req: OrchestratorRequest, intent: Intent) -> OrchestratorResult:
        case_data = req.case_data or {"query": req.query}
        result = investigation_agent.investigate(case_data=case_data, db=req.db)
        return OrchestratorResult(intent=intent, agent="investigation_agent", payload=result)

    def _handle_summarize(self, req: OrchestratorRequest, intent: Intent) -> OrchestratorResult:
        case_data = req.case_data or {}
        text = case_data.get("description", case_data.get("brief_facts", req.query))
        summary = summarizer.summarize_case(description=text)
        return OrchestratorResult(
            intent=intent,
            agent="summarizer",
            payload={"summary": summary},
        )


# ---------------------------------------------------------------------------
# Module-level singleton — import and use directly
# ---------------------------------------------------------------------------

orchestrator = Orchestrator()
