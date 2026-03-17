from typing import List, Dict
from model import SkillEngine, SkillSet


class NaiveSkillEngine(SkillEngine):
    """
    Simple skill engine with binary proficiency (1.0 = has skill, 0.0 = doesn't).
    """

    def matches_requirement(self, requirement: SkillSet, candidate: SkillSet) -> bool:
        for skill in requirement.get_proficancies():
            if requirement.get_proficancy(skill) > 0 and candidate.get_proficancies().get(skill, 0) == 0:
                return False
        return True

    def get_matching_positions(self, candidate: SkillSet, job_requirements: List[SkillSet]) -> Dict:
        match_count = 0
        partial_matches = []
        missing_skills: Dict[str, int] = {}

        for i, req in enumerate(job_requirements):
            req_skills = {s for s, v in req.get_proficancies().items() if v > 0}
            cand_skills = {s for s, v in candidate.get_proficancies().items() if v > 0}

            overlap = req_skills & cand_skills
            if len(req_skills) == 0:
                continue

            overlap_ratio = len(overlap) / len(req_skills)

            if overlap_ratio == 1.0:
                match_count += 1
            partial_matches.append((i, overlap_ratio))

            for skill in req_skills - cand_skills:
                missing_skills[skill] = missing_skills.get(skill, 0) + 1

        total = len(job_requirements)
        return {
            "match_count": match_count,
            "match_ratio": match_count / total if total > 0 else 0.0,
            "partial_matches": partial_matches,
            "missing_skills": missing_skills,
        }

    def get_learning_recommendation(self, requirements: List[SkillSet], candidate: SkillSet) -> Dict[str, float]:
        cand_skills = {s for s, v in candidate.get_proficancies().items() if v > 0}
        skill_counts: Dict[str, int] = {}
        total = len(requirements)

        for req in requirements:
            for skill, value in req.get_proficancies().items():
                if value > 0 and skill not in cand_skills:
                    skill_counts[skill] = skill_counts.get(skill, 0) + 1

        if total == 0:
            return {}
        return {skill: count / total for skill, count in skill_counts.items()}