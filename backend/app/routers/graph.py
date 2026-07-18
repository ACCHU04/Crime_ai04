"""Router: /graph — criminal network analysis."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.analytics import GraphResult, wrap
from app.services import graph_service

router = APIRouter(prefix="/graph", tags=["Graph"])


@router.get("/network")
def crime_network(db: Session = Depends(get_db)):
    """Full crime-connection graph with nodes, edges, and statistics."""
    result = graph_service.build_crime_graph(db)
    return wrap(result.model_dump())


@router.get("/associates/{person_name}")
def associates(person_name: str, db: Session = Depends(get_db)):
    """1-hop network around a person by name — shows all direct connections."""
    result = graph_service.get_person_associates(db, person_name)
    if not result.nodes:
        raise HTTPException(404, detail=f"No connections found for '{person_name}'")
    return wrap(result.model_dump())


@router.get("/common-accused")
def common_accused(db: Session = Depends(get_db)):
    """Accused persons linked to 2+ cases — repeat offender network."""
    result = graph_service.get_common_accused(db)
    return wrap(result.model_dump())
