import { useState } from "react";
import { Search, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SearchPanelProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function SearchPanel({ searchQuery, onSearch }: SearchPanelProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) onSearch(localQuery.trim());
  };

  const handleClear = () => {
    setLocalQuery("");
    onSearch("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Search Person</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <Input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search by name..."
              className="pl-9"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
        {searchQuery && (
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Showing connections for "{searchQuery}"
          </p>
        )}
      </CardContent>
    </Card>
  );
}
