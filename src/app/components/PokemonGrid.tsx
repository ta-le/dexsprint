'use client';

import { useState, useEffect, useRef } from 'react';
import { POKEMON, getSpriteUrl, type Pokemon, type LanguageCode } from '../data/pokemon';

interface PokemonGridProps {
  guessed: Set<number>;
  language: LanguageCode;
  showDetail: boolean;
  flash: number | null;
  isMobile: boolean;
}

export function PokemonGrid({ guessed, language, showDetail, flash, isMobile }: PokemonGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(15);
  const [cellSize, setCellSize] = useState(44);

  useEffect(() => {
    function calc() {
      const el = containerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w === 0) return;
      if (isMobile) {
        const c = Math.max(5, Math.round(w / 44));
        setCols(c);
        setCellSize(w / c);
      } else {
        if (h === 0) return;
        setCols(Math.max(5, Math.round(Math.sqrt(151 * (w / h)))));
      }
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || flash === null) return;
    const el = containerRef.current?.querySelector<HTMLElement>(`[data-pokemon-id="${flash}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [flash, isMobile]);

  const rows = Math.ceil(151 / cols);

  return (
    <div ref={containerRef} className={`w-full h-full ${isMobile ? 'overflow-y-auto' : 'overflow-hidden'}`}>
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
              height: 'calc(100% - 8px)',
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: '1px',
            }
        }
      >
        {POKEMON.map(pokemon => (
          <PokemonCell
            key={pokemon.id}
            pokemon={pokemon}
            revealed={guessed.has(pokemon.id)}
            language={language}
            showDetail={showDetail}
            isFlashing={flash === pokemon.id}
          />
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
      <div className="bg-surface flex items-center justify-center overflow-hidden min-h-0">
        <span className="text-foreground-dim text-[11px] select-none font-mono">?</span>
      </div>
    );
  }

  return (
    <div
      data-pokemon-id={pokemon.id}
      style={{ containerType: 'inline-size' }}
      className={`relative min-h-0 transition-all duration-200 
        ${isFlashing 
          ? 'animate-reveal -m-px p-px bg-gradient-to-br from-accent/15 to-accent/5' 
          : 'bg-surface hover:bg-surface-hover'
        }`}
    >
      <img
        src={getSpriteUrl(pokemon.id)}
        alt={name}
        className="pixelated absolute inset-[6%] w-[88%] h-[88%] object-contain"
        loading="lazy"
        draggable={false}
      />
      {showDetail && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface/95 via-surface/95 to-transparent flex flex-col items-center px-1 pt-2.5 pb-1.5">
          <span style={{ fontSize: 'clamp(8px, 15cqi, 11px)' }} className="text-foreground-subtle leading-none font-mono tracking-tight">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          <span style={{ fontSize: 'clamp(9px, 16cqi, 13px)' }} className="font-medium leading-tight text-center truncate w-full text-foreground">
            {name}
          </span>
        </div>
      )}
    </div>
  );
}
