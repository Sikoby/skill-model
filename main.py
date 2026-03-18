from model import SkillSet
from backend.model import NaiveSkillModel, NaiveSkillEngine
from backend.pipelines.build_skill_set import load_jobs
from backend.pipelines.build_agent_skill_set import build_agent_skill_set
from backend.analytics.demand import compute_demand_summary


def main():
    # Load skill model from CSV
    skill_model = NaiveSkillModel.load("data/skills.csv")

    # Initialize engine
    engine = NaiveSkillEngine(skill_model)

    # Load job requirements
    jobs = load_jobs("data/jobs.csv", skill_model)
    job_skill_sets = [skill_set for _, skill_set in jobs]

    # Hardcoded human skillset (binary)
    human_skills = SkillSet(skill_model, {
        "Data Analysis": 1.0,
        "Data Visualization": 1.0,
        "Machine Learning": 1.0,
        "Business Strategy": 1.0,
        "Statistics": 1.0,
        "Programming Languages": 1.0,
        "Data Science Foundations": 1.0,
    })

    # --- Human Analysis ---
    print("=" * 50)
    print("HUMAN SKILL ANALYSIS")
    print("=" * 50)

    matches = engine.get_matching_positions(human_skills, job_skill_sets)
    summary = compute_demand_summary(matches, jobs)

    print(f"Jobs matched: {summary['match_count']} / {len(jobs)}")
    print(f"Match ratio: {summary['match_ratio']:.1%}")
    if summary["salary_min"] > 0:
        print(f"Salary range: ${summary['salary_min']:,} - ${summary['salary_max']:,}")
        print(f"Salary avg: ${summary['salary_avg']:,.0f}")

    if summary["industry_breakdown"]:
        print(f"\nIndustry breakdown:")
        for industry, count in summary["industry_breakdown"].items():
            print(f"  {industry}: {count} positions")

    # Learning recommendation
    recs = engine.get_learning_recommendation(job_skill_sets, human_skills)
    if recs:
        print(f"\nTop learning recommendations:")
        for skill, weight in sorted(recs.items(), key=lambda x: -x[1])[:5]:
            print(f"  {skill}: weight {weight:.2f}")

    # --- Agent Analysis ---
    print("\n" + "=" * 50)
    print("AI AGENT SKILL ANALYSIS")
    print("=" * 50)

    agent_skills = build_agent_skill_set(skill_model)

    agent_matches = engine.get_matching_positions(agent_skills, job_skill_sets)
    agent_summary = compute_demand_summary(agent_matches, jobs)

    print(f"Jobs matched: {agent_summary['match_count']} / {len(jobs)}")
    print(f"Match ratio: {agent_summary['match_ratio']:.1%}")

    # Show a sample of agent skill levels
    print(f"\nSample agent skill levels:")
    sample_skills = ["Data Analysis", "Machine Learning", "Content Marketing",
                     "UX Design", "Programming Languages", "Cloud Platforms"]
    for skill in sample_skills:
        level = agent_skills.get_proficancy(skill)
        print(f"  {skill}: {level:.3f}")

    # --- Replaceability ---
    print("\n" + "=" * 50)
    print("REPLACEABILITY ANALYSIS")
    print("=" * 50)

    replaceability = engine.get_replaceability(human_skills, agent_skills, job_skill_sets)

    print(f"Replacement score: {replaceability['replacement_score']:.1%}")
    print(f"Human can do: {replaceability['human_match_count']} jobs")
    print(f"Agent can do: {replaceability['agent_match_count']} jobs")
    print(f"Both can do: {replaceability['both_match_count']} jobs")
    print(f"Human-only: {replaceability['human_only_count']} jobs")
    print(f"Agent-only: {replaceability['agent_only_count']} jobs")

    # Show which jobs are human-only
    if replaceability["human_only_indices"]:
        print(f"\nJobs only the human qualifies for:")
        for i in replaceability["human_only_indices"]:
            print(f"  - {jobs[i][0]['job_title']} ({jobs[i][0]['industry']})")

    if replaceability["agent_only_indices"]:
        print(f"\nJobs only the agent qualifies for:")
        for i in replaceability["agent_only_indices"]:
            print(f"  - {jobs[i][0]['job_title']} ({jobs[i][0]['industry']})")


if __name__ == "__main__":
    main()
