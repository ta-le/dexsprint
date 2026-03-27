'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  POKEMON,
  GENERATIONS,
  getGeneration,
  type LanguageCode,
  type GenerationId,
  type Pokemon,
} from '../data/pokemon';
import { LanguageSelection } from './LanguageSelection';
import { CompletionDialog } from './CompletionDialog';
import { GameHeader } from './GameHeader';
import { GameInput } from './GameInput';
import { GameMenu } from './GameMenu';
import { RestartDialog } from './RestartDialog';
import { AboutDialog } from './AboutDialog';
import { PokemonGrid } from './PokemonGrid';
import { fuzzyMatchDist, loadState, saveState, clearState } from './game-utils';

function useZoomLevel() {
  const baseDPR = useRef(typeof window !== 'undefined' ? window.devicePixelRatio : 1);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    function update() {
      const dprZoom = window.devicePixelRatio / baseDPR.current;
      const vpZoom = window.visualViewport?.scale ?? 1;
      setZoom(dprZoom * vpZoom);
    }
    update();

    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);

    let mql: MediaQueryList | null = null;
    function listenDPR() {
      mql?.removeEventListener('change', onDPRChange);
      mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      mql.addEventListener('change', onDPRChange);
    }
    function onDPRChange() {
      update();
      listenDPR();
    }
    listenDPR();

    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
      mql?.removeEventListener('change', onDPRChange);
    };
  }, []);

  return zoom;
}

