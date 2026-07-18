from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.victim import Victim
from app.schemas.victim import VictimCreate, VictimUpdate


def get_victims_by_case(db: Session, case_id: int) -> List[Victim]:
    return db.query(Victim).filter(Victim.case_id == case_id).all()


def get_victim(db: Session, victim_id: int) -> Optional[Victim]:
    return db.query(Victim).filter(Victim.id == victim_id).first()


def create_victim(db: Session, data: VictimCreate) -> Victim:
    obj = Victim(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_victim(db: Session, victim_id: int, data: VictimUpdate) -> Optional[Victim]:
    obj = get_victim(db, victim_id)
    if not obj:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_victim(db: Session, victim_id: int) -> bool:
    obj = get_victim(db, victim_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
