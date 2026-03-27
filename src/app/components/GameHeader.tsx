'use client';

import { formatTime } from './game-utils';

interface GameHeaderProps {
  guessedCount: number;
  elapsed: number;
  language: string;
  onMenuClick: () => void;
}

export function GameHeader({ guessedCount, elapsed, language, onMenuClick }: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between px-3 sm:px-5 py-3">
      <div className="flex items-center gap-3 sm:gap-5">
        <h1 className="text-sm sm:text-base font-bold tracking-tight">
          <span className="text-[#ef4444]">Dex</span>Sprint
        </h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative px-3 py-1.5 rounded-lg bg-[#1c1c1f] border border-[#27272a]">
            <span className="font-mono text-sm">
              <span className="text-[#ef4444] font-semibold">{guessedCount}</span>
              <span className="text-[#52525b]">/151</span>
            </span>
          </div>
          <span className="font-mono text-sm text-[#a1a1aa] tabular-nums">
            {formatTime(elapsed)}
          </span>
          <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-wider text-[#52525b] bg-[#1c1c1f] px-2 py-1 rounded-md border border-[#27272a]">
            {language}
          </span>
        </div>
      </div>
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-[#1c1c1f] transition-colors text-[#a1a1aa] hover:text-[#fafafa]"
        aria-label="Menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </header>
  );
}
