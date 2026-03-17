from typing import Dict
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
      return self.proficancies[skill]

   def get_proficancies(self) -> Dict[str, float]:
      return self.proficancies