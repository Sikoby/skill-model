from typing import List, Tuple, Dict
from model import SkillSet


def compute_demand_summary(matches: Dict, jobs: List[Tuple[Dict, SkillSet]]) -> Dict:
    """
    Enrich engine output with job metadata: salary stats, industry breakdown, etc.
    """
    matched_indices = {i for i, ratio in matches["partial_matches"] if ratio == 1.0}

    matched_salaries = [jobs[i][0]["salary"] for i in matched_indices]
    industry_counts: Dict[str, int] = {}
    for i in matched_indices:
        ind = jobs[i][0]["industry"]
        industry_counts[ind] = industry_counts.get(ind, 0) + 1

    return {
        "match_count": matches["match_count"],
        "match_ratio": matches["match_ratio"],
        "salary_min": min(matched_salaries) if matched_salaries else 0,
        "salary_max": max(matched_salaries) if matched_salaries else 0,
        "salary_avg": sum(matched_salaries) / len(matched_salaries) if matched_salaries else 0,
        "industry_breakdown": industry_counts,
        "missing_skills": matches["missing_skills"],
    }
