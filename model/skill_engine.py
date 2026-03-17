from .skill_set import SkillSet
from .skill_model import SkillModel
from typing import List, Dict
from abc import ABC, abstractmethod


class SkillEngine(ABC):
    def __init__(self, skill_model: SkillModel):
        self.skill_model = skill_model

    @abstractmethod
    def matches_requirement(self, requirement: SkillSet, candidate: SkillSet) -> bool:
        """
        Check if a candidate matches a requirement.
        """
        pass

    @abstractmethod
    def get_matching_positions(self, candidate: SkillSet, job_requirements: List[SkillSet]) -> Dict:
        """
        Get matching position metrics for a candidate across job listings.
        """
        pass

    @abstractmethod
    def get_learning_recommendation(self, requirements: List[SkillSet], candidate: SkillSet) -> Dict[str, float]:
        """
        Get a learning recommendation for a candidate based on the requirements.
        """
        pass
