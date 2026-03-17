from typing import List, Collection, Self
from dataclasses import dataclass

@dataclass
class SkillModel:
    """
    A skill model is a collection of skills and their relationships. Can be for insatnace a Graph or a simple list.
    """

    skills: Collection[str]
    
    def __init__(self, skills: List[str]):
        self.skills = sorted(skills)

    @classmethod
    def load(cls, file_path: str) -> Self:
        pass

    def save(self, file_path: str) -> None:
        pass
        
    def get_skill(self, id: int) -> str:
        return self.skills[id]

    def get_skills(self) -> List[str]:
        return self.skills


