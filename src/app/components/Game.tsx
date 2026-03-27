'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  POKEMON,
  type LanguageCode,
  type Pokemon,
} from '../data/pokemon';
import { LanguageSelection } from './LanguageSelection';
import { CompletionScreen } from './CompletionScreen';
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
    if (saved && saved.guessed.length > 0) {
      return saved.guessed.length >= 151 ? 'complete' : 'playing';
    }
    return 'language';
  });
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return loadState()?.language ?? 'en';
  });
  const [guessed, setGuessed] = useState<Set<number>>(() => {
    const saved = loadState();
    return saved ? new Set(saved.guessed) : new Set();
  });
  const [startTime, setStartTime] = useState(() => {
    const saved = loadState();
    return saved && saved.guessed.length > 0 && saved.guessed.length < 151 ? Date.now() : 0;
  });
  const [elapsedBeforePause, setElapsedBeforePause] = useState(() => {
    return loadState()?.elapsedBeforePause ?? 0;
  });
  const [elapsed, setElapsed] = useState(() => {
    const saved = loadState();
    return saved && saved.guessed.length >= 151 ? saved.elapsedBeforePause : 0;
  });
  const [flash, setFlash] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [forceDetail, setForceDetail] = useState<boolean>(() => loadState()?.forceDetail ?? false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerH, setHeaderH] = useState(0);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });
  const [mobileH, setMobileH] = useState(0);
  const zoom = useZoomLevel();

  const showDetail = zoom >= 1.8 || forceDetail;

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
      guessed: Array.from(guessed),
      startTime: Date.now(),
      elapsedBeforePause: currentElapsed,
      forceDetail,
    });
  }, [guessed, language, phase, startTime, elapsedBeforePause, elapsed, forceDetail]);

  const startGame = useCallback((lang: LanguageCode) => {
    setLanguage(lang);
    setGuessed(new Set());
    setStartTime(Date.now());
    setElapsedBeforePause(0);
    setElapsed(0);
    setPhase('playing');
    clearState();
  }, []);

  const restartGame = useCallback(() => {
    clearState();
    setGuessed(new Set());
    setStartTime(0);
    setElapsedBeforePause(0);
    setElapsed(0);
    setPhase('language');
  }, []);

  const handleInputSubmit = useCallback((input: string): boolean => {
    if (input.trim().length < 2) return false;

    const matches: { pokemon: Pokemon; dist: number }[] = [];
    for (const pokemon of POKEMON) {
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
      if (newGuessed.size === 151) {
        setElapsed(elapsedBeforePause + (Date.now() - startTime));
        setPhase('complete');
      }
      return true;
    }

    for (const pokemon of POKEMON) {
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
  }, [guessed, language, elapsedBeforePause, startTime]);

  const [showMenu, setShowMenu] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  if (phase === 'language') {
    return <LanguageSelection onSelect={startGame} />;
  }

  if (phase === 'complete') {
    return <CompletionScreen elapsed={elapsed} onRestart={restartGame} />;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-background text-foreground select-none overflow-hidden"
      style={isMobile && mobileH ? { height: mobileH } : { bottom: 0 }}
    >
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-20 bg-surface-elevated/80 backdrop-blur-sm border-b border-border-subtle">
        <GameHeader
          guessedCount={guessed.size}
          elapsed={elapsed}
          language={language}
          onMenuClick={() => setShowMenu(m => !m)}
        />

        {!isMobile && (
          <div className="flex justify-center px-5 py-3.5 border-t border-border-subtle bg-surface/30">
            <GameInput
              isMobile={isMobile}
              onSubmit={handleInputSubmit}
              shake={shake}
            />
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
        onConfirm={restartGame}
        onCancel={() => setShowRestart(false)}
      />

      <AboutDialog
        open={showAbout}
        language={language}
        onClose={() => setShowAbout(false)}
      />

      <div className="p-1" style={{ marginTop: headerH, height: `calc(100% - ${headerH}px)` }}>
        <PokemonGrid
          guessed={guessed}
          language={language}
          showDetail={showDetail}
          flash={flash}
          isMobile={isMobile}
        />
      </div>

      {isMobile && (
        <div
          className="absolute bottom-0 left-0 right-0 z-20 bg-surface-elevated/80 backdrop-blur-sm border-t border-border-subtle"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex justify-center px-3 py-3">
            <GameInput
              isMobile={isMobile}
              onSubmit={handleInputSubmit}
              shake={shake}
            />
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
