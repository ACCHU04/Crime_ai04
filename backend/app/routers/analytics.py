"""Router: /analytics — aggregated crime statistics and dashboard."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app import models
from app.models.casestatus import CaseStatusLookup
from app.models.crimesubhead import CrimeSubHead
from app.schemas.analytics import wrap
from app.services.analytics_service import (
    get_dashboard_stats,
    get_monthly_trend,
    get_repeat_offenders,
    get_pending_cases,
)
from app.services.hotspot import calculate_hotspots

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# ── Original endpoints (now using correct model attributes) ──

@router.get("/crime-type-summary")
def crime_type_summary(db: Session = Depends(get_db)):
    """Count of cases grouped by crime subhead name."""
    rows = (
        db.query(CrimeSubHead.crime_subhead_name, func.count(models.CaseMaster.id).label("count"))
        .join(models.CaseMaster, models.CaseMaster.crime_subhead_id == CrimeSubHead.id, isouter=True)
        .group_by(CrimeSubHead.crime_subhead_name)
        .all()
    )
    return wrap([{"crime_type": r[0], "count": r[1]} for r in rows])


@router.get("/status-summary")
def status_summary(db: Session = Depends(get_db)):
    """Count of cases grouped by status name."""
    rows = (
        db.query(CaseStatusLookup.status_name, func.count(models.CaseMaster.id).label("count"))
        .join(models.CaseMaster, models.CaseMaster.case_status_id == CaseStatusLookup.id, isouter=True)
        .group_by(CaseStatusLookup.status_name)
        .all()
    )
    return wrap([{"status": r[0], "count": r[1]} for r in rows])


@router.get("/district-summary")
def district_summary(db: Session = Depends(get_db)):
    """Count of cases per district."""
    rows = (
        db.query(models.District.district_name, func.count(models.CaseMaster.id).label("count"))
        .join(models.CaseMaster, models.CaseMaster.district_id == models.District.id, isouter=True)
        .group_by(models.District.district_name)
        .all()
    )
    return wrap([{"district": r[0], "count": r[1]} for r in rows])


# ── New Phase 2A endpoints ─────────────────────────────────

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    """Single call returns all dashboard stats."""
    stats = get_dashboard_stats(db)
    return wrap(stats.model_dump())


@router.get("/hotspots")
def hotspots(
    top_n: int = Query(10, ge=1, le=100, description="Number of hotspots to return"),
    db: Session = Depends(get_db),
):
    """Top-N districts by case count for map/leaderboard rendering."""
    result = calculate_hotspots(db, top_n=top_n)
    return wrap(result)


@router.get("/trends")
def monthly_trend(
    months: int = Query(12, ge=1, le=60, description="Number of months to look back"),
    crime_type: str = Query(None, description="Filter by crime subhead name"),
    db: Session = Depends(get_db),
):
    """Monthly crime count for trend chart."""
    result = get_monthly_trend(db, months=months, crime_type=crime_type)
    return wrap([t.model_dump() for t in result])


@router.get("/repeat-offenders")
def repeat_offenders(
    min_cases: int = Query(2, ge=2, le=50, description="Minimum case count threshold"),
    db: Session = Depends(get_db),
):
    """Accused persons linked to multiple cases — investigative priority list."""
    result = get_repeat_offenders(db, min_cases=min_cases)
    return wrap([r.model_dump() for r in result])


@router.get("/pending-cases")
def pending_cases(
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(50, ge=1, le=200, description="Page size"),
    db: Session = Depends(get_db),
):
    """Open / under_investigation cases with days_pending computed."""
    result = get_pending_cases(db, skip=skip, limit=limit)
    return wrap([p.model_dump() for p in result])
