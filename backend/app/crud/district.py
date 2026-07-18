from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.district import District
from app.schemas.district import DistrictCreate


def get_districts(db: Session, skip: int = 0, limit: int = 100) -> List[District]:
    return db.query(District).offset(skip).limit(limit).all()


def get_district(db: Session, district_id: int) -> Optional[District]:
    return db.query(District).filter(District.id == district_id).first()


def create_district(db: Session, data: DistrictCreate) -> District:
    obj = District(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
