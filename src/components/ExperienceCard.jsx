import React from 'react';

export function ExperienceCard({ role, company, type, date, points }) {
  return (
    <div className="py-3">
      {/* 12-Column Table Header Row */}
      <div className="grid grid-cols-12 items-baseline gap-2 sm:gap-4 select-none">
        {/* Date / Year Column */}
        <div className="col-span-3 sm:col-span-2 font-mono text-[12px] text-zinc-400 dark:text-zinc-500">
          {date}
        </div>

        {/* Role Title Column */}
        <div className="col-span-9 sm:col-span-6 text-[14px] font-medium text-zinc-900 dark:text-zinc-100">
          {role}
        </div>

        {/* Company & Type Column */}
        <div className="col-span-12 sm:col-span-4 text-[13px] text-zinc-500 dark:text-zinc-400 sm:text-right font-normal">
          {company} {type ? `· ${type}` : ''}
        </div>
      </div>

      {/* Inline Points (Always Visible) */}
      {points && points.length > 0 && (
        <div className="mt-2.5 pl-0 sm:pl-[16.666%] pr-2 space-y-1.5">
          {points.map((point, i) => (
            <div key={i} className="flex gap-2 text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <span className="text-zinc-300 dark:text-zinc-600 flex-shrink-0 mt-0.5">•</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
