import React from 'react';
import { cn } from '../utils/cn';

export function SkillBadge({ children }) {
  return (
    <span className={cn(
      "px-3 py-1.5 text-xs font-mono font-medium rounded-full transition-colors",
      "bg-zinc-100 text-zinc-800 border border-zinc-200 hover:bg-zinc-200",
      "dark:bg-zinc-800/80 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700/80"
    )}>
      {children}
    </span>
  );
}
