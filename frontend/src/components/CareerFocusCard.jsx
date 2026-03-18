import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CareerFocusCard({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Career Focus</h3>
        <div className="text-gray-400 text-sm">You already cover all required skills!</div>
      </div>
    );
  }

  const data = recommendations.map(r => ({
    skill: r.skill.length > 25 ? r.skill.slice(0, 22) + '...' : r.skill,
    fullSkill: r.skill,
    weight: Math.round(r.weight * 100),
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Career Focus</h3>
      <p className="text-xs text-gray-400 mb-4">Skills to learn next for maximum job market impact</p>

      <ResponsiveContainer width="100%" height={data.length * 36 + 20}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} fontSize={11} />
          <YAxis type="category" dataKey="skill" width={160} fontSize={11} />
          <Tooltip
            formatter={(value, _, props) => [`${value}% of jobs require this`, props.payload.fullSkill]}
            labelFormatter={() => ''}
          />
          <Bar dataKey="weight" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
