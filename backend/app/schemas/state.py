from typing import Optional
from pydantic import BaseModel


class StateBase(BaseModel):
    name: Optional[str] = None


class StateCreate(StateBase):
    pass


class StateOut(BaseModel):
    id: int
    name: Optional[str] = None

    model_config = {"from_attributes": True}
