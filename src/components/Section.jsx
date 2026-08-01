import React from 'react';
import { cn } from '../utils/cn';

export function Section({ id, title, index, children, className, actionLink, actionText }) {
  return (
    <section id={id} className={cn("pt-10 pb-4 border-t border-zinc-200 dark:border-zinc-800/60", className)}>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-pixel text-sm text-zinc-400 dark:text-zinc-500 lowercase tracking-wide">
          {index && `${index} — `}{title}
        </h2>
        {actionText && (
          <a href={actionLink || "#"} className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            {actionText}
          </a>
        )}
      </div>
      <div className="flex flex-col">
        {children}
      </div>
    </section>
  );
}
