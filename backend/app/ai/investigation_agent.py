"""AI: Investigation agent — rule-based multi-step reasoning over case files."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models
from app.models.casestatus import CaseStatusLookup
from app.models.crimesubhead import CrimeSubHead

logger = logging.getLogger(__name__)


def investigate(case_data: dict, db: Session | None = None) -> dict:
    """
    Run rule-based investigation analysis over case evidence.

    Returns:
        {
            "case_number": str,
            "summary": str,
            "suggested_actions": list[str],
            "risk_factors": list[str],
            "similar_cases": list[dict],
            "accused_history": list[dict],
            "confidence": float,
        }
    """
    case_number = case_data.get("case_number", case_data.get("fir_number", "Unknown"))
    summary_parts: list[str] = []
    suggested_actions: list[str] = []
    risk_factors: list[str] = []
    similar_cases: list[dict] = []
    accused_history: list[dict] = []

    # --- Step 1: Analyze case facts ---
    brief_facts = case_data.get("brief_facts", case_data.get("description", ""))
    if brief_facts:
        summary_parts.append(f"Case involves: {brief_facts[:200]}")

    crime_type = case_data.get("crime_head") or case_data.get("crime_type", "")
    status = case_data.get("status", "")
    district = case_data.get("district", "")

    if crime_type:
        summary_parts.append(f"Crime classification: {crime_type}.")
        violent_keywords = ["murder", "assault", "robbery", "dacoity", "kidnapping", "rape"]
        if any(kw in crime_type.lower() for kw in violent_keywords):
            risk_factors.append("Violent crime — high priority investigation required")
            suggested_actions.append("Secure crime scene and preserve forensic evidence")
            suggested_actions.append("Record witness statements immediately")

    # --- Step 2: Cross-reference accused if DB available ---
    if db and case_data.get("case_id"):
        case_id = case_data["case_id"]
        accused_list = db.query(models.Accused).filter(
            models.Accused.case_id == case_id
        ).all()

        for acc in accused_list:
            # Check if this accused appears in other cases
            other_cases = (
                db.query(models.CaseMaster)
                .join(models.Accused, models.Accused.case_id == models.CaseMaster.id)
                .filter(
                    models.Accused.accused_name == acc.accused_name,
                    models.Accused.case_id != case_id,
                )
                .all()
            )
            if other_cases:
                accused_history.append({
                    "name": acc.accused_name,
                    "other_cases": len(other_cases),
                    "case_numbers": [c.fir_number for c in other_cases],
                })
                risk_factors.append(
                    f"Accused '{acc.accused_name}' linked to {len(other_cases)} other case(s)"
                )
                suggested_actions.append(
                    f"Review history of accused {acc.accused_name} — repeat offender"
                )

    # --- Step 3: Find similar cases ---
    if db and crime_type:
        similar = (
            db.query(models.CaseMaster)
            .join(CrimeSubHead, models.CaseMaster.crime_subhead_id == CrimeSubHead.id)
            .join(CaseStatusLookup, models.CaseMaster.case_status_id == CaseStatusLookup.id)
            .filter(CrimeSubHead.crime_subhead_name == crime_type)
            .limit(5)
            .all()
        )
        for s in similar:
            if s.id != case_data.get("case_id"):
                similar_cases.append({
                    "case_id": s.id,
                    "fir_number": s.fir_number,
                    "status": s.case_status.status_name if s.case_status else "Unknown",
                })

        if len(similar_cases) >= 2:
            risk_factors.append(f"{len(similar_cases)} similar cases found — possible pattern")
            suggested_actions.append("Investigate potential serial pattern across similar cases")

    # --- Step 4: Status-based recommendations ---
    status_lower = status.lower() if status else ""
    if "under investigation" in status_lower:
        suggested_actions.append("Verify alibi and timeline for all suspects")
        suggested_actions.append("Check CCTV footage and digital evidence")
    elif "pending trial" in status_lower:
        suggested_actions.append("Ensure all evidence is properly documented for court")
        suggested_actions.append("Coordinate with prosecution team")
    elif "chargesheet" in status_lower:
        suggested_actions.append("Review chargesheet for completeness")
        suggested_actions.append("Follow up on any remaining witness testimonies")

    # --- Step 5: District context ---
    if district:
        summary_parts.append(f"Incident occurred in {district} district.")

    # --- Build summary ---
    summary = " ".join(summary_parts) if summary_parts else "Insufficient data for investigation analysis."

    # --- Confidence ---
    confidence = 0.5
    if brief_facts:
        confidence += 0.1
    if crime_type:
        confidence += 0.1
    if accused_history:
        confidence += 0.15
    if similar_cases:
        confidence += 0.1
    confidence = min(confidence, 0.95)

    return {
        "case_number": case_number,
        "summary": summary,
        "suggested_actions": suggested_actions[:8],
        "risk_factors": risk_factors,
        "similar_cases": similar_cases[:5],
        "accused_history": accused_history,
        "confidence": round(confidence, 2),
    }
