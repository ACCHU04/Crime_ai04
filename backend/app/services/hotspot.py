"""Service: crime hotspot detection — top-N districts by case count."""
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models


def calculate_hotspots(db: Session, top_n: int = 10) -> List[Dict[str, Any]]:
    """Return the top-N districts by case count."""
    rows = (
        db.query(
            models.District.district_name,
            func.count(models.CaseMaster.id).label("case_count"),
        )
        .join(models.CaseMaster, models.CaseMaster.district_id == models.District.id, isouter=True)
        .group_by(models.District.id)
        .order_by(func.count(models.CaseMaster.id).desc())
        .limit(top_n)
        .all()
    )

    return [
        {
            "district": r.district_name,
            "latitude": None,
            "longitude": None,
            "case_count": r.case_count,
        }
        for r in rows
    ]
