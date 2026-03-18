import sys
import os
from contextlib import asynccontextmanager

# Ensure project root is on the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from model import SkillSet
from backend.model import NaiveSkillModel, NaiveSkillEngine
from backend.pipelines import load_jobs, build_agent_skill_set
from backend.analytics import compute_demand_summary

# --- Precomputed state (loaded once at startup) ---
state = {}

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")


def init_state():
    skill_model = NaiveSkillModel.load(os.path.join(DATA_DIR, "skills.csv"))
    engine = NaiveSkillEngine(skill_model)
    jobs = load_jobs(os.path.join(DATA_DIR, "jobs.csv"), skill_model)
    job_skill_sets = [skill_set for _, skill_set in jobs]
    agent_skills = build_agent_skill_set(skill_model, cache_path=os.path.join(DATA_DIR, "agent_weight_matrix.npz"))

    state["skill_model"] = skill_model
    state["engine"] = engine
    state["jobs"] = jobs
    state["job_skill_sets"] = job_skill_sets
    state["agent_skills"] = agent_skills


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_state()
    yield


app = FastAPI(title="Skill Analyzer API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    skills: List[str]


@app.get("/api/skills")
def get_skills():
    return {"skills": state["skill_model"].get_skills()}


@app.get("/api/suggest")
def suggest(
    selected: Optional[str] = Query(default=None),
    search: Optional[str] = Query(default=None),
):
    all_skills = sorted(state["skill_model"].get_skills())
    selected_set = set()
    if selected:
        selected_set = {s.strip() for s in selected.split(",") if s.strip()}

    # Filter out already selected
    candidates = [s for s in all_skills if s not in selected_set]

    # Filter by search term
    if search:
        q = search.lower()
        candidates = [s for s in candidates if s.lower().startswith(q)]

    return {"suggestions": candidates[:5]}


@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    skill_model = state["skill_model"]
    engine = state["engine"]
    jobs = state["jobs"]
    job_skill_sets = state["job_skill_sets"]
    agent_skills = state["agent_skills"]

    # Build human skill set from selected skills
    proficiencies = {s: 1.0 for s in req.skills if s in skill_model.get_skills()}
    human_skills = SkillSet(skill_model, proficiencies)

    # Demand analysis
    matches = engine.get_matching_positions(human_skills, job_skill_sets)
    summary = compute_demand_summary(matches, jobs)

    # Learning recommendations
    recs = engine.get_learning_recommendation(job_skill_sets, human_skills)
    learning = sorted(recs.items(), key=lambda x: -x[1])[:8]

    # Replaceability
    replaceability = engine.get_replaceability(human_skills, agent_skills, job_skill_sets)

    human_only_jobs = [
        {"title": jobs[i][0]["job_title"], "industry": jobs[i][0]["industry"]}
        for i in replaceability["human_only_indices"]
    ]
    agent_only_jobs = [
        {"title": jobs[i][0]["job_title"], "industry": jobs[i][0]["industry"]}
        for i in replaceability["agent_only_indices"]
    ]

    return {
        "demand": {
            "match_count": summary["match_count"],
            "match_ratio": summary["match_ratio"],
            "salary_min": summary["salary_min"],
            "salary_max": summary["salary_max"],
            "salary_avg": summary["salary_avg"],
            "industry_breakdown": summary["industry_breakdown"],
            "total_jobs": len(jobs),
        },
        "learning_recommendations": [
            {"skill": skill, "weight": round(weight, 3)} for skill, weight in learning
        ],
        "replaceability": {
            "replacement_score": replaceability["replacement_score"],
            "human_match_count": replaceability["human_match_count"],
            "agent_match_count": replaceability["agent_match_count"],
            "both_match_count": replaceability["both_match_count"],
            "human_only_count": replaceability["human_only_count"],
            "agent_only_count": replaceability["agent_only_count"],
            "human_only_jobs": human_only_jobs,
            "agent_only_jobs": agent_only_jobs,
        },
    }
