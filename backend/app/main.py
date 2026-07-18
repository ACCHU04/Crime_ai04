"""
Crime-AI Backend — FastAPI application entry point.
Run from the backend/ directory:
    uvicorn app.main:app --reload
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine, Base
import app.models  # noqa: F401 — triggers models/__init__.py, registering all tables

from app.routers import cases, analytics, chatbot, accused, graph

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Create all DB tables at startup if they don't exist, then add indexes."""
    Base.metadata.create_all(bind=engine)

    with engine.begin() as conn:
        # Performance indexes for analytics queries
        for stmt in [
            "CREATE INDEX IF NOT EXISTS idx_case_status ON casemaster(casestatusid)",
            "CREATE INDEX IF NOT EXISTS idx_case_district ON casemaster(districtid)",
            "CREATE INDEX IF NOT EXISTS idx_case_firdate ON casemaster(firdate)",
            "CREATE INDEX IF NOT EXISTS idx_case_crimehead ON casemaster(crimeheadid)",
            "CREATE INDEX IF NOT EXISTS idx_accused_name ON accused(accusedname)",
            "CREATE INDEX IF NOT EXISTS idx_accused_case ON accused(caseid)",
        ]:
            conn.execute(text(stmt))

        # Auto-increment sequences for PKs (DB tables lack SERIAL/IDENTITY)
        sequence_sql = [
            "CREATE SEQUENCE IF NOT EXISTS casemaster_caseid_seq",
            "ALTER TABLE casemaster ALTER COLUMN caseid SET DEFAULT nextval('casemaster_caseid_seq')",
            "SELECT setval('casemaster_caseid_seq', COALESCE((SELECT MAX(caseid) FROM casemaster), 0), true)",
            "CREATE SEQUENCE IF NOT EXISTS accused_accusedid_seq",
            "ALTER TABLE accused ALTER COLUMN accusedid SET DEFAULT nextval('accused_accusedid_seq')",
            "SELECT setval('accused_accusedid_seq', COALESCE((SELECT MAX(accusedid) FROM accused), 0), true)",
            "CREATE SEQUENCE IF NOT EXISTS victim_victimid_seq",
            "ALTER TABLE victim ALTER COLUMN victimid SET DEFAULT nextval('victim_victimid_seq')",
            "SELECT setval('victim_victimid_seq', COALESCE((SELECT MAX(victimid) FROM victim), 0), true)",
        ]
        for stmt in sequence_sql:
            try:
                conn.execute(text(stmt))
            except Exception as e:
                logger.warning("Sequence statement failed: %s (%s)", stmt, e)

        # Startup validation: check lookup tables
        for table, label in [
            ("casestatus", "case statuses"),
            ("crimehead", "crime heads"),
            ("crimesubhead", "crime subheads"),
        ]:
            count = conn.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
            if count == 0:
                logger.warning(
                    "Lookup table '%s' is empty. "
                    "Run the Karnataka Datathon seed data before starting the application.",
                    table,
                )

    yield


app = FastAPI(
    title="Crime-AI API",
    description="AI-powered crime analysis and prediction platform",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(cases.router)
app.include_router(analytics.router)
app.include_router(chatbot.router)
app.include_router(accused.router)
app.include_router(graph.router)


# ---------------------------------------------------------------------------
# Root endpoints
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    """Root endpoint — confirms the API is live."""
    return {"message": "Crime AI Backend Running"}


@app.get("/health")
def health():
    """Health-check endpoint for monitoring / deployment probes."""
    return {"status": "ok", "version": "1.0.0"}
