import { useState, useMemo } from 'react';

export default function SkillSelector({ skills, selected, onToggle, onAnalyze, loading }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return skills;
    const q = search.toLowerCase();
    return skills.filter(s => s.toLowerCase().includes(q));
  }, [skills, search]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Skills</h2>
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-2 text-xs text-gray-500">
          {selected.size} selected
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {filtered.map(skill => (
          <label
            key={skill}
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer text-sm"
          >
            <input
              type="checkbox"
              checked={selected.has(skill)}
              onChange={() => onToggle(skill)}
              className="rounded text-blue-600"
            />
            <span className={selected.has(skill) ? 'text-gray-900 font-medium' : 'text-gray-600'}>
              {skill}
            </span>
          </label>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onAnalyze}
          disabled={selected.size === 0 || loading}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    </div>
  );
}
