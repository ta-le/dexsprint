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
    <header className="flex items-center justify-between px-5 sm:px-7 py-4 bg-surface-elevated/80 backdrop-blur-sm border-b border-border-subtle">
      <div className="flex items-center gap-5 sm:gap-8">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
          <span className="text-accent">Dex</span>
          <span className="text-foreground/85">Sprint</span>
        </h1>
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface/50 border border-border-subtle">
            <span className="font-mono text-sm">
              <span className="text-accent font-medium">{guessedCount}</span>
              <span className="text-foreground-muted">/151</span>
            </span>
          </div>
          {/* Timer */}
          <div className="font-mono text-sm text-foreground-muted tabular-nums tracking-wider px-2">
            {formatTime(elapsed)}
          </div>
          {/* Language */}
          <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-widest text-foreground-muted bg-surface/30 px-2.5 py-1 rounded">
            {language}
          </span>
        </div>
      </div>
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-surface-hover transition-colors text-foreground-muted hover:text-foreground"
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
