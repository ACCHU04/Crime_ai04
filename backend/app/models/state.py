from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class State(Base):
    __tablename__ = "state"

    id   = Column("stateid", Integer, primary_key=True, index=True)
    name = Column("statename", String(100))

    districts = relationship("District", back_populates="state")

    def __repr__(self):
        return f"<State id={self.id} name={self.name}>"
