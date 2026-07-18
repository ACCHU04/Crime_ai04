from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.case import CaseMaster
from app.schemas.case import CaseUpdate


def get_cases(db: Session, skip: int = 0, limit: int = 100) -> List[CaseMaster]:
    return db.query(CaseMaster).offset(skip).limit(limit).all()


def get_case(db: Session, case_id: int) -> Optional[CaseMaster]:
    return db.query(CaseMaster).filter(CaseMaster.id == case_id).first()


def get_case_by_number(db: Session, case_number: str) -> Optional[CaseMaster]:
    return db.query(CaseMaster).filter(CaseMaster.fir_number == case_number).first()


def create_case(db: Session, data: dict) -> CaseMaster:
    obj = CaseMaster(**data)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_case(db: Session, case_id: int, data: CaseUpdate) -> Optional[CaseMaster]:
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
