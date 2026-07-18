"""Router: /accused — search and browse accused records."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter(prefix="/accused", tags=["Accused"])


@router.get("/by-case/{case_id}")
def accused_by_case(case_id: int, db: Session = Depends(get_db)):
    """Return all accused persons for a given case."""
    case = db.query(models.CaseMaster).filter(models.CaseMaster.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return {
        "case_id": case_id,
        "fir_number": case.fir_number,
        "accused": [
            {"accused_id": a.id, "accused_name": a.accused_name, "status": a.status}
            for a in case.accused
        ],
    }


@router.get("/search")
def search_accused(name: str, db: Session = Depends(get_db)):
    """Search accused by name (partial match)."""
    results = (
        db.query(models.Accused)
        .filter(models.Accused.accused_name.ilike(f"%{name}%"))
        .all()
    )
    return [
        {"accused_id": a.id, "accused_name": a.accused_name, "case_id": a.case_id, "status": a.status}
        for a in results
    ]
