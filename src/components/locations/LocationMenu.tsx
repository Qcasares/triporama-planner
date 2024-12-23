import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Menu, Calendar, SortAsc, Layers, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LocationMenuProps {
  onSort?: () => void;
  onGroup?: () => void;
  onSettings?: () => void;
  onDateFilter?: () => void;
}

export const LocationMenu = ({
  onSort,
  onGroup,
  onSettings,
  onDateFilter,
}: LocationMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-medium">View Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSort} className="gap-2 text-sm">
          <SortAsc className="h-4 w-4" />
          Sort by Date
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onGroup} className="gap-2 text-sm">
          <Layers className="h-4 w-4" />
          Group by Day
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDateFilter} className="gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          Filter by Date
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSettings} className="gap-2 text-sm">
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
