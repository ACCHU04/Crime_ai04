from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Employee(Base):
    __tablename__ = "employee"

    id          = Column("employeeid", Integer, primary_key=True, index=True)
    district_id = Column("districtid", ForeignKey("district.districtid"))
    kgid        = Column(String(50))
    first_name  = Column("firstname", String(150))
    genderid    = Column(Integer)

    district = relationship("District", back_populates="employees")
    cases    = relationship("CaseMaster", back_populates="investigating_officer")

    def __repr__(self):
        return f"<Employee id={self.id} name={self.first_name}>"
