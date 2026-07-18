from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CaseCreate(BaseModel):
    fir_number: str
    crime_head_id: int
    crime_subhead_id: int
    district_id: int
    unit_id: int
    investigating_officer_id: int
    case_category_id: int
    case_status_id: int = 1
    gravity_id: int
    occurrence_date: Optional[datetime] = None
    fir_date: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    brief_facts: Optional[str] = None


class CaseUpdate(BaseModel):
    crime_head_id: Optional[int] = None
    crime_subhead_id: Optional[int] = None
    investigating_officer_id: Optional[int] = None
    case_status_id: Optional[int] = None
    occurrence_date: Optional[datetime] = None
    brief_facts: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class CaseOut(BaseModel):
    id: int
    fir_number: str
    crime_head_id: Optional[int] = None
    crime_subhead_id: Optional[int] = None
    district_id: int
    unit_id: Optional[int] = None
    investigating_officer_id: Optional[int] = None
    case_category_id: Optional[int] = None
    case_status_id: Optional[int] = None
    gravity_id: Optional[int] = None
    occurrence_date: Optional[datetime] = None
    fir_date: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    brief_facts: Optional[str] = None

    model_config = {"from_attributes": True}
