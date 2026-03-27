'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { POKEMON, getGeneration, type Pokemon, type LanguageCode, type GenerationId } from '../data/pokemon';

interface PokemonGridProps {
  guessed: Set<number>;
  language: LanguageCode;
  showDetail: boolean;
  flash: number | null;
  isMobile: boolean;
  generations: Set<GenerationId>;
}

export function PokemonGrid({ guessed, language, showDetail, flash, isMobile, generations }: PokemonGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(15);
  const [cellSize, setCellSize] = useState(44);

  const activePokemon = useMemo(() => {
    return POKEMON.filter(p => {
      const gen = getGeneration(p.id);
      return generations.has(gen);
    });
  }, [generations]);

  const generationBreaks = useMemo(() => {
    const breaks: number[] = [];
    let lastGen: GenerationId | null = null;
    activePokemon.forEach((pokemon, idx) => {
      const gen = getGeneration(pokemon.id);
      if (lastGen !== null && gen !== lastGen) {
        breaks.push(idx);
      }
      lastGen = gen;
    });
    return breaks;
  }, [activePokemon]);

  useEffect(() => {
    function calc() {
      const el = containerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w === 0) return;
      if (isMobile) {
        const minCellSize = 64;
        const c = Math.max(5, Math.floor(w / minCellSize));
        setCols(c);
        setCellSize(w / c);
      } else {
        const minCellSize = 96;
        const c = Math.max(5, Math.floor(w / minCellSize));
        setCols(c);
        setCellSize(w / c);
      }
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [isMobile, activePokemon.length]);

  useEffect(() => {
    if (flash === null) return;
    const el = containerRef.current?.querySelector<HTMLElement>(`[data-pokemon-id="${flash}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [flash]);

  const rows = Math.ceil(activePokemon.length / cols);

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto">
      <div
        className="grid w-full"
        style={isMobile
          ? {
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridAutoRows: `${cellSize}px`,
              gap: '1px',
              paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
            }
          : {
              gridAutoRows: `${cellSize}px`,
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: '1px',
            }
        }
      >
        {activePokemon.map((pokemon, idx) => (
          <div key={pokemon.id} style={generationBreaks.includes(idx) ? { borderLeft: '2px solid var(--accent)', marginLeft: '-1px' } : undefined} className="min-h-0">
            <PokemonCell
              pokemon={pokemon}
              revealed={guessed.has(pokemon.id)}
              language={language}
              showDetail={showDetail}
              isFlashing={flash === pokemon.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface PokemonCellProps {
  pokemon: Pokemon;
  revealed: boolean;
  language: LanguageCode;
  showDetail: boolean;
  isFlashing: boolean;
}

export function PokemonCell({ pokemon, revealed, language, showDetail, isFlashing }: PokemonCellProps) {
  const name = pokemon.names[language] || pokemon.names.en;

  if (!revealed) {
    return (
      <div className="bg-surface flex items-center justify-center overflow-hidden" style={{ aspectRatio: '1' }}>
        <span className="text-foreground-dim text-[10px] select-none font-mono">{pokemon.id}</span>
      </div>
    );
  }

  return (
    <div
      data-pokemon-id={pokemon.id}
      style={{ containerType: 'inline-size', aspectRatio: '1' }}
      className={`relative transition-all duration-200 
        ${isFlashing 
          ? 'animate-reveal -m-px p-px bg-gradient-to-br from-amber-500/20 to-amber-400/10' 
          : 'bg-surface hover:bg-surface-hover'
        }`}
    >
      <img
        src={`/sprites/${pokemon.id}.png`}
        alt={name}
        className="pixelated absolute inset-[6%] w-[88%] h-[88%] object-contain"
        loading="lazy"
        draggable={false}
      />
      {showDetail && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface/95 via-surface/95 to-transparent flex flex-col items-center px-1 pt-2.5 pb-1.5">
          <span style={{ fontSize: 'clamp(7px, 14cqi, 10px)' }} className="text-foreground-muted leading-none font-mono tracking-tight">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          <span style={{ fontSize: 'clamp(8px, 15cqi, 12px)' }} className="font-medium leading-tight text-center truncate w-full text-foreground">
            {name}
          </span>
        </div>
      )}
    </div>
  );
}