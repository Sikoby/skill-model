import { useState, useEffect } from 'react';
import { fetchSkills, analyzeSkills } from './api';
import SkillSelector from './components/SkillSelector';
import Dashboard from './components/Dashboard';

export default function App() {
  const [skills, setSkills] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills().then(setSkills);
  }, []);

  const handleToggle = (skill) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeSkills([...selected]);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Skill Analyzer</h1>
        <p className="text-sm text-gray-500">Analyze your skills against the job market and AI capabilities</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r border-gray-200 bg-white flex-shrink-0">
          <SkillSelector
            skills={skills}
            selected={selected}
            onToggle={handleToggle}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        </aside>

        <main className="flex-1 overflow-y-auto">
          <Dashboard data={result} />
        </main>
      </div>
    </div>
  );
}
