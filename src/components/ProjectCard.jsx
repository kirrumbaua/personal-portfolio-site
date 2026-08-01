import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function ProjectCard({ title, date, tech, contributions, link }) {
  const content = (
    <div className="group py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 px-2 -mx-2 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white flex items-center gap-1.5 transition-colors">
          {title}
          {link && <ArrowUpRight size={14} className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />}
        </h3>
        <span className="font-mono text-[12px] text-zinc-400 dark:text-zinc-500">
          {date}
        </span>
      </div>

      <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
        {contributions}
      </p>
      
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tech.map((t, i) => (
          <span key={i} className="px-2 py-0.5 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-md">
            {t}
          </span>
        ))}
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}
