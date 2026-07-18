from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class CaseMaster(Base):
    __tablename__ = "casemaster"

    id                       = Column("caseid", Integer, primary_key=True, index=True)
    fir_number               = Column("firnumber", String(50), nullable=False, unique=True)
    crime_head_id            = Column("crimeheadid", ForeignKey("crimehead.crimeheadid"), nullable=False)
    crime_subhead_id         = Column("crimesubheadid", ForeignKey("crimesubhead.crimesubheadid"), nullable=False)
    district_id              = Column("districtid", ForeignKey("district.districtid"), nullable=False)
    unit_id                  = Column("unitid", Integer, nullable=False)
    investigating_officer_id = Column("investigatingofficerid", ForeignKey("employee.employeeid"), nullable=False)
    case_category_id         = Column("casecategoryid", Integer, nullable=False)
    case_status_id           = Column("casestatusid", ForeignKey("casestatus.casestatusid"), nullable=False)
    gravity_id               = Column("gravityid", Integer, nullable=False)
    occurrence_date          = Column("occurrencedate", DateTime, nullable=False)
    fir_date                 = Column("firdate", DateTime, nullable=False)
    latitude                 = Column(Float)
    longitude                = Column(Float)
    brief_facts              = Column("brieffacts", Text)

    # Relationships
    district              = relationship("District", back_populates="cases")
    case_status           = relationship("CaseStatusLookup", back_populates="cases")
    crime_head            = relationship("CrimeHead")
    crime_subhead         = relationship("CrimeSubHead")
    investigating_officer = relationship("Employee", back_populates="cases")
    victims               = relationship("Victim", back_populates="case", cascade="all, delete-orphan")
    accused               = relationship("Accused", back_populates="case", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<CaseMaster id={self.id} fir={self.fir_number}>"