export default function Game() {
  const [phase, setPhase] = useState<'language' | 'playing' | 'complete'>(() => {
    const saved = loadState();
    if (saved && saved.guessed.length > 0 && saved.generations.length > 0) {
      const savedTotal = saved.generations.reduce((sum, genId) => {
        const gen = GENERATIONS.find(g => g.id === genId);
        return sum + (gen ? gen.endId - gen.startId + 1 : 0);
      }, 0);
      if (saved.guessed.length >= savedTotal) return 'complete';
      if (saved.startTime > 0) return 'playing';
    }
    return 'language';
  });
  const [language, setLanguage] = useState<LanguageCode>(() => loadState()?.language ?? 'en');
  const [generations, setGenerations] = useState<Set<GenerationId>>(() => {
    const saved = loadState();
    return saved?.generations ? new Set(saved.generations) : new Set([1]);
  });
  const [guessed, setGuessed] = useState<Set<number>>(() => {
    const saved = loadState();
    return saved ? new Set(saved.guessed) : new Set();
  });
  const [startTime, setStartTime] = useState(() => {
    const saved = loadState();
    return saved && saved.startTime > 0 ? saved.startTime : 0;
  });
  const [elapsedBeforePause, setElapsedBeforePause] = useState(() => loadState()?.elapsedBeforePause ?? 0);
  const [elapsed, setElapsed] = useState(() => {
    const saved = loadState();
    const savedTotal = saved?.generations?.reduce((sum, genId) => {
      const gen = GENERATIONS.find(g => g.id === genId);
      return sum + (gen ? gen.endId - gen.startId + 1 : 0);
    }, 0) ?? 151;
    return saved && saved.guessed.length >= savedTotal ? saved.elapsedBeforePause : 0;
  });
  const [flash, setFlash] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [forceDetail, setForceDetail] = useState(() => loadState()?.forceDetail ?? false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(phase === 'complete');
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerH, setHeaderH] = useState(0);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });
  const [mobileH, setMobileH] = useState(0);

  const activePokemon = useMemo(() => {
    return POKEMON.filter(p => {
      const gen = getGeneration(p.id);
      return generations.has(gen);
    });
  }, [generations]);

  const totalPokemon = activePokemon.length;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const vv = window.visualViewport;
    if (!vv) {
      setTimeout(() => setMobileH(window.innerHeight), 0);
      return;
    }
    const update = () => setMobileH(vv.height);
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => { vv.removeEventListener('resize', update); vv.removeEventListener('scroll', update); };
  }, [isMobile]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    setHeaderH(el.offsetHeight);
    const ro = new ResizeObserver(() => setHeaderH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setElapsed(elapsedBeforePause + (Date.now() - startTime));
    }, 200);
    return () => clearInterval(id);
  }, [phase, startTime, elapsedBeforePause]);

  useEffect(() => {
    if (phase === 'language') return;
    const currentElapsed = phase === 'playing'
      ? elapsedBeforePause + (Date.now() - startTime)
      : elapsed;
    saveState({
      language,
      generations: Array.from(generations),
      guessed: Array.from(guessed),
      startTime,
      elapsedBeforePause: currentElapsed,
      forceDetail,
    });
  }, [guessed, language, phase, startTime, elapsedBeforePause, elapsed, forceDetail, generations]);

  const startGame = useCallback((lang: LanguageCode, gens: Set<GenerationId>) => {
    setLanguage(lang);
    setGenerations(gens);
    setGuessed(new Set());
    setStartTime(Date.now());
    setElapsedBeforePause(0);
    setElapsed(0);
    setPhase('playing');
    setShowCompletionDialog(false);
    clearState();
  }, []);

  const addGenerations = useCallback((additionalGens: Set<GenerationId>) => {
    const newGens = new Set(generations);
    let added = false;
    for (const gen of additionalGens) {
      if (!newGens.has(gen)) {
        newGens.add(gen);
        added = true;
      }
    }
    if (added) {
      setGenerations(newGens);
      setPhase('playing');
      setShowCompletionDialog(false);
    }
  }, [generations]);

  const restartGame = useCallback((newGens?: Set<GenerationId>) => {
    clearState();
    setGuessed(new Set());
    setStartTime(0);
    setElapsedBeforePause(0);
    setElapsed(0);
    setShowRestart(false);
    setShowMenu(false);
    if (newGens) {
      setGenerations(newGens);
      setPhase('playing');
      setShowCompletionDialog(false);
    } else {
      setPhase('language');
      setShowCompletionDialog(false);
    }
  }, []);

  const handleInputSubmit = useCallback((input: string): boolean => {
    if (input.trim().length < 2) return false;

    const matches: { pokemon: Pokemon; dist: number }[] = [];
    for (const pokemon of activePokemon) {
      if (guessed.has(pokemon.id)) continue;
      const target = pokemon.names[language] || pokemon.names.en;
      const dist = fuzzyMatchDist(input.trim(), target);
      if (dist !== null) matches.push({ pokemon, dist });
    }

    let chosen: Pokemon | null = null;
    if (matches.length === 1) {
      chosen = matches[0].pokemon;
    } else if (matches.length > 1) {
      const exact = matches.filter(m => m.dist === 0);
      if (exact.length === 1) {
        chosen = exact[0].pokemon;
      } else if (exact.length > 1) {
        chosen = exact[0].pokemon;
      }
    }

    if (chosen) {
      const newGuessed = new Set([...guessed, chosen.id]);
      setGuessed(newGuessed);
      setFlash(chosen.id);
      setTimeout(() => setFlash(null), 1200);
      if (newGuessed.size === totalPokemon) {
        setElapsed(elapsedBeforePause + (Date.now() - startTime));
        setPhase('complete');
        setShowCompletionDialog(true);
      }
      return true;
    }

    for (const pokemon of activePokemon) {
      if (!guessed.has(pokemon.id)) continue;
      const target = pokemon.names[language] || pokemon.names.en;
      if (fuzzyMatchDist(input.trim(), target) !== null) {
        const name = pokemon.names[language] || pokemon.names.en;
        setToast(`Already found: ${name}!`);
        setTimeout(() => setToast(null), 2500);
        return true;
      }
    }
    setShake(true);
    setTimeout(() => setShake(false), 500);
    return false;
  }, [guessed, language, activePokemon, totalPokemon, elapsedBeforePause, startTime]);

  const [showMenu, setShowMenu] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  if (phase === 'language') {
    return <LanguageSelection onSelect={startGame} initialGenerations={generations} />;
  }

  const availableGens = GENERATIONS.filter(g => !generations.has(g.id));

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-background text-foreground select-none overflow-hidden"
      style={isMobile && mobileH ? { height: mobileH } : { bottom: 0 }}
    >
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-20 bg-surface-elevated/80 backdrop-blur-sm border-b border-border-subtle">
        <GameHeader
          guessedCount={guessed.size}
          totalCount={totalPokemon}
          elapsed={elapsed}
          language={language}
          onMenuClick={() => setShowMenu(m => !m)}
        />

        {!isMobile && (
          <div className="flex justify-center px-5 py-3.5 border-t border-border-subtle bg-surface/30">
            {phase === 'complete' ? (
              <Button
                onClick={() => setShowRestart(true)}
                className="px-8 py-2.5 rounded-lg bg-accent hover:bg-accent-light font-medium transition-all"
              >
                Play Again
              </Button>
            ) : (
              <GameInput
                isMobile={isMobile}
                onSubmit={handleInputSubmit}
                shake={shake}
              />
            )}
          </div>
        )}
      </div>

      {showMenu && (
        <GameMenu
          forceDetail={forceDetail}
          onToggleDetail={() => setForceDetail(v => !v)}
          onRestartClick={() => setShowRestart(true)}
          onAboutClick={() => { setShowMenu(false); setShowAbout(true); }}
          onClose={() => { setShowMenu(false); setShowRestart(false); }}
        />
      )}

      <RestartDialog
        open={showRestart}
        onConfirm={() => restartGame()}
        onCancel={() => setShowRestart(false)}
      />

      <AboutDialog
        open={showAbout}
        language={language}
        onClose={() => setShowAbout(false)}
      />

      <CompletionDialog
        open={showCompletionDialog && phase === 'complete'}
        elapsed={elapsed}
        totalCount={totalPokemon}
        availableGens={availableGens}
        onRestart={() => restartGame()}
        onAddGenerations={addGenerations}
        onDismiss={() => setShowCompletionDialog(false)}
      />

      <div className="p-1" style={{ marginTop: headerH, height: `calc(100% - ${headerH}px)` }}>
        <PokemonGrid
          guessed={guessed}
          language={language}
          showDetail={forceDetail}
          flash={flash}
          isMobile={isMobile}
          generations={generations}
        />
      </div>

      {isMobile && (
        <div
          className="absolute bottom-0 left-0 right-0 z-20 bg-surface-elevated/80 backdrop-blur-sm border-t border-border-subtle"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex justify-center px-3 py-3">
            {phase === 'complete' ? (
              <Button
                onClick={() => setShowRestart(true)}
                className="w-full px-8 py-2.5 rounded-lg bg-accent hover:bg-accent-light font-medium transition-all"
              >
                Play Again
              </Button>
            ) : (
              <GameInput
                isMobile={isMobile}
                onSubmit={handleInputSubmit}
                shake={shake}
              />
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg bg-surface-elevated/95 backdrop-blur-sm border border-border-subtle text-sm text-foreground whitespace-nowrap shadow-sm animate-slide-up">
          {toast}
        </div>
      )}
    </div>
  );
}