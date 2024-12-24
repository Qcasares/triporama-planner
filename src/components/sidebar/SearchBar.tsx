import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface SearchBarProps {
  searchQuery: string;
  showDateFilter: boolean;
  onSearchChange: (value: string) => void;
  onToggleDateFilter: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  showDateFilter,
  onSearchChange,
  onToggleDateFilter,
}) => {
  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
        <input
          type="text"
          placeholder="Search destinations..."
          className={cn(
            "w-full h-8 pl-8 pr-3 rounded-md text-sm",
            "bg-white/50 border border-input",
            "focus:outline-none focus:ring-2 focus:ring-primary/10",
            "placeholder:text-muted-foreground/50"
          )}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8",
          showDateFilter && "bg-primary/10 text-primary"
        )}
        onClick={onToggleDateFilter}
      >
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  );
};