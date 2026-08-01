import React, { useState, useEffect } from 'react';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../utils/cn';
import { playSound, isSoundEnabled, setSoundEnabled, initSiteSounds } from '../utils/siteSounds';

export function Navbar({ isDark, toggleDark }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    initSiteSounds();
    setSoundOn(isSoundEnabled());

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playSound('toggle');
  };

  const navLinks = [
    { label: 'experience', href: '#experience' },
    { label: 'projects', href: '#projects' },
    { label: 'education', href: '#education' },
    { label: 'skills', href: '#skills' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    playSound('press');
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Inline Top Bar (At top of page) */}
      <div 
        className={cn(
          "relative py-5 flex items-center justify-between font-mono text-[12px] text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800/40 transition-opacity duration-200",
          isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <a 
          href="#" 
          onClick={(e) => handleNavClick(e, '#')}
          onMouseEnter={() => playSound('tick')}
          className="font-pixel text-sm sm:text-base text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity whitespace-nowrap"
        >
          kurt ian
        </a>

        {/* Links shown on tablet/desktop */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              onMouseEnter={() => playSound('tick')}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors lowercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => playSound('tick')}
            className="p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            aria-label={soundOn ? "Mute interface sounds" : "Enable interface sounds"}
            title={soundOn ? "Sounds on" : "Sounds off"}
          >
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={(e) => {
              playSound('toggle');
              toggleDark(e);
            }}
            onMouseEnter={() => playSound('tick')}
            className="p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* 2. Floating Capsule Pill Navbar */}
      <div 
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out font-mono text-[11px] sm:text-[12px]",
          "px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-zinc-200/90 dark:border-zinc-800/90 bg-white/85 dark:bg-[#0c0c0f]/90 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/20 flex items-center gap-3 sm:gap-6 text-zinc-600 dark:text-zinc-400 whitespace-nowrap",
          isScrolled 
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto" 
            : "-translate-y-6 opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-3 sm:gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              onMouseEnter={() => playSound('tick')}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors lowercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="w-[1px] h-3 bg-zinc-200 dark:bg-zinc-800" />

        <div className="flex items-center gap-2">
          {/* Floating Sound Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => playSound('tick')}
            className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            aria-label={soundOn ? "Mute interface sounds" : "Enable interface sounds"}
            title={soundOn ? "Sounds on" : "Sounds off"}
          >
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* Floating Theme Toggle */}
          <button
            onClick={(e) => {
              playSound('toggle');
              toggleDark(e);
            }}
            onMouseEnter={() => playSound('tick')}
            className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </>
  );
}
