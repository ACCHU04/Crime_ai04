"""Router: /chat — AI chatbot powered by the orchestrator."""
from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.ai.orchestrator import (
    orchestrator, OrchestratorRequest, Intent
)

router = APIRouter(prefix="/chat", tags=["Chatbot"])


class ChatRequest(BaseModel):
    query: str
    case_data: Optional[dict] = None
    intent_hint: Optional[Intent] = None   # force a specific agent if needed
    session_id: Optional[str]  = None


class ChatResponse(BaseModel):
    intent: str
    agent: str
    payload: object
    error: Optional[str] = None
    session_id: Optional[str] = None


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Single AI entry point.  The orchestrator classifies the query and routes
    to sql_agent, investigation_agent, or summarizer automatically.

    Force a specific agent by passing intent_hint:
      "sql_query" | "investigate" | "summarize"
    """
    result = orchestrator.run(
        OrchestratorRequest(
            query=request.query,
            case_data=request.case_data,
            db=db,
            intent_hint=request.intent_hint,
        )
    )

    return ChatResponse(
        intent=result.intent,
        agent=result.agent,
        payload=result.payload,
        error=result.error,
        session_id=request.session_id,
    )
