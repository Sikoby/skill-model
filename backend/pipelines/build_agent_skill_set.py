import os
import numpy as np
from typing import Dict, List, Optional
from model import SkillModel, SkillSet
from sentence_transformers import SentenceTransformer


DEFAULT_AGENT_CAPABILITIES = {
    "Reasoning": 0.9,
    "Physical Manipulation": 0.1,
    "Language Understanding": 0.9,
    "Code Generation": 0.85,
    "Visual Perception": 0.7,
    "Creativity": 0.6,
    "Mathematical Computation": 0.95,
    "Data Processing": 0.9,
    "Social Intelligence": 0.4,
    "Domain Expertise": 0.5,
}


def compute_weight_matrix(skill_names: List[str], abstract_names: List[str]) -> np.ndarray:
    """
    Compute a weight matrix (n_skills, n_abstract) using sentence embeddings.
    Each row is normalized to sum to 1 so it represents how a real skill
    is composed of abstract capabilities.
    """

    model = SentenceTransformer("all-MiniLM-L6-v2")

    skill_embeddings = model.encode(skill_names, normalize_embeddings=True)
    abstract_embeddings = model.encode(abstract_names, normalize_embeddings=True)

    # Cosine similarity (embeddings are already normalized)
    similarity = skill_embeddings @ abstract_embeddings.T

    # Clip negatives, normalize rows to sum to 1
    similarity = np.clip(similarity, 0, None)
    row_sums = similarity.sum(axis=1, keepdims=True)
    row_sums = np.maximum(row_sums, 1e-8)  # avoid division by zero
    weights = similarity / row_sums

    return weights


def load_or_compute_weights(
    skill_names: List[str],
    abstract_names: List[str],
    cache_path: str = "data/agent_weight_matrix.npz",
) -> np.ndarray:
    """Load weight matrix from cache or compute and save it."""
    if os.path.exists(cache_path):
        data = np.load(cache_path, allow_pickle=True)
        cached_skills = list(data["skill_names"])
        cached_abstracts = list(data["abstract_names"])
        if cached_skills == skill_names and cached_abstracts == abstract_names:
            return data["weights"]

    weights = compute_weight_matrix(skill_names, abstract_names)
    np.savez(
        cache_path,
        weights=weights,
        skill_names=np.array(skill_names, dtype=object),
        abstract_names=np.array(abstract_names, dtype=object),
    )
    return weights


def build_agent_skill_set(
    model: SkillModel,
    capabilities: Optional[Dict[str, float]] = None,
    cache_path: str = "data/agent_weight_matrix.npz",
) -> SkillSet:
    """
    Build an agent SkillSet from abstract capability scores.
    Uses sentence embeddings to map abstract capabilities to real skills.
    """
    if capabilities is None:
        capabilities = DEFAULT_AGENT_CAPABILITIES

    skill_names = model.get_skills()
    abstract_names = list(capabilities.keys())
    abstract_scores = np.array([capabilities[name] for name in abstract_names])

    weights = load_or_compute_weights(skill_names, abstract_names, cache_path)
    skill_levels = weights @ abstract_scores
    skill_levels = np.clip(skill_levels, 0.0, 1.0)

    proficancies = {skill: float(level) for skill, level in zip(skill_names, skill_levels)}
    return SkillSet(model, proficancies)
