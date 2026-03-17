import pickle
from typing import Dict, Set, Self
from .skill_model import SkillModel


class SkillSet:
   """
   A skill set is a collection of skills and their proficancies of a human or AI agent or requirements of a job.
   """
   model: SkillModel
   proficancies: Dict[str, float]

   def __init__(self, model: SkillModel, proficancies: Dict[str, float]):
      self.model = model

      for skill, value in proficancies.items():
         if skill not in model.skills:
            raise ValueError(f"Skill {skill} not found in model")
      self.proficancies = proficancies

   def get_proficancy(self, skill: str) -> float:
      return self.proficancies.get(skill, 0.0)

   def get_proficancies(self) -> Dict[str, float]:
      return self.proficancies

   def get_skill_names(self, threshold: float = 0.0) -> Set[str]:
      """Return set of skill names where proficiency > threshold."""
      return {s for s, v in self.proficancies.items() if v > threshold}

   def save(self, file_path: str) -> None:
      with open(file_path, "wb") as f:
         pickle.dump(self, f)

   @classmethod
   def load(cls, file_path: str, model: SkillModel) -> Self:
      with open(file_path, "rb") as f:
         skill_set = pickle.load(f)
      skill_set.model = model
      return skill_set