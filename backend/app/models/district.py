from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class District(Base):
    __tablename__ = "district"

    id            = Column("districtid", Integer, primary_key=True, index=True)
    district_name = Column("districtname", String(100), nullable=False)
    state_id      = Column("stateid", ForeignKey("state.stateid"))
    active        = Column(Boolean, default=True)

    state     = relationship("State", back_populates="districts")
    employees = relationship("Employee", back_populates="district")
    cases     = relationship("CaseMaster", back_populates="district")

    def __repr__(self):
        return f"<District id={self.id} name={self.district_name}>"
