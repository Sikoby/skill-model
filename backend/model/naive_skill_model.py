import pickle
from typing import Self
from model import SkillModel


class NaiveSkillModel(SkillModel):
    """
    Simple skill model that treats skills as a flat list loaded from a CSV file.
    """

    @classmethod
    def load(cls, file_path: str) -> Self:
        with open(file_path, "r") as f:
            skills = [line.strip() for line in f if line.strip()]
        return cls(skills)

    def save(self, file_path: str) -> None:
        with open(file_path, "wb") as f:
            pickle.dump(self, f)
