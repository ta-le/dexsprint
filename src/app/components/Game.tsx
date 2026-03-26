'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  POKEMON,
  LANGUAGES,
  getSpriteUrl,
  TYPE_COLORS,
  type LanguageCode,
  type Pokemon,
} from '../data/pokemon';

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[♀♂]/g, '')
    .replace(/[^a-z0-9\u3000-\u9fff\uac00-\ud7af\u3040-\u309f\u30a0-\u30ff]/g, '');
}

function fuzzyMatchDist(input: string, target: string, threshold = 0.1): number | null {
  const a = normalize(input);
  const b = normalize(target);
  if (a === b) return 0;
  if (a.length === 0) return null;
  const maxDist = Math.max(1, Math.floor(b.length * threshold));
  const dist = levenshtein(a, b);
  return dist <= maxDist ? dist : null;
}

const STORAGE_KEY = 'dexsprint_state';

interface GameState {
  language: LanguageCode;
  guessed: number[];
  startTime: number;
  elapsedBeforePause: number;
  forceDetail?: boolean;
}

function loadState(): GameState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded */ }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* noop */ }
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

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
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [forceDetail, setForceDetail] = useState<boolean>(() => loadState()?.forceDetail ?? false);
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerH, setHeaderH] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileH, setMobileH] = useState(0);
  const zoom = useZoomLevel();

  const showDetail = zoom >= 1.8 || forceDetail;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const vv = window.visualViewport;
    if (!vv) { setMobileH(window.innerHeight); return; }
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
    if (!isMobile) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isMobile]);

  const restartGame = useCallback(() => {
    clearState();
    setGuessed(new Set());
    setStartTime(0);
    setElapsedBeforePause(0);
    setElapsed(0);
    setInput('');
    setShowMenu(false);
    setShowRestart(false);
    setPhase('language');
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length < 2) return;

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
      setInput('');
      setFlash(chosen.id);
      setTimeout(() => setFlash(null), 1200);
      if (newGuessed.size === 151) {
        setElapsed(elapsedBeforePause + (Date.now() - startTime));
        setPhase('complete');
      }
      return;
    }

    for (const pokemon of POKEMON) {
      if (!guessed.has(pokemon.id)) continue;
      const target = pokemon.names[language] || pokemon.names.en;
      if (fuzzyMatchDist(input.trim(), target) !== null) {
        const name = pokemon.names[language] || pokemon.names.en;
        setToast(`Already found: ${name}!`);
        setTimeout(() => setToast(null), 2500);
        setInput('');
        return;
      }
    }
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, [input, guessed, language, elapsedBeforePause, startTime]);

  // Language Selection Screen
  if (phase === 'language') {
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
            <button
              key={lang.code}
              onClick={() => startGame(lang.code)}
              className="group relative px-5 py-4 rounded-2xl bg-[#141416] border border-[#27272a] 
                         text-sm font-medium transition-all duration-300 ease-out
                         hover:bg-[#1c1c1f] hover:border-[#ef4444]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ef4444]/5
                         active:translate-y-0 active:scale-[0.98]"
              style={{ animationDelay: `${150 + i * 60}ms` }}
            >
              <span className="relative z-10">{lang.label}</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ef4444]/0 via-[#ef4444]/5 to-[#ef4444]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>
        
        <p className="relative text-[#52525b] text-xs mt-12 animate-fade-in tracking-wide" style={{ animationDelay: '600ms' }}>
          Select a language to begin
        </p>
      </div>
    );
  }

  // Completion Screen
  if (phase === 'complete') {
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
          <button
            onClick={restartGame}
            className="group relative px-8 py-3.5 rounded-xl bg-[#ef4444] hover:bg-[#f87171] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ef4444]/20 active:translate-y-0"
          >
            Play Again
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    );
  }

  // Playing Phase
  return (
    <div
      className="fixed top-0 left-0 right-0 bg-[#0c0c0e] text-[#fafafa] select-none overflow-hidden"
      style={isMobile && mobileH ? { height: mobileH } : { bottom: 0 }}
    >
      {/* Header */}
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-20 bg-[#141416]/95 backdrop-blur-md border-b border-[#1f1f22]">
        <header className="flex items-center justify-between px-3 sm:px-5 py-3">
          <div className="flex items-center gap-3 sm:gap-5">
            <h1 className="text-sm sm:text-base font-bold tracking-tight">
              <span className="text-[#ef4444]">Dex</span>Sprint
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative px-3 py-1.5 rounded-lg bg-[#1c1c1f] border border-[#27272a]">
                <span className="font-mono text-sm">
                  <span className="text-[#ef4444] font-semibold">{guessed.size}</span>
                  <span className="text-[#52525b]">/151</span>
                </span>
              </div>
              <span className="font-mono text-sm text-[#a1a1aa] tabular-nums">
                {formatTime(elapsed)}
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-wider text-[#52525b] bg-[#1c1c1f] px-2 py-1 rounded-md border border-[#27272a]">
                {language}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowMenu(m => !m)}
            className="p-2 rounded-lg hover:bg-[#1c1c1f] transition-colors text-[#a1a1aa] hover:text-[#fafafa]"
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </header>

        {/* Desktop Input */}
        {!isMobile && (
          <div className="flex justify-center px-4 py-3 border-t border-[#1f1f22]">
            <form onSubmit={handleSubmit} className="w-full max-w-md flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Enter a Pokémon name…"
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className={`w-full px-4 py-3 rounded-xl bg-[#1c1c1f] border text-sm transition-all duration-200
                             placeholder:text-[#52525b]
                             ${shake 
                               ? 'border-[#ef4444] animate-shake' 
                               : 'border-[#27272a] hover:border-[#3f3f46] focus:border-[#ef4444]/50 focus:ring-2 focus:ring-[#ef4444]/10 focus:outline-none'
                             }`}
                />
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="group relative px-6 py-3 rounded-xl bg-[#ef4444] hover:bg-[#f87171] text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ef4444]/20 active:translate-y-0 shrink-0"
              >
                Guess
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Menu Overlay */}
      {showMenu && (
        <div className="absolute inset-0 z-30 flex items-start justify-end pt-16 pr-3 sm:pr-5 animate-fade-in"
             onClick={() => { setShowMenu(false); setShowRestart(false); }}>
          <div className="bg-[#141416] border border-[#27272a] rounded-2xl shadow-2xl py-2 min-w-[200px] animate-scale-in"
               onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setForceDetail(v => !v)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-[#1c1c1f] transition-colors flex items-center justify-between"
            >
              <span className="text-[#a1a1aa]">Always show details</span>
              <span className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${forceDetail ? 'bg-[#ef4444]' : 'bg-[#3f3f46]'}`}>
                <span className={`w-4 h-4 rounded-full bg-white transition-transform ${forceDetail ? 'translate-x-5' : 'translate-x-0'}`} />
              </span>
            </button>
            <div className="border-t border-[#1f1f22] my-1" />
            <button
              onClick={() => { setShowRestart(true); }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-[#1c1c1f] transition-colors text-[#a1a1aa] hover:text-[#fafafa]"
            >
              Restart
            </button>
            <button
              onClick={() => { setShowMenu(false); setShowAbout(true); }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-[#1c1c1f] transition-colors text-[#a1a1aa] hover:text-[#fafafa]"
            >
              About
            </button>
          </div>
        </div>
      )}

      {/* Restart Confirmation */}
      {showRestart && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
             onClick={() => { setShowRestart(false); setShowMenu(false); }}>
          <div className="bg-[#141416] border border-[#27272a] rounded-2xl p-6 max-w-xs mx-4 text-center animate-scale-in shadow-2xl"
               onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#ef4444]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#ef4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </div>
            <p className="text-base font-semibold mb-2">Restart Game?</p>
            <p className="text-sm text-[#a1a1aa] mb-5">All progress will be lost.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setShowRestart(false); setShowMenu(false); }}
                className="px-5 py-2.5 rounded-xl bg-[#1c1c1f] hover:bg-[#242428] text-sm transition-colors border border-[#27272a]"
              >
                Cancel
              </button>
              <button
                onClick={restartGame}
                className="px-5 py-2.5 rounded-xl bg-[#ef4444] hover:bg-[#f87171] text-sm font-semibold transition-colors"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Dialog */}
      {showAbout && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
             onClick={() => setShowAbout(false)}>
          <div className="bg-[#141416] border border-[#27272a] rounded-2xl p-6 max-w-sm mx-4 animate-scale-in shadow-2xl"
               onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3">About DexSprint</h3>
            <p className="text-sm text-[#a1a1aa] mb-3 leading-relaxed">
              A speed-naming challenge for the original 151 Pokémon. Zoom in to see detailed info for guessed Pokémon.
            </p>
            <p className="text-xs text-[#52525b] mb-4">
              Sprites from Pokémon FireRed & LeafGreen via PokeAPI.
            </p>
            <p className="text-xs text-[#52525b] mb-4">
              Pokémon is © Nintendo / Game Freak / Creatures Inc.
            </p>
            <div className="border-t border-[#1f1f22] pt-4 mb-4">
              <p className="text-xs text-[#a1a1aa]">
                Developed by <span className="text-[#fafafa] font-medium">Tuan Anh Le</span>
              </p>
              <a
                href="mailto:ta.lepham16@gmail.com"
                className="text-xs text-[#ef4444] hover:text-[#f87171] transition-colors"
                onClick={e => e.stopPropagation()}
              >
                ta.lepham16@gmail.com
              </a>
            </div>
            <a
              href={`https://www.paypal.com/donate?business=ta.lepham16%40gmail.com&currency_code=${{ en: 'USD', fr: 'EUR', de: 'EUR', es: 'EUR', it: 'EUR', ja: 'JPY' }[language]}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white text-sm font-medium transition-colors mb-3"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 4.643-5.813 4.643h-2.19a.5.5 0 0 0-.493.423l-1.12 7.106-.314 2.005h3.004c.46 0 .85-.334.921-.788l.038-.196.733-4.64.047-.257a.928.928 0 0 1 .921-.788h.58c3.76 0 6.7-1.528 7.557-5.946.357-1.84.172-3.378-.723-4.275z"/>
              </svg>
              Support Development
            </a>
            <button
              onClick={() => setShowAbout(false)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1c1f] hover:bg-[#242428] text-sm transition-colors border border-[#27272a]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Pokemon Grid */}
      <div className="p-1" style={{ marginTop: headerH, height: `calc(100% - ${headerH}px)` }}>
        <PokemonGrid
          guessed={guessed}
          language={language}
          showDetail={showDetail}
          flash={flash}
          isMobile={isMobile}
        />
      </div>

      {/* Mobile Bottom Input */}
      {isMobile && (
        <div
          className="absolute bottom-0 left-0 right-0 z-20 bg-[#141416]/95 backdrop-blur-md border-t border-[#1f1f22]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex justify-center px-3 py-3">
            <form onSubmit={handleSubmit} className="w-full flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Enter a name…"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#1c1c1f] border text-sm transition-all duration-200
                             placeholder:text-[#52525b]
                             ${shake 
                               ? 'border-[#ef4444] animate-shake' 
                               : 'border-[#27272a] focus:border-[#ef4444]/50 focus:ring-2 focus:ring-[#ef4444]/10 focus:outline-none'
                             }`}
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#ef4444] hover:bg-[#f87171] text-sm font-semibold transition-all shrink-0"
              >
                Guess
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl bg-[#141416]/95 backdrop-blur-sm border border-[#27272a] text-sm text-[#fafafa] whitespace-nowrap shadow-xl animate-slide-up">
          {toast}
        </div>
      )}
    </div>
  );
}

function PokemonGrid({
  guessed,
  language,
  showDetail,
  flash,
  isMobile,
}: {
  guessed: Set<number>;
  language: LanguageCode;
  showDetail: boolean;
  flash: number | null;
  isMobile: boolean;
}) {
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

const PokemonCell = ({
  pokemon,
  revealed,
  language,
  showDetail,
  isFlashing,
}: {
  pokemon: Pokemon;
  revealed: boolean;
  language: LanguageCode;
  showDetail: boolean;
  isFlashing: boolean;
}) => {
  const name = pokemon.names[language] || pokemon.names.en;

  if (!revealed) {
    return (
      <div className="bg-[#141416] flex items-center justify-center overflow-hidden min-h-0">
        <span className="text-[#27272a] text-[11px] select-none font-mono">?</span>
      </div>
    );
  }

  return (
    <div
      data-pokemon-id={pokemon.id}
      style={{ containerType: 'inline-size' }}
      className={`relative min-h-0 transition-all duration-300 ${isFlashing ? 'animate-reveal -m-px p-px bg-gradient-to-br from-[#ef4444]/30 to-[#ef4444]/10 shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'bg-[#141416]'}`}
    >
      <img
        src={getSpriteUrl(pokemon.id)}
        alt={name}
        className="pixelated absolute inset-[6%] w-[88%] h-[88%] object-contain"
        loading="lazy"
        draggable={false}
      />
      {showDetail && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/80 to-transparent flex flex-col items-center px-0.5 pt-4 pb-1.5">
          <span style={{ fontSize: 'clamp(5px, 12cqi, 9px)' }} className="text-[#52525b] leading-none font-mono">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          <span style={{ fontSize: 'clamp(6px, 14cqi, 11px)' }} className="font-medium leading-tight text-center truncate w-full text-[#fafafa]">
            {name}
          </span>
        </div>
      )}
    </div>
  );
};
