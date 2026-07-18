from typing import Optional
from pydantic import BaseModel


class EmployeeBase(BaseModel):
    first_name: Optional[str] = None
    kgid: Optional[str] = None
    district_id: Optional[int] = None


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeOut(BaseModel):
    id: int
    first_name: Optional[str] = None
    kgid: Optional[str] = None
    district_id: Optional[int] = None

    model_config = {"from_attributes": True}
