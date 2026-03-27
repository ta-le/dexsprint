'use client';

import { Button } from '@/components/ui/button';
import { formatTime } from './game-utils';

interface CompletionScreenProps {
  elapsed: number;
  onRestart: () => void;
}

export function CompletionScreen({ elapsed, onRestart }: CompletionScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c0c0e] text-[#fafafa] p-6 overflow-auto">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a0a0a] via-[#0c0c0e] to-[#0c0c0e] opacity-60" />
      <div className="relative text-center animate-scale-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#ef4444]/20 to-[#ef4444]/5 border border-[#ef4444]/30 flex items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.2)]">
          <svg className="w-10 h-10 text-[#ef4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#ef4444" stroke="none"/>
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Complete!</h2>
        <p className="text-[#a1a1aa] mb-1">All 151 Pokémon named</p>
        <div className="my-8 p-4 rounded-2xl bg-[#141416] border border-[#27272a]">
          <p className="text-5xl font-mono font-bold text-[#ef4444]">{formatTime(elapsed)}</p>
        </div>
        <Button
          onClick={onRestart}
          className="group relative px-8 py-3.5 rounded-xl bg-[#ef4444] hover:bg-[#f87171] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ef4444]/20 active:translate-y-0"
        >
          Play Again
        </Button>
      </div>
    </div>
  );
}
