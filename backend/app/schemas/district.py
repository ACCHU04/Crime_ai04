from typing import Optional
from pydantic import BaseModel


class DistrictBase(BaseModel):
    district_name: str
    state_id: Optional[int] = None


class DistrictCreate(DistrictBase):
    pass


class DistrictOut(BaseModel):
    id: int
    district_name: str
    state_id: Optional[int] = None
    active: Optional[bool] = True

    model_config = {"from_attributes": True}
