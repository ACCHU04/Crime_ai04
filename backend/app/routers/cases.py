"""Router: /cases — CRUD endpoints for CaseMaster."""
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db
from app.models import CaseMaster, CaseStatusLookup, Victim
from app.services.report import generate_case_report

router = APIRouter(prefix="/cases", tags=["Cases"])


@router.get("/", response_model=List[schemas.CaseOut])
def list_cases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_cases(db, skip=skip, limit=limit)


@router.get("/{case_id}", response_model=schemas.CaseOut)
def get_case(case_id: int, db: Session = Depends(get_db)):
    obj = crud.get_case(db, case_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Case not found")
    return obj


@router.post("/", response_model=schemas.CaseOut, status_code=status.HTTP_201_CREATED)
def create_case(data: schemas.CaseCreate, db: Session = Depends(get_db)):
    if crud.get_case_by_number(db, data.fir_number):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="FIR number already exists",
        )
    payload = data.model_dump()
    payload["occurrence_date"] = payload["occurrence_date"] or datetime.now(timezone.utc)
    payload["fir_date"] = payload["fir_date"] or datetime.now(timezone.utc)
    return crud.create_case(db, payload)


@router.patch("/{case_id}", response_model=schemas.CaseOut)
def update_case(case_id: int, data: schemas.CaseUpdate, db: Session = Depends(get_db)):
    obj = crud.update_case(db, case_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="Case not found")
    return obj


@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_case(case_id: int, db: Session = Depends(get_db)):
    if not crud.delete_case(db, case_id):
        raise HTTPException(status_code=404, detail="Case not found")


# ---------------------------------------------------------------------------
# Investigation Workspace endpoints
# ---------------------------------------------------------------------------

@router.get("/{case_id}/report")
def get_case_report(case_id: int, db: Session = Depends(get_db)):
    report = generate_case_report(db, case_id)
    if "error" in report:
        raise HTTPException(status_code=404, detail=report["error"])
    return report


@router.get("/{case_id}/timeline")
def get_case_timeline(case_id: int, db: Session = Depends(get_db)):
    case = db.query(CaseMaster).filter(CaseMaster.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    events = []

    if case.occurrence_date:
        events.append({
            "date": case.occurrence_date.isoformat(),
            "type": "occurrence",
            "title": "Crime Occurred",
        })

    if case.fir_date:
        events.append({
            "date": case.fir_date.isoformat(),
            "type": "fir",
            "title": "FIR Registered",
        })

    events.append({
        "date": (case.occurrence_date or case.fir_date or datetime.now(timezone.utc)).isoformat(),
        "type": "created",
        "title": "Case Entered in System",
    })

    if case.case_status:
        status_date = case.fir_date or case.occurrence_date or datetime.now(timezone.utc)
        events.append({
            "date": status_date.isoformat(),
            "type": "status",
            "title": f"Current Status: {case.case_status.status_name}",
        })

    events.sort(key=lambda e: e["date"])

    return {"case_id": case_id, "events": events}


@router.get("/{case_id}/victims")
def get_case_victims(case_id: int, db: Session = Depends(get_db)):
    case = db.query(CaseMaster).filter(CaseMaster.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    victims = db.query(Victim).filter(Victim.case_id == case_id).all()
    return [
        {
            "id": v.id,
            "case_id": v.case_id,
            "victim_name": v.victim_name,
            "gender": v.gender,
            "age": v.age,
            "occupation": v.occupation,
        }
        for v in victims
    ]


@router.post("/{case_id}/summarize")
def summarize_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(CaseMaster).filter(CaseMaster.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    report = generate_case_report(db, case_id)

    facts = report.get("brief_facts") or ""
    summary = facts[:300] + ("..." if len(facts) > 300 else "") if facts else "No brief facts available."

    return {
        "case_id": case_id,
        "fir_number": report.get("fir_number"),
        "crime_head": report.get("crime_head"),
        "crime_subhead": report.get("crime_subhead"),
        "status": report.get("status"),
        "district": report.get("district"),
        "summary": summary,
        "suggested_actions": [
            "Review case timeline for investigation milestones",
            "Follow up on witness statements",
            "Cross-reference with similar cases in the district",
        ],
    }
