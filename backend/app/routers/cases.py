"""Router: /cases — CRUD endpoints for CaseMaster."""
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

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
