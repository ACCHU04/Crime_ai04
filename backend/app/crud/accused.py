from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.accused import Accused
from app.schemas.accused import AccusedCreate, AccusedUpdate


def get_accused_by_case(db: Session, case_id: int) -> List[Accused]:
    return db.query(Accused).filter(Accused.case_id == case_id).all()


def get_accused(db: Session, accused_id: int) -> Optional[Accused]:
    return db.query(Accused).filter(Accused.id == accused_id).first()


def search_accused_by_name(db: Session, name: str) -> List[Accused]:
    return db.query(Accused).filter(Accused.accused_name.ilike(f"%{name}%")).all()


def create_accused(db: Session, data: AccusedCreate) -> Accused:
    obj = Accused(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_accused(db: Session, accused_id: int, data: AccusedUpdate) -> Optional[Accused]:
    obj = get_accused(db, accused_id)
    if not obj:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_accused(db: Session, accused_id: int) -> bool:
    obj = get_accused(db, accused_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
