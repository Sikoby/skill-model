export default function ReplaceabilityCard({ replaceability }) {
  const score = Math.round(replaceability.replacement_score * 100);

  let color, bg, label;
  if (score < 40) {
    color = 'text-green-600';
    bg = 'bg-green-50 border-green-200';
    label = 'Low Risk';
  } else if (score < 70) {
    color = 'text-yellow-600';
    bg = 'bg-yellow-50 border-yellow-200';
    label = 'Moderate Risk';
  } else {
    color = 'text-red-600';
    bg = 'bg-red-50 border-red-200';
    label = 'High Risk';
  }

  return (
    <div className={`rounded-xl border p-6 ${bg}`}>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">AI Replaceability</h3>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className={`text-5xl font-bold ${color}`}>{score}%</div>
          <div className={`text-sm font-medium mt-1 ${color}`}>{label}</div>
        </div>

        <div className="flex-1 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Jobs you qualify for</span>
            <span className="font-medium text-gray-900">{replaceability.human_match_count}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Jobs AI can do</span>
            <span className="font-medium text-gray-900">{replaceability.agent_match_count}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Overlap (both)</span>
            <span className="font-medium text-gray-900">{replaceability.both_match_count}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between">
            <span className="text-gray-600">Only you</span>
            <span className="font-semibold text-green-600">{replaceability.human_only_count}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Only AI</span>
            <span className="font-semibold text-red-600">{replaceability.agent_only_count}</span>
          </div>
        </div>
      </div>

      {replaceability.human_only_jobs?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-500 mb-2">Jobs only you qualify for:</div>
          <div className="flex flex-wrap gap-1">
            {replaceability.human_only_jobs.map((job, i) => (
              <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {job.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
