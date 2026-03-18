export async function fetchSkills() {
  const res = await fetch('/api/skills');
  const data = await res.json();
  return data.skills;
}

export async function analyzeSkills(skills) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills }),
  });
  return res.json();
}
