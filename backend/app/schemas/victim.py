from typing import Optional
from pydantic import BaseModel


class VictimBase(BaseModel):
    case_id: int
    victim_name: str
    gender: Optional[str] = "Unknown"
    age: Optional[int] = None
    occupation: Optional[str] = None


class VictimCreate(VictimBase):
    pass


class VictimUpdate(BaseModel):
    victim_name: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None


class VictimOut(VictimBase):
    id: int

    model_config = {"from_attributes": True}
