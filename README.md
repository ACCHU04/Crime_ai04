# Crime-AI

AI-powered crime analysis and prediction platform for the Karnataka Police Datathon.

## Overview

Crime-AI analyzes historical crime data from the Karnataka Police database to identify patterns, detect repeat offenders, map crime hotspots, and generate actionable intelligence through an AI chatbot interface.

## Features

- **CRUD API** — Full create/read/update/delete for cases, accused, and victims
- **Analytics Engine** — Dashboard stats, crime trends, repeat offenders, district summaries
- **Graph Intelligence** — NetworkX-powered criminal association graphs and common-accused detection
- **AI Chatbot** — Natural language queries routed to SQL, analytics, graph, and investigation tools
- **Hotspot Detection** — Top-N district crime concentration analysis

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | FastAPI |
| Database | PostgreSQL + SQLAlchemy ORM |
| Graph | NetworkX |
| AI/LLM | OpenAI API + LangChain |
| Validation | Pydantic v2 |
| Data | pandas, numpy |

## Project Structure

```
Crime-Ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── database.py          # SQLAlchemy engine & session
│   │   ├── constants.py         # Shared constants
│   │   ├── models/              # SQLAlchemy models (9 tables)
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── crud/                # Database operations
│   │   ├── routers/             # API endpoints
│   │   ├── services/            # Analytics, graph, hotspot, report
│   │   ├── ai/                  # LLM orchestrator
│   │   └── analytics/           # Analytics module
│   ├── migrations/              # SQL migrations
│   └── requirements.txt         # Python dependencies
├── .env.example                 # Environment variable template
├── .gitignore
└── README.md
```

## Backend Setup

### Prerequisites

- Python 3.11+
- PostgreSQL 14+

### Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your database credentials and OpenAI API key.

### Database Setup

1. Create the database:
   ```sql
   CREATE DATABASE crime_ai;
   ```

2. Load the Karnataka Datathon seed data into the database.

3. Run the sequence migration (or let the app handle it on startup):
   ```bash
   psql -d crime_ai -f backend/migrations/001_add_sequences.sql
   ```

### Install & Run

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### API Documentation

Once running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/cases/` | List all cases |
| GET | `/cases/{id}` | Get case by ID |
| POST | `/cases/` | Create a new case |
| PATCH | `/cases/{id}` | Update a case |
| DELETE | `/cases/{id}` | Delete a case |
| GET | `/analytics/dashboard` | Dashboard statistics |
| GET | `/analytics/trends` | Monthly crime trends |
| GET | `/analytics/crime-type-summary` | Crime type breakdown |
| GET | `/analytics/hotspots` | Top crime districts |
| GET | `/analytics/repeat-offenders` | Repeat offender analysis |
| GET | `/analytics/pending-cases` | Pending investigation cases |
| GET | `/analytics/district-summary` | District-wise summary |
| GET | `/analytics/status-summary` | Status-wise summary |
| GET | `/graph/network` | Criminal association network |
| GET | `/graph/associates/{name}` | Person's associates |
| GET | `/graph/common-accused` | Common accused pairs |
| GET | `/accused/by-case/{id}` | Accused by case |
| GET | `/accused/search` | Search accused by name |
| POST | `/chat/` | AI chatbot |

## License

Built for the Karnataka Police Datathon 2026.
