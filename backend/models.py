from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime,
    ForeignKey, Text, Enum, Boolean
)
from sqlalchemy.orm import relationship
import enum

from database import Base


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------

class CaseStatus(str, enum.Enum):
    OPEN       = "open"
    CLOSED     = "closed"
    UNDER_INVESTIGATION = "under_investigation"
    FILED      = "filed"


class EmployeeRole(str, enum.Enum):
    OFFICER    = "officer"
    DETECTIVE  = "detective"
    INSPECTOR  = "inspector"
    ANALYST    = "analyst"


# ---------------------------------------------------------------------------
# State
# ---------------------------------------------------------------------------

class State(Base):
    __tablename__ = "state"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False, unique=True)
    code       = Column(String(10),  nullable=False, unique=True)   # e.g. "MH", "DL"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    districts  = relationship("District", back_populates="state", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<State id={self.id} name={self.name}>"


# ---------------------------------------------------------------------------
# District
# ---------------------------------------------------------------------------

class District(Base):
    __tablename__ = "district"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False)
    state_id   = Column(Integer, ForeignKey("state.id"), nullable=False)
    latitude   = Column(Float,  nullable=True)
    longitude  = Column(Float,  nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    state      = relationship("State",    back_populates="districts")
    employees  = relationship("Employee", back_populates="district", cascade="all, delete-orphan")
    cases      = relationship("CaseMaster", back_populates="district", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<District id={self.id} name={self.name} state_id={self.state_id}>"


# ---------------------------------------------------------------------------
# Employee
# ---------------------------------------------------------------------------

class Employee(Base):
    __tablename__ = "employee"

    id            = Column(Integer, primary_key=True, index=True)
    badge_number  = Column(String(50),  nullable=False, unique=True)
    full_name     = Column(String(150), nullable=False)
    role          = Column(Enum(EmployeeRole), default=EmployeeRole.OFFICER, nullable=False)
    email         = Column(String(200), nullable=True,  unique=True)
    phone         = Column(String(20),  nullable=True)
    district_id   = Column(Integer, ForeignKey("district.id"), nullable=False)
    is_active     = Column(Boolean, default=True)
    joined_at     = Column(DateTime, default=datetime.utcnow)
    created_at    = Column(DateTime, default=datetime.utcnow)

    # Relationships
    district      = relationship("District",   back_populates="employees")
    cases         = relationship("CaseMaster", back_populates="assigned_officer")

    def __repr__(self):
        return f"<Employee id={self.id} badge={self.badge_number} name={self.full_name}>"


# ---------------------------------------------------------------------------
# CaseMaster
# ---------------------------------------------------------------------------

class CaseMaster(Base):
    __tablename__ = "casemaster"

    id                = Column(Integer, primary_key=True, index=True)
    case_number       = Column(String(50),  nullable=False, unique=True)  # FIR / case ref
    title             = Column(String(255), nullable=False)
    description       = Column(Text,        nullable=True)
    crime_type        = Column(String(100), nullable=False)               # e.g. "Theft", "Assault"
    status            = Column(Enum(CaseStatus), default=CaseStatus.OPEN, nullable=False)

    # Location
    district_id       = Column(Integer, ForeignKey("district.id"), nullable=False)
    location_detail   = Column(String(255), nullable=True)                # street / landmark
    latitude          = Column(Float,  nullable=True)
    longitude         = Column(Float,  nullable=True)

    # People
    assigned_officer_id = Column(Integer, ForeignKey("employee.id"), nullable=True)
    victim_name       = Column(String(150), nullable=True)
    suspect_name      = Column(String(150), nullable=True)

    # Timestamps
    incident_date     = Column(DateTime, nullable=True)
    reported_date     = Column(DateTime, default=datetime.utcnow)
    closed_date       = Column(DateTime, nullable=True)
    created_at        = Column(DateTime, default=datetime.utcnow)
    updated_at        = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    district          = relationship("District", back_populates="cases")
    assigned_officer  = relationship("Employee", back_populates="cases")

    def __repr__(self):
        return f"<CaseMaster id={self.id} case_number={self.case_number} status={self.status}>"
