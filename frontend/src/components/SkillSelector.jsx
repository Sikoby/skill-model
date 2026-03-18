import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';

export default function SkillSelector({ skills, selected, onToggle, onAnalyze, loading }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return skills;
    const q = search.toLowerCase();
    return skills.filter(s => s.toLowerCase().includes(q));
  }, [skills, search]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Your Skills</h2>
          {selected.size > 0 && (
            <Badge variant="secondary">{selected.size} selected</Badge>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-0.5">
          {filtered.map(skill => (
            <label
              key={skill}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer text-sm"
            >
              <Checkbox
                checked={selected.has(skill)}
                onCheckedChange={() => onToggle(skill)}
              />
              <span className={selected.has(skill) ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                {skill}
              </span>
            </label>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <Button
          onClick={onAnalyze}
          disabled={selected.size === 0 || loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>
    </div>
  );
}
