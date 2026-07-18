from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.state import State
from app.schemas.state import StateCreate


def get_states(db: Session, skip: int = 0, limit: int = 100) -> List[State]:
    return db.query(State).offset(skip).limit(limit).all()


def get_state(db: Session, state_id: int) -> Optional[State]:
    return db.query(State).filter(State.id == state_id).first()


def create_state(db: Session, data: StateCreate) -> State:
    obj = State(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
