"use client";

import { useState } from "react";
import type { LanguageCode, GenerationId } from "../data/pokemon";
import { LANGUAGES, GENERATIONS } from "../data/pokemon";

interface LanguageSelectionProps {
  onSelect: (lang: LanguageCode, generations: Set<GenerationId>) => void;
  initialGenerations?: Set<GenerationId>;
}

export function LanguageSelection({
  onSelect,
  initialGenerations,
}: LanguageSelectionProps) {
  const [selectedGens, setSelectedGens] = useState<Set<GenerationId>>(() =>
    initialGenerations ? new Set(initialGenerations) : new Set([1]),
  );
  const [selectedLang, setSelectedLang] = useState<LanguageCode | null>(null);

  const toggleGen = (genId: GenerationId) => {
    setSelectedGens((prev) => {
      const next = new Set(prev);
      if (next.has(genId)) {
        if (next.size > 1) next.delete(genId);
      } else {
        next.add(genId);
      }
      return next;
    });
  };

  const handleStart = () => {
    if (selectedLang && selectedGens.size > 0) {
      onSelect(selectedLang, selectedGens);
    }
  };

  const totalCount = GENERATIONS.filter((g) => selectedGens.has(g.id)).reduce(
    (sum, g) => sum + (g.endId - g.startId + 1),
    0,
  );

  const canStart = selectedLang !== null && selectedGens.size > 0;

  return (
    <div className="flex flex-col items-center sm:justify-center min-h-dvh bg-background text-foreground p-6 py-12 sm:py-6 overflow-auto">
      <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight mb-2">
        <span className="text-accent">Dex</span>
        <span className="text-foreground/70">Sprint</span>
      </h1>
      <div className="h-px w-16 bg-accent/30 mx-auto mb-4" />
      <p className="text-foreground-muted text-sm sm:text-base tracking-wide mb-8">
        Name all {totalCount} Pokémon
      </p>

      <div className="w-full max-w-sm mb-6">
        <p className="text-xs text-foreground-subtle tracking-widest uppercase mb-3 text-center">
          Select Generations
        </p>
        <div className="flex gap-2 justify-center">
          {GENERATIONS.map((gen) => (
            <button
              key={gen.id}
              type="button"
              onClick={() => toggleGen(gen.id)}
              className={`px-4 py-3 rounded-xl border transition-all
                ${
                  selectedGens.has(gen.id)
                    ? "bg-accent/10 border-accent/40 text-accent"
                    : "bg-surface/30 border-border-subtle text-foreground/70 hover:bg-surface"
                }`}
            >
              {gen.label} ({gen.endId - gen.startId + 1})
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm mb-8">
        <p className="text-xs text-foreground-subtle tracking-widest uppercase mb-3 text-center">
          Select Language
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelectedLang(lang.code)}
              className={`px-4 py-5 rounded-xl border transition-all
                ${
                  selectedLang === lang.code
                    ? "bg-accent/10 border-accent/40 text-accent"
                    : "bg-surface/30 border-border-subtle hover:bg-surface"
                }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleStart}
        disabled={!canStart}
        className={`px-10 py-3.5 rounded-xl font-medium text-sm transition-all
          ${
            canStart
              ? "bg-accent hover:bg-accent-light text-background"
              : "bg-surface/50 text-foreground-dim cursor-not-allowed"
          }`}
      >
        Start Game
      </button>

      <div className="flex items-center gap-2 text-foreground-subtle text-xs tracking-widest uppercase mt-8">
        <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
        <span>Ready to begin</span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
      </div>
    </div>
  );
}
