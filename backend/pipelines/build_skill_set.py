import csv
from typing import List, Tuple, Dict
from model import SkillModel, SkillSet


def load_jobs(file_path: str, model: SkillModel) -> List[Tuple[Dict, SkillSet]]:
    """
    Load jobs from a CSV file. Returns list of (metadata, SkillSet) tuples.
    metadata contains: job_title, industry, salary
    """
    jobs = []
    with open(file_path, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            skills_list = [s.strip() for s in row["required_skills"].split(";")]
            proficancies = {skill: 1.0 for skill in skills_list if skill in model.get_skills()}

            metadata = {
                "job_title": row["job_title"],
                "industry": row["industry"],
                "salary": int(row["salary"]),
            }
            skill_set = SkillSet(model, proficancies)
            jobs.append((metadata, skill_set))
    return jobs
