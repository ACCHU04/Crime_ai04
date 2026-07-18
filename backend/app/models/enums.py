"""Shared enumerations used across multiple models."""
import enum


class CaseStatus(str, enum.Enum):
    OPEN                = "open"
    CLOSED              = "closed"
    UNDER_INVESTIGATION = "under_investigation"
    FILED               = "filed"


class EmployeeRole(str, enum.Enum):
    OFFICER   = "officer"
    DETECTIVE = "detective"
    INSPECTOR = "inspector"
    ANALYST   = "analyst"


class Gender(str, enum.Enum):
    MALE    = "male"
    FEMALE  = "female"
    OTHER   = "other"
    UNKNOWN = "unknown"


class AccusedStatus(str, enum.Enum):
    WANTED    = "wanted"
    ARRESTED  = "arrested"
    ACQUITTED = "acquitted"
    CONVICTED = "convicted"
    RELEASED  = "released"
