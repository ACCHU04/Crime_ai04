"""
database_service.py — the ONLY place in the codebase that executes raw SQL.

All other modules (sql_agent, services, analytics) must go through here.
This centralises:
  - Connection lifecycle (always closed in finally)
  - Parameterised queries (never string-interpolated — no SQL injection)
  - Consistent return shape: List[dict]
"""
from typing import Any
from sqlalchemy import text
from app.database import SessionLocal


def execute_query(sql: str, params: dict[str, Any] | None = None) -> list[dict]:
    """
    Execute a read-only SQL query and return rows as a list of dicts.

    Args:
        sql:    Parameterised SQL string, e.g. "SELECT * FROM district WHERE districtid = :id"
        params: Dict of bind parameters, e.g. {"id": 5}

    Returns:
        List of row dicts keyed by column name.

    Example:
        rows = execute_query(
            "SELECT caseid, firnumber FROM casemaster WHERE districtid = :d",
            {"d": 3}
        )
    """
    db = SessionLocal()
    try:
        result = db.execute(text(sql), params or {})
        return [dict(row._mapping) for row in result]
    finally:
        db.close()
