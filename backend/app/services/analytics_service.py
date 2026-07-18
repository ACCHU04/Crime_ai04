"""Service: analytics queries — dashboard, trends, repeat offenders, pending cases."""
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models
from app.models.casestatus import CaseStatusLookup
from app.models.crimesubhead import CrimeSubHead
from app.constants import (
    STATUS_UNDER_INVESTIGATION, STATUS_CHARGESHEET_FILED,
    STATUS_CLOSED, STATUS_PENDING_TRIAL, STATUS_CONVICTED, STATUS_ACQUITTED,
)
from app.schemas.analytics import (
    DashboardStats, MonthlyTrend, RepeatOffender, PendingCase,
)


def get_dashboard_stats(db: Session) -> DashboardStats:
    """Single aggregated dashboard response."""
    status_counts = (
        db.query(
            CaseStatusLookup.status_name,
            func.count(models.CaseMaster.id).label("cnt"),
        )
        .join(models.CaseMaster, models.CaseMaster.case_status_id == CaseStatusLookup.id)
        .group_by(CaseStatusLookup.status_name)
        .all()
    )
    counts = {r.status_name: r.cnt for r in status_counts}
    total = sum(counts.values())

    top_dist = (
        db.query(models.District.district_name, func.count(models.CaseMaster.id).label("cnt"))
        .join(models.CaseMaster, models.CaseMaster.district_id == models.District.id, isouter=True)
        .group_by(models.District.id)
        .order_by(func.count(models.CaseMaster.id).desc())
        .first()
    )

    top_crime = (
        db.query(CrimeSubHead.crime_subhead_name, func.count(models.CaseMaster.id).label("cnt"))
        .join(models.CaseMaster, models.CaseMaster.crime_subhead_id == CrimeSubHead.id, isouter=True)
        .group_by(CrimeSubHead.id)
        .order_by(func.count(models.CaseMaster.id).desc())
        .first()
    )

    return DashboardStats(
        total_cases=total,
        pending_cases=counts.get(STATUS_UNDER_INVESTIGATION, 0) + counts.get(STATUS_PENDING_TRIAL, 0),
        closed_cases=counts.get(STATUS_CLOSED, 0),
        convicted_cases=counts.get(STATUS_CONVICTED, 0),
        top_district=top_dist[0] if top_dist else None,
        top_crime_type=top_crime[0] if top_crime else None,
    )


def get_monthly_trend(
    db: Session, months: int = 12, crime_type: Optional[str] = None
) -> list[MonthlyTrend]:
    """Monthly crime count, optionally filtered by crime type (subhead name)."""
    cutoff = datetime.utcnow() - timedelta(days=months * 30)
    q = (
        db.query(
            func.date_trunc("month", models.CaseMaster.occurrence_date).label("month"),
            func.count(models.CaseMaster.id).label("count"),
        )
        .filter(models.CaseMaster.occurrence_date >= cutoff)
    )
    if crime_type:
        q = (
            q.join(CrimeSubHead, models.CaseMaster.crime_subhead_id == CrimeSubHead.id)
             .filter(CrimeSubHead.crime_subhead_name == crime_type)
        )
    rows = (
        q.group_by(func.date_trunc("month", models.CaseMaster.occurrence_date))
         .order_by(func.date_trunc("month", models.CaseMaster.occurrence_date))
         .all()
    )
    return [MonthlyTrend(month=r.month.strftime("%Y-%m"), count=r.count) for r in rows]


def get_repeat_offenders(db: Session, min_cases: int = 2) -> list[RepeatOffender]:
    """Accused persons linked to min_cases or more cases."""
    rows = (
        db.query(
            models.Accused.id,
            models.Accused.accused_name,
            models.Accused.status,
            func.count(models.Accused.case_id).label("case_count"),
            func.array_agg(models.CaseMaster.fir_number).label("case_numbers"),
        )
        .join(models.CaseMaster, models.Accused.case_id == models.CaseMaster.id)
        .group_by(models.Accused.id)
        .having(func.count(models.Accused.case_id) >= min_cases)
        .order_by(func.count(models.Accused.case_id).desc())
        .all()
    )
    return [
        RepeatOffender(
            accused_id=r.id,
            full_name=r.accused_name,
            alias=None,
            case_count=r.case_count,
            cases=r.case_numbers,
            status=r.status or "Unknown",
        )
        for r in rows
    ]


def get_pending_cases(
    db: Session, skip: int = 0, limit: int = 50
) -> list[PendingCase]:
    """Open / under_investigation / pending_trial cases with days_pending computed."""
    now = datetime.utcnow()
    pending_statuses = [STATUS_UNDER_INVESTIGATION, STATUS_PENDING_TRIAL, STATUS_CHARGESHEET_FILED]
    rows = (
        db.query(
            models.CaseMaster.id,
            models.CaseMaster.fir_number,
            models.CaseMaster.brief_facts,
            models.CaseMaster.occurrence_date,
            CaseStatusLookup.status_name.label("status_name"),
            models.District.district_name.label("district_name"),
        )
        .join(models.District, models.CaseMaster.district_id == models.District.id)
        .join(CaseStatusLookup, models.CaseMaster.case_status_id == CaseStatusLookup.id)
        .filter(CaseStatusLookup.status_name.in_(pending_statuses))
        .order_by(models.CaseMaster.occurrence_date.asc().nullslast())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        PendingCase(
            case_id=r.id,
            case_number=r.fir_number,
            title=r.brief_facts[:100] if r.brief_facts else r.fir_number,
            crime_type="",
            district=r.district_name,
            status=r.status_name,
            incident_date=r.occurrence_date,
            days_pending=(now - r.occurrence_date).days if r.occurrence_date else 0,
        )
        for r in rows
    ]
