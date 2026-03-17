from typing import List, Dict
from model import SkillEngine, SkillSet


class NaiveSkillEngine(SkillEngine):
    """
    Simple skill engine with proficiency threshold matching.
    A candidate qualifies for a skill if their proficiency >= PROFICIENCY_THRESHOLD.
    """

    PROFICIENCY_THRESHOLD = 0.8

    def matches_requirement(self, requirement: SkillSet, candidate: SkillSet) -> bool:
        for skill in requirement.get_proficancies():
            if requirement.get_proficancy(skill) > 0:
                if candidate.get_proficancy(skill) < self.PROFICIENCY_THRESHOLD:
                    return False
        return True

    def get_matching_positions(self, candidate: SkillSet, job_requirements: List[SkillSet]) -> Dict:
        match_count = 0
        partial_matches = []
        missing_skills: Dict[str, int] = {}

        for i, req in enumerate(job_requirements):
            req_skills = req.get_skill_names(threshold=0.0)
            cand_skills = candidate.get_skill_names(threshold=self.PROFICIENCY_THRESHOLD - 0.001)

            overlap = req_skills & cand_skills
            if len(req_skills) == 0:
                continue

            overlap_ratio = len(overlap) / len(req_skills)

            if self.matches_requirement(req, candidate):
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
        cand_skills = candidate.get_skill_names(threshold=self.PROFICIENCY_THRESHOLD - 0.001)
        skill_counts: Dict[str, int] = {}
        total = len(requirements)

        for req in requirements:
            for skill, value in req.get_proficancies().items():
                if value > 0 and skill not in cand_skills:
                    skill_counts[skill] = skill_counts.get(skill, 0) + 1

        if total == 0:
            return {}
        return {skill: count / total for skill, count in skill_counts.items()}

    def get_replaceability(self, human: SkillSet, agent: SkillSet, job_requirements: List[SkillSet]) -> Dict:
        human_matches = set()
        agent_matches = set()
        both_match = set()

        for i, req in enumerate(job_requirements):
            h = self.matches_requirement(req, human)
            a = self.matches_requirement(req, agent)
            if h:
                human_matches.add(i)
            if a:
                agent_matches.add(i)
            if h and a:
                both_match.add(i)

        human_count = len(human_matches)
        replacement_score = len(both_match) / human_count if human_count > 0 else 0.0

        return {
            "replacement_score": replacement_score,
            "human_match_count": human_count,
            "agent_match_count": len(agent_matches),
            "both_match_count": len(both_match),
            "human_only_count": len(human_matches - agent_matches),
            "agent_only_count": len(agent_matches - human_matches),
            "human_only_indices": human_matches - agent_matches,
            "agent_only_indices": agent_matches - human_matches,
            "both_indices": both_match,
        }
