# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend
```bash
# Run the API server
python -m uvicorn backend.api:app --reload

# Run the CLI analysis script
python main.py
```

### Frontend (run from `frontend/`)
```bash
npm run dev       # dev server on port 5173
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

The Vite dev server proxies `/api/*` to `http://localhost:8000`, so both servers must be running for the full stack to work.

There are no automated tests in this repository.

## Architecture

### Data Flow
1. On startup, `backend/api.py` uses a FastAPI lifespan context manager to load all data into memory: skills from `data/skills.csv`, jobs from `data/jobs.csv`, and a precomputed agent skill set (cached at `data/agent_weight_matrix.npz`).
2. The frontend (`frontend/src/api.js`) calls three endpoints: `GET /api/skills`, `GET /api/suggest`, and `POST /api/analyze`.
3. `POST /api/analyze` runs the full pipeline: engine matching → demand analytics → response.

### Model Layer (`model/`)
Abstract interfaces only — no I/O or business logic:
- `SkillModel` — ordered container of skill names
- `SkillSet` — `{skill_name: float}` proficiency mapping
- `SkillEngine` — interface with four methods: `matches_requirement`, `get_matching_positions`, `get_learning_recommendation`, `get_replaceability`

### Backend Implementations (`backend/`)
- `model/naive_skill_model.py` — loads skill list from CSV
- `model/naive_skill_engine.py` — threshold matching: a candidate qualifies for a job only if they meet ≥ 0.8 proficiency on **every** required skill (`PROFICIENCY_THRESHOLD = 0.8`)
- `pipelines/build_skill_set.py` — parses `jobs.csv` (columns: `job_title`, `industry`, `salary`, `required_skills` semicolon-delimited)
- `pipelines/build_agent_skill_set.py` — maps abstract AI capabilities to concrete skills via `sentence-transformers` (`all-MiniLM-L6-v2`) cosine similarity; result cached as NPZ
- `analytics/demand.py` — aggregates salary stats and industry breakdown from engine match output

### Frontend (`frontend/src/`)
- `App.jsx` — owns all state (skills list, selected skills, analysis result, loading flag)
- `SkillSelector.jsx` — debounced (300 ms) search calling `/api/suggest`; badge-based skill selection UI
- `Dashboard.jsx` — renders four result cards: `DemandCard`, `SalaryCard`, `CareerFocusCard`, `ReplaceabilityCard`
- `components/ui/` — Base UI primitives (card, button, badge, etc.)

### Required Data Files (not committed)
- `data/skills.csv` — newline-delimited skill names
- `data/jobs.csv` — CSV with columns: `job_title`, `industry`, `salary`, `required_skills`
- `data/agent_weight_matrix.npz` — auto-generated on first run if absent

### Python Dependencies (not in a requirements file — inferred from imports)
`fastapi`, `pydantic`, `sentence-transformers`, `numpy`, `uvicorn`
