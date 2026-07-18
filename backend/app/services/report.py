"""Service: generate structured case reports."""
from typing import Dict, Any
from sqlalchemy.orm import Session
from app import models


def generate_case_report(db: Session, case_id: int) -> Dict[str, Any]:
    """Build a structured report dict for a single case."""
    case = db.query(models.CaseMaster).filter(models.CaseMaster.id == case_id).first()
    if not case:
        return {"error": f"Case {case_id} not found"}

    district_name = case.district.district_name if case.district else None
    officer_name = case.investigating_officer.first_name if case.investigating_officer else None
    status_name = case.case_status.status_name if case.case_status else None
    crime_head = case.crime_head.crime_head_name if case.crime_head else None
    crime_subhead = case.crime_subhead.crime_subhead_name if case.crime_subhead else None
    victim_name = case.victims[0].victim_name if case.victims else None
    accused_name = case.accused[0].accused_name if case.accused else None

    return {
        "case_id": case.id,
        "fir_number": case.fir_number,
        "crime_head": crime_head,
        "crime_subhead": crime_subhead,
        "status": status_name,
        "district": district_name,
        "victim_name": victim_name,
        "accused_name": accused_name,
        "investigating_officer": officer_name,
        "occurrence_date": str(case.occurrence_date) if case.occurrence_date else None,
        "fir_date": str(case.fir_date) if case.fir_date else None,
        "brief_facts": case.brief_facts,
    }
