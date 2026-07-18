"""Pydantic response models for analytics and graph endpoints."""
from datetime import datetime, timezone
from typing import Any, Optional
from pydantic import BaseModel


# ── Generic API Envelope ───────────────────────────────────
class APIResponse(BaseModel):
    success: bool = True
    data: Any = None
    count: int = 0
    generated_at: str = ""


def wrap(data: Any, count: int | None = None) -> dict:
    """Wrap any analytics response in the standard envelope."""
    return {
        "success": True,
        "data": data,
        "count": count if count is not None else (len(data) if isinstance(data, list) else 1),
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


# ── Dashboard ──────────────────────────────────────────────
class DashboardStats(BaseModel):
    total_cases: int
    pending_cases: int
    closed_cases: int
    convicted_cases: int
    top_district: Optional[str] = None
    top_crime_type: Optional[str] = None


# ── Hotspots ───────────────────────────────────────────────
class HotspotEntry(BaseModel):
    district: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    case_count: int


# ── Monthly Trend ──────────────────────────────────────────
class MonthlyTrend(BaseModel):
    month: str
    count: int


class CrimeTypeTrend(BaseModel):
    crime_type: str
    trends: list[MonthlyTrend]


# ── Repeat Offenders ──────────────────────────────────────
class RepeatOffender(BaseModel):
    accused_id: int
    full_name: str
    alias: Optional[str] = None
    case_count: int
    cases: list[str]
    status: str


# ── Pending Cases ──────────────────────────────────────────
class PendingCase(BaseModel):
    case_id: int
    case_number: str
    title: str
    crime_type: str
    district: str
    status: str
    incident_date: Optional[datetime] = None
    days_pending: int


# ── Graph ──────────────────────────────────────────────────
class GraphNode(BaseModel):
    id: str
    type: str
    label: str
    metadata: Optional[dict] = None


class GraphEdge(BaseModel):
    source: str
    target: str
    type: str


class GraphStats(BaseModel):
    total_nodes: int
    total_edges: int
    connected_components: int
    cases: int
    accused_persons: int
    victims: int


class GraphResult(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]
    stats: GraphStats
