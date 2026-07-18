from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models  # noqa: F401 — registers all tables with Base.metadata


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup logic (create DB tables) then yield for normal operation."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Crime-AI API",
    description="AI-powered crime analysis and prediction platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Root endpoint — confirms the API is live."""
    return {"message": "Crime AI Backend Running"}


@app.get("/health")
def health():
    """Health-check endpoint for monitoring / deployment probes."""
    return {"status": "ok", "version": "1.0.0"}
