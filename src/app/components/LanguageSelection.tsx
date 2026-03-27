'use client';

import type { LanguageCode } from '../data/pokemon';
import { Button } from '@/components/ui/button';
import { LANGUAGES } from '../data/pokemon';

interface LanguageSelectionProps {
  onSelect: (lang: LanguageCode) => void;
}

export function LanguageSelection({ onSelect }: LanguageSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c0c0e] text-[#fafafa] p-6 overflow-auto">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a0a0a] via-[#0c0c0e] to-[#0c0c0e] opacity-50" />
      <div className="relative text-center mb-12 animate-slide-up">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#ef4444]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            <span className="text-[#ef4444]">Dex</span>Sprint
          </h1>
        </div>
        <p className="text-[#a1a1aa] text-base sm:text-lg">
          Name all 151 Gen I Pokémon
        </p>
      </div>
      
      <div 
        className="relative grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-sm animate-slide-up" 
        style={{ animationDelay: '100ms' }}
      >
        {LANGUAGES.map((lang, i) => (
          <Button
            key={lang.code}
            variant="outline"
            onClick={() => onSelect(lang.code)}
            className="group relative px-5 py-4 rounded-2xl bg-[#141416] border-[#27272a] 
                       text-sm font-medium transition-all duration-300 ease-out
                       hover:bg-[#1c1c1f] hover:border-[#ef4444]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ef4444]/5
                       active:translate-y-0 active:scale-[0.98]"
            style={{ animationDelay: `${150 + i * 60}ms` }}
          >
            <span className="relative z-10">{lang.label}</span>
          </Button>
        ))}
      </div>
      
      <p className="relative text-[#52525b] text-xs mt-12 animate-fade-in tracking-wide" style={{ animationDelay: '600ms' }}>
        Select a language to begin
      </p>
    </div>
  );
}
