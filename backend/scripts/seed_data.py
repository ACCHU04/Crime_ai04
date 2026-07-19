"""
Seed script: Add realistic demo data to the crime database.
Run from the backend/ directory: python -m scripts.seed_data

Requires DATABASE_URL in .env or environment.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from datetime import datetime, timedelta, timezone

# Ensure the backend/app package is importable
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import text
from app.database import SessionLocal, engine


def seed():
    db = SessionLocal()
    try:
        # Check existing data
        count = db.execute(text("SELECT COUNT(*) FROM casemaster")).scalar()
        if count and count >= 10:
            print(f"Database already has {count} cases. Skipping seed.")
            return

        print(f"Current cases: {count}. Seeding additional data...")

        # Get lookup IDs
        statuses = {row[0]: row[1] for row in db.execute(
            text("SELECT statusname, casestatusid FROM casestatus")
        ).fetchall()}

        crime_heads = {row[0]: row[1] for row in db.execute(
            text("SELECT crimeheadname, crimeheadid FROM crimehead")
        ).fetchall()}

        crime_subheads = {row[0]: row[1] for row in db.execute(
            text("SELECT crimesubheadname, crimesubheadid FROM crimesubhead")
        ).fetchall()}

        districts = {row[0]: row[1] for row in db.execute(
            text("SELECT districtname, districtid FROM district")
        ).fetchall()}

        employees = db.execute(text("SELECT employeeid, firstname FROM employee")).fetchall()
        employee_ids = [e[0] for e in employees]

        print(f"  Statuses: {list(statuses.keys())}")
        print(f"  Crime heads: {list(crime_heads.keys())}")
        print(f"  Districts (sample): {list(districts.keys())[:5]}...")

        # Additional cases for demo
        new_cases = [
            {
                "fir": "FIR2026004", "crime_head": "Property Offences", "crime_subhead": "Theft",
                "district": "Mysuru", "status": "Under Investigation", "gravity": 2,
                "date_offset": -15, "facts": "Theft of electronic goods from a residence in Saraswathipuram. Suspect identified through CCTV footage. Victim reported missing laptop and mobile phone worth Rs. 1,50,000.",
            },
            {
                "fir": "FIR2026005", "crime_head": "Crime Against Women", "crime_subhead": "Assault",
                "district": "Bengaluru Urban", "status": "Chargesheet Filed", "gravity": 3,
                "date_offset": -45, "facts": "Assault on a woman by neighbor over property dispute. Multiple witnesses present. Medical examination conducted. Accused arrested and chargesheet filed within 30 days.",
            },
            {
                "fir": "FIR2026006", "crime_head": "Economic Offences", "crime_subhead": "Fraud",
                "district": "Hubballi-Dharwad", "status": "Pending Trial", "gravity": 3,
                "date_offset": -90, "facts": "Financial fraud involving fake investment scheme. Accused collected Rs. 25,00,000 from 15 victims promising high returns. Multiple bank transactions traced. Accused absconding.",
            },
            {
                "fir": "FIR2026007", "crime_head": "Crime Against Property", "crime_subhead": "Burglary",
                "district": "Mangaluru", "status": "Closed", "gravity": 2,
                "date_offset": -60, "facts": "Burglary at a jewelry shop during night hours. Locks broken, gold ornaments worth Rs. 5,00,000 stolen. Accused caught with stolen property within 48 hours. Case closed after recovery.",
            },
            {
                "fir": "FIR2026008", "crime_head": "Crime Against Human Body", "crime_subhead": "Murder",
                "district": "Belagavi", "status": "Under Investigation", "gravity": 5,
                "date_offset": -7, "facts": "Body found in abandoned warehouse. Preliminary investigation suggests foul play. Post-mortem conducted. Multiple suspects identified based on mobile tower analysis.",
            },
            {
                "fir": "FIR2026009", "crime_head": "Crime Against Property", "crime_subhead": "Motor Vehicle Theft",
                "district": "Kalaburagi", "status": "Under Investigation", "gravity": 2,
                "date_offset": -10, "facts": "Two-wheeler stolen from hospital parking. Vehicle registration traced to a scrap dealer in neighboring district. Investigation ongoing to identify the theft ring.",
            },
            {
                "fir": "FIR2026010", "crime_head": "Cyber Crime", "crime_subhead": "Cyber Crime",
                "district": "Bengaluru Urban", "status": "Under Investigation", "gravity": 3,
                "date_offset": -5, "facts": "Online banking fraud — Rs. 3,50,000 debited from victim's account through phishing link. Cyber cell tracing IP addresses. Victim had clicked on fraudulent SMS link.",
            },
            {
                "fir": "FIR2026011", "crime_head": "Property Offences", "crime_subhead": "Robbery",
                "district": "Tumakuru", "status": "Chargesheet Filed", "gravity": 4,
                "date_offset": -30, "facts": "Armed robbery at a petrol pump late at night. Two masked men threatened staff at knifepoint and fled with Rs. 85,000 from the cash register. CCTV captured the incident.",
            },
            {
                "fir": "FIR2026012", "crime_head": "Crime Against Human Body", "crime_subhead": "Assault",
                "district": "Shivamogga", "status": "Convicted", "gravity": 3,
                "date_offset": -120, "facts": "Assault case involving road rage incident. Victim suffered fractures. Medical evidence and eyewitness testimony secured. Accused convicted after trial.",
            },
            {
                "fir": "FIR2026013", "crime_head": "Crime Against Women", "crime_subhead": "Kidnapping",
                "district": "Davangere", "status": "Pending Trial", "gravity": 4,
                "date_offset": -75, "facts": "Minor girl kidnapped by acquaintance. Family reported missing person complaint. Girl recovered from neighboring state within 7 days. Accused arrested.",
            },
            {
                "fir": "FIR2026014", "crime_head": "Economic Offences", "crime_subhead": "Cheating",
                "district": "Hassan", "status": "Closed", "gravity": 2,
                "date_offset": -50, "facts": "Cheating case — accused impersonated as government officer and collected Rs. 2,00,000 for fake job appointment. Accused arrested, money recovered. Case closed.",
            },
            {
                "fir": "FIR2026015", "crime_head": "Property Offences", "crime_subhead": "Chain Snatching",
                "district": "Bengaluru Urban", "status": "Under Investigation", "gravity": 2,
                "date_offset": -3, "facts": "Chain snatching from elderly woman near bus stop. Two suspects on a motorcycle. Victim sustained minor injuries. Local CCTV being reviewed.",
            },
        ]

        now = datetime.now(timezone.utc)
        crime_head_map = {
            "Property Offences": crime_heads.get("Property Offences"),
            "Crime Against Women": crime_heads.get("Crime Against Women"),
            "Crime Against Property": crime_heads.get("Crime Against Property"),
            "Crime Against Human Body": crime_heads.get("Crime Against Human Body"),
            "Economic Offences": crime_heads.get("Economic Offences"),
            "Cyber Crime": crime_heads.get("Cyber Crime"),
        }
        # Fallback: use first available crime head if specific one not found
        default_head_id = list(crime_heads.values())[0] if crime_heads else 1

        inserted = 0
        for c in new_cases:
            # Skip if FIR already exists
            existing = db.execute(
                text("SELECT 1 FROM casemaster WHERE firnumber = :fir"),
                {"fir": c["fir"]}
            ).fetchone()
            if existing:
                print(f"  Skipping {c['fir']} — already exists")
                continue

            occ_date = now + timedelta(days=c["date_offset"])
            fir_date = occ_date + timedelta(days=1)

            head_id = crime_head_map.get(c["crime_head"], default_head_id)
            subhead_id = crime_subheads.get(c["crime_subhead"], list(crime_subheads.values())[0] if crime_subheads else 1)
            district_id = districts.get(c["district"], list(districts.values())[0] if districts else 1)
            status_id = statuses.get(c["status"], statuses.get("Under Investigation", 1))
            officer_id = employee_ids[inserted % len(employee_ids)] if employee_ids else 1

            db.execute(text("""
                INSERT INTO casemaster (
                    firnumber, crimeheadid, crimesubheadid, districtid,
                    unitid, investigatingofficerid, casecategoryid,
                    casestatusid, gravityid, occurrencedate, firdate,
                    brieffacts
                ) VALUES (
                    :fir, :head_id, :subhead_id, :district_id,
                    1, :officer_id, 1,
                    :status_id, :gravity, :occ_date, :fir_date,
                    :facts
                )
            """), {
                "fir": c["fir"],
                "head_id": head_id,
                "subhead_id": subhead_id,
                "district_id": district_id,
                "officer_id": officer_id,
                "status_id": status_id,
                "gravity": c["gravity"],
                "occ_date": occ_date.replace(tzinfo=None),
                "fir_date": fir_date.replace(tzinfo=None),
                "facts": c["facts"],
            })

            # Get the new case ID
            case_id = db.execute(text("SELECT MAX(caseid) FROM casemaster")).scalar()

            # Add accused persons
            accused_names = [
                ("Rajesh Kumar", "Male", 28),
                ("Suresh Babu", "Male", 35),
                ("Priya Sharma", "Female", 24),
            ]
            for i, (name, gender, age) in enumerate(accused_names[:2 if c["gravity"] < 4 else 3]):
                db.execute(text("""
                    INSERT INTO accused (caseid, accusedname, gender, age, mobileno, status)
                    VALUES (:case_id, :name, :gender, :age, :mobile, :status)
                """), {
                    "case_id": case_id,
                    "name": name,
                    "gender": gender,
                    "age": age,
                    "mobile": f"9{800000000 + case_id * 10 + i}",
                    "status": "Arrested" if c["status"] in ["Chargesheet Filed", "Convicted"] else "Absconding" if i == 0 else "At Large",
                })

            # Add victims
            victim_names = [
                ("Lakshmi Devi", "Female", 55),
                ("Arun Sharma", "Male", 42),
            ]
            for i, (name, gender, age) in enumerate(victim_names[:1 if c["gravity"] < 3 else 2]):
                db.execute(text("""
                    INSERT INTO victim (caseid, victimname, gender, age, occupation)
                    VALUES (:case_id, :name, :gender, :age, :occ)
                """), {
                    "case_id": case_id,
                    "name": name,
                    "gender": gender,
                    "age": age,
                    "occ": ["Teacher", "Business", "Retired", "Student"][i % 4],
                })

            inserted += 1
            print(f"  Inserted {c['fir']} — {c['crime_subhead']} in {c['district']} [{c['status']}]")

        db.commit()
        print(f"\nDone! Inserted {inserted} new cases with accused and victims.")

        # Verify
        total = db.execute(text("SELECT COUNT(*) FROM casemaster")).scalar()
        accused_total = db.execute(text("SELECT COUNT(*) FROM accused")).scalar()
        victims_total = db.execute(text("SELECT COUNT(*) FROM victim")).scalar()
        print(f"Total: {total} cases, {accused_total} accused, {victims_total} victims")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
