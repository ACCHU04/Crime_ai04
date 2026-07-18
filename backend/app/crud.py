"""
CRUD helpers — thin wrappers around SQLAlchemy queries.
All functions accept a db Session and return ORM objects.
"""
from typing import List, Optional
from sqlalchemy.orm import Session

from app import models, schemas


# ---------------------------------------------------------------------------
# State
# ---------------------------------------------------------------------------

def get_states(db: Session, skip: int = 0, limit: int = 100) -> List[models.State]:
    return db.query(models.State).offset(skip).limit(limit).all()

def get_state(db: Session, state_id: int) -> Optional[models.State]:
    return db.query(models.State).filter(models.State.id == state_id).first()

def create_state(db: Session, data: schemas.StateCreate) -> models.State:
    obj = models.State(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------------------------------------------------------------------------
# District
# ---------------------------------------------------------------------------

def get_districts(db: Session, skip: int = 0, limit: int = 100) -> List[models.District]:
    return db.query(models.District).offset(skip).limit(limit).all()

def get_district(db: Session, district_id: int) -> Optional[models.District]:
    return db.query(models.District).filter(models.District.id == district_id).first()

def create_district(db: Session, data: schemas.DistrictCreate) -> models.District:
    obj = models.District(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------------------------------------------------------------------------
# Employee
# ---------------------------------------------------------------------------

def get_employees(db: Session, skip: int = 0, limit: int = 100) -> List[models.Employee]:
    return db.query(models.Employee).offset(skip).limit(limit).all()

def get_employee(db: Session, employee_id: int) -> Optional[models.Employee]:
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()

def create_employee(db: Session, data: schemas.EmployeeCreate) -> models.Employee:
    obj = models.Employee(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------------------------------------------------------------------------
# CaseMaster
# ---------------------------------------------------------------------------

def get_cases(db: Session, skip: int = 0, limit: int = 100) -> List[models.CaseMaster]:
    return db.query(models.CaseMaster).offset(skip).limit(limit).all()

def get_case(db: Session, case_id: int) -> Optional[models.CaseMaster]:
    return db.query(models.CaseMaster).filter(models.CaseMaster.id == case_id).first()

def get_case_by_number(db: Session, case_number: str) -> Optional[models.CaseMaster]:
    return db.query(models.CaseMaster).filter(models.CaseMaster.case_number == case_number).first()

def create_case(db: Session, data: schemas.CaseCreate) -> models.CaseMaster:
    obj = models.CaseMaster(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_case(db: Session, case_id: int, data: schemas.CaseUpdate) -> Optional[models.CaseMaster]:
    obj = get_case(db, case_id)
    if not obj:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj

def delete_case(db: Session, case_id: int) -> bool:
    obj = get_case(db, case_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
