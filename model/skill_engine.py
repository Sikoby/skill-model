from model.skill_set import SkillSet
from skill_model import SkillModel
import numpy as np
from typing import Dict
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
    def get_learning_recommendation(self, requirements: List[SkillSet], candidate: SkillSet) -> Dict[str, float]:
        """
        Get a learning recommendation for a candidate based on the requirements.
        """
        pass

    @abstractmethod
    def infer_proficancy(self, candidate: SkillSet) -> SkillSet:
        """
        Infer the proficancy of a candidate based on the skill models moddelling assumptions about skill composition.
        """
        pass
