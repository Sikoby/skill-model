import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, X, Plus } from 'lucide-react';
import { fetchSuggestions } from '../api';

export default function SkillSelector({ skills, selected, onToggle, onAnalyze, loading }) {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  // Fetch suggestions when selected skills or search changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await fetchSuggestions([...selected], search);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selected, search]);

  const selectedArray = [...selected].sort();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Your Skills</h2>
          {selected.size > 0 && (
            <Badge variant="secondary">{selected.size} selected</Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Selected skills as badges */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {selectedArray.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {selectedArray.map(skill => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="gap-1 pr-1 cursor-pointer"
                >
                  {skill}
                  <button
                    onClick={() => onToggle(skill)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Search and select skills below
            </p>
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Search bar */}
      <div className="p-4 pb-2">
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

      {/* Suggestions — fixed min-height so search bar doesn't jump */}
      <div className="px-4 pb-3 min-h-[7.5rem]">
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map(skill => (
            <Badge
              key={skill}
              variant="outline"
              className="gap-1 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => {
                onToggle(skill);
                setSearch('');
              }}
            >
              <Plus className="size-3" />
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Analyze button */}
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
