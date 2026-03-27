'use client';

import { Button } from '@/components/ui/button';
import { formatTime } from './game-utils';

interface CompletionScreenProps {
  elapsed: number;
  onRestart: () => void;
}

export function CompletionScreen({ elapsed, onRestart }: CompletionScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 overflow-auto">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-dim via-transparent to-transparent" />
      <div className="relative text-center animate-scale-in">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="none"/>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2 tracking-tight">Complete!</h2>
        <p className="text-foreground-muted mb-1">All 151 Pokémon named</p>
        <div className="my-8 p-4 rounded-xl bg-surface/50 border border-border-subtle">
          <p className="text-4xl font-mono font-semibold text-accent">{formatTime(elapsed)}</p>
        </div>
        <Button
          onClick={onRestart}
          className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-light font-medium transition-all hover:-translate-y-0.5"
        >
          Play Again
        </Button>
      </div>
    </div>
  );
}
