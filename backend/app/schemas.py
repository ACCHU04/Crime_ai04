"""
Pydantic schemas for request/response validation.
Mirrors models.py but decoupled from SQLAlchemy.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

from app.models import CaseStatus, EmployeeRole


# ---------------------------------------------------------------------------
# State
# ---------------------------------------------------------------------------

class StateBase(BaseModel):
    name: str
    code: str

class StateCreate(StateBase):
    pass

class StateOut(StateBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# District
# ---------------------------------------------------------------------------

class DistrictBase(BaseModel):
    name: str
    state_id: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class DistrictCreate(DistrictBase):
    pass

class DistrictOut(DistrictBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Employee
# ---------------------------------------------------------------------------

class EmployeeBase(BaseModel):
    badge_number: str
    full_name: str
    role: EmployeeRole = EmployeeRole.OFFICER
    email: Optional[str] = None
    phone: Optional[str] = None
    district_id: int
    is_active: bool = True

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeOut(EmployeeBase):
    id: int
    joined_at: datetime
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# CaseMaster
# ---------------------------------------------------------------------------

class CaseCreate(BaseModel):
    case_number: str
    title: str
    description: Optional[str] = None
    crime_type: str
    status: CaseStatus = CaseStatus.OPEN
    district_id: int
    location_detail: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    assigned_officer_id: Optional[int] = None
    victim_name: Optional[str] = None
    suspect_name: Optional[str] = None
    incident_date: Optional[datetime] = None

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    crime_type: Optional[str] = None
    status: Optional[CaseStatus] = None
    location_detail: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    assigned_officer_id: Optional[int] = None
    victim_name: Optional[str] = None
    suspect_name: Optional[str] = None
    incident_date: Optional[datetime] = None
    closed_date: Optional[datetime] = None

class CaseOut(CaseCreate):
    id: int
    reported_date: datetime
    closed_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
