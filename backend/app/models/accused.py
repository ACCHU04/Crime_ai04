from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Accused(Base):
    __tablename__ = "accused"

    id           = Column("accusedid", Integer, primary_key=True, index=True)
    case_id      = Column("caseid", ForeignKey("casemaster.caseid"), nullable=False)
    accused_name = Column("accusedname", String(150), nullable=False)
    gender       = Column(String(20))
    age          = Column(Integer)
    mobile_no    = Column("mobileno", String(20))
    status       = Column(String(50))

    case = relationship("CaseMaster", back_populates="accused")

    def __repr__(self):
        return f"<Accused id={self.id} name={self.accused_name}>"
