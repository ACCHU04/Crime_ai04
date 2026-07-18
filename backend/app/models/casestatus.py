from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class CaseStatusLookup(Base):
    __tablename__ = "casestatus"

    id          = Column("casestatusid", Integer, primary_key=True)
    status_name = Column("statusname", String(100), nullable=False)
    active      = Column(Boolean, default=True)

    cases = relationship("CaseMaster", back_populates="case_status")

    def __repr__(self):
        return f"<CaseStatusLookup id={self.id} name={self.status_name}>"
