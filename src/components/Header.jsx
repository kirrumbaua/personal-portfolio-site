import React from 'react';
import { playSound } from '../utils/siteSounds';

export function Header() {
  return (
    <section className="relative pt-10 pb-10 sm:pt-16 sm:pb-12">
      <div className="grid gap-8 sm:grid-cols-[16rem_1fr] sm:items-start sm:gap-10">
        
        {/* Photo Column */}
        <div className="mx-auto w-full max-w-[16rem] sm:mx-0">
          <div className="relative bg-white">
            <img 
              src="/profile.png" 
              alt="Kurt Ian Rumbaua" 
              className="block w-full select-none object-contain"
              onError={(e) => {
                e.target.src = '/profile.jpg';
              }}
              draggable="false"
            />
            {/* Halftone dissolve overlay at bottom */}
            <div aria-hidden="true" className="halftone-white mask-up pointer-events-none absolute inset-x-0 bottom-0 h-full opacity-60" />
          </div>
        </div>

        {/* Text Column */}
        <div className="flex flex-col pt-1 sm:pt-0">
          <h1 className="font-pixel text-3xl sm:text-[2.5rem] leading-none text-zinc-900 dark:text-zinc-100">
            Kurt Ian Rumbaua
          </h1>

          {/* Location / Status Pill */}
          <div className="mt-3.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Metro Manila, PH
            </span>
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            I'm a Computer Science student at Mapúa University specializing in Application Development. 
            Lately, I've been upskilling and diving into Data Analytics and Data Engineering.
          </p>

          <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            Currently finishing my thesis and actively looking for internship positions in software development, data analytics, and data engineering.
          </p>

          {/* Social Links Row */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12px] text-zinc-500 dark:text-zinc-400">
            <a 
              href="https://github.com/kirrumbaua" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => playSound('press')}
              onMouseEnter={() => playSound('tick')}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              github ↗
            </a>
            <a 
              href="https://www.linkedin.com/in/kurt-ian-rumbaua-b8728127a/" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => playSound('press')}
              onMouseEnter={() => playSound('tick')}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              linkedin ↗
            </a>
            <a 
              href="https://www.instagram.com/kurtiannn_/" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => playSound('press')}
              onMouseEnter={() => playSound('tick')}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              instagram ↗
            </a>
            <a 
              href="mailto:kurtrumbaua28@gmail.com" 
              onClick={() => playSound('press')}
              onMouseEnter={() => playSound('tick')}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              email ↗
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
