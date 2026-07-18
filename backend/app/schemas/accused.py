from typing import Optional
from pydantic import BaseModel


class AccusedBase(BaseModel):
    case_id: int
    accused_name: str
    gender: Optional[str] = "Unknown"
    age: Optional[int] = None
    mobile_no: Optional[str] = None
    status: Optional[str] = None


class AccusedCreate(AccusedBase):
    pass


class AccusedUpdate(BaseModel):
    accused_name: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    mobile_no: Optional[str] = None
    status: Optional[str] = None


class AccusedOut(AccusedBase):
    id: int

    model_config = {"from_attributes": True}
