from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Victim(Base):
    __tablename__ = "victim"

    id          = Column("victimid", Integer, primary_key=True, index=True)
    case_id     = Column("caseid", ForeignKey("casemaster.caseid"), nullable=False)
    victim_name = Column("victimname", String(150), nullable=False)
    gender      = Column(String(20))
    age         = Column(Integer)
    occupation  = Column(String(100))

    case = relationship("CaseMaster", back_populates="victims")

    def __repr__(self):
        return f"<Victim id={self.id} name={self.victim_name}>"
