'use client';

import type { LanguageCode } from '../data/pokemon';
import { Button } from '@/components/ui/button';
import { LANGUAGES } from '../data/pokemon';

interface LanguageSelectionProps {
  onSelect: (lang: LanguageCode) => void;
}

export function LanguageSelection({ onSelect }: LanguageSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 overflow-auto">
      {/* Subtle grid background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-dim/20 via-transparent to-transparent" />
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Logo and title */}
      <div className="relative text-center mb-12 animate-slide-up">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight mb-2">
          <span className="text-accent">Dex</span><span className="text-foreground/70">Sprint</span>
        </h1>
        <div className="h-px w-16 bg-accent/30 mx-auto mb-4" />
        <p className="text-foreground-muted text-sm sm:text-base tracking-wide">
          Name all 151 Gen I Pokémon
        </p>
      </div>
      
      {/* Language selection grid with decorative elements */}
      <div className="relative w-full max-w-sm mb-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LANGUAGES.map((lang, i) => (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className="group relative px-4 py-5 rounded-xl bg-surface/30 border border-border-subtle 
                         text-sm font-medium text-foreground/90 transition-all duration-200 ease-out
                         hover:bg-surface hover:border-accent/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5
                         active:translate-y-0 active:scale-[0.98]"
              style={{ animationDelay: `${200 + i * 50}ms` }}
            >
              <span className="relative z-10">{lang.label}</span>
              {/* Subtle accent indicator on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent/60 group-hover:w-8 transition-all duration-200" />
            </button>
          ))}
        </div>
      </div>
      
      {/* Status text with subtle icon */}
      <div className="relative flex items-center gap-2 text-foreground-subtle text-xs tracking-widest uppercase animate-fade-in" style={{ animationDelay: '350ms' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
        <span>Ready to begin</span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
      </div>
    </div>
  );
}
