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

// ─── Fuzzy matching ────────────────────────────────────────────────
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
    .replace(/♀/g, 'f')
    .replace(/♂/g, 'm')
    .replace(/[^a-z0-9\u3000-\u9fff\uac00-\ud7af\u3040-\u309f\u30a0-\u30ff]/g, '');
}

function fuzzyMatch(input: string, target: string, threshold = 0.1): boolean {
  const a = normalize(input);
  const b = normalize(target);
  if (a === b) return true;
  if (a.length === 0) return false;
  const maxDist = Math.max(1, Math.floor(b.length * threshold));
  return levenshtein(a, b) <= maxDist;
}

// ─── Storage ───────────────────────────────────────────────────────
const STORAGE_KEY = 'dexsprint_state';

interface GameState {
  language: LanguageCode;
  guessed: number[];
  startTime: number;
  elapsedBeforePause: number;
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

// ─── Time formatting ───────────────────────────────────────────────
function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── Zoom hook ─────────────────────────────────────────────────────
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

    // Re-registering matchMedia listener on each DPR change (desktop zoom)
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

// ─── Main Game Component ───────────────────────────────────────────
export default function Game() {
  // Initialize state from localStorage
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
  const inputRef = useRef<HTMLInputElement>(null);
  const zoom = useZoomLevel();

  const showDetail = zoom >= 1.8;

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setElapsed(elapsedBeforePause + (Date.now() - startTime));
    }, 200);
    return () => clearInterval(id);
  }, [phase, startTime, elapsedBeforePause]);

  // Save state on changes
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
    });
  }, [guessed, language, phase, startTime, elapsedBeforePause, elapsed]);

  const startGame = useCallback((lang: LanguageCode) => {
    setLanguage(lang);
    setGuessed(new Set());
    setStartTime(Date.now());
    setElapsedBeforePause(0);
    setElapsed(0);
    setPhase('playing');
    clearState();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

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

  const handleGuess = useCallback((value: string) => {
    setInput(value);
    if (value.trim().length < 2) return;

    for (const pokemon of POKEMON) {
      if (guessed.has(pokemon.id)) continue;
      const target = pokemon.names[language] || pokemon.names.en;
      if (fuzzyMatch(value.trim(), target)) {
        const newGuessed = new Set([...guessed, pokemon.id]);
        setGuessed(newGuessed);
        setInput('');
        setFlash(pokemon.id);
        setTimeout(() => setFlash(null), 1200);
        // Check for completion
        if (newGuessed.size === 151) {
          setElapsed(elapsedBeforePause + (Date.now() - startTime));
          setPhase('complete');
        }
        return;
      }
    }
  }, [guessed, language, elapsedBeforePause, startTime]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length < 2) return;

    // Check if there's a match
    for (const pokemon of POKEMON) {
      if (guessed.has(pokemon.id)) continue;
      const target = pokemon.names[language] || pokemon.names.en;
      if (fuzzyMatch(input.trim(), target)) {
        handleGuess(input);
        return;
      }
    }

    // No match - shake
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, [input, guessed, language, handleGuess]);

  // ─── Language Selection ────────────────────────────────────────
  if (phase === 'language') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] text-white p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight">
            <span className="text-red-400">Dex</span>
            <span className="text-white">Sprint</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Name all 151 Gen I Pokémon!
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => startGame(lang.code)}
              className="px-4 py-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700
                         text-base font-medium transition-all hover:scale-105 active:scale-95
                         hover:border-red-400/50"
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Completion Screen ─────────────────────────────────────────
  if (phase === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] text-white p-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">🎉</h1>
          <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
          <p className="text-zinc-400 mb-1">You named all 151 Pokémon!</p>
          <p className="text-2xl font-mono font-bold text-red-400 mb-6">{formatTime(elapsed)}</p>
          <button
            onClick={restartGame}
            className="px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 font-medium transition-all"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Playing ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-[#1a1a2e] text-white overflow-hidden select-none">
      {/* Header bar */}
      <header className="flex items-center justify-between px-2 sm:px-4 py-1.5 bg-[#16213e] border-b border-zinc-800 shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-sm sm:text-lg font-bold tracking-tight">
            <span className="text-red-400">Dex</span><span>Sprint</span>
          </h1>
          <span className="text-xs sm:text-sm font-mono bg-zinc-800 px-2 py-0.5 rounded">
            {guessed.size}<span className="text-zinc-500">/151</span>
          </span>
          <span className="text-xs sm:text-sm font-mono text-zinc-400">
            {formatTime(elapsed)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => handleGuess(e.target.value)}
              placeholder="Type a name…"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className={`w-32 sm:w-48 px-3 py-1 rounded bg-zinc-800 border text-sm
                         placeholder:text-zinc-600 focus:outline-none focus:border-red-400/50
                         transition-all ${shake ? 'animate-shake border-red-500' : 'border-zinc-700'}`}
            />
          </form>
          <button
            onClick={() => setShowMenu(m => !m)}
            className="p-1.5 rounded hover:bg-zinc-700 transition-colors"
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Menu overlay */}
      {showMenu && (
        <div className="absolute inset-0 z-30 flex items-start justify-end pt-12 pr-2 sm:pr-4"
             onClick={() => { setShowMenu(false); setShowRestart(false); }}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-1 min-w-[160px]"
               onClick={e => e.stopPropagation()}>
            <button
              onClick={() => { setShowRestart(true); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors"
            >
              🔄 Restart
            </button>
            <button
              onClick={() => { setShowMenu(false); setShowAbout(true); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors"
            >
              ℹ️ About
            </button>
          </div>
        </div>
      )}

      {/* Restart confirmation */}
      {showRestart && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60"
             onClick={() => { setShowRestart(false); setShowMenu(false); }}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-xs mx-4 text-center"
               onClick={e => e.stopPropagation()}>
            <p className="text-base font-medium mb-1">Restart Game?</p>
            <p className="text-sm text-zinc-400 mb-4">All progress will be lost.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setShowRestart(false); setShowMenu(false); }}
                className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={restartGame}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-medium transition-colors"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About dialog */}
      {showAbout && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60"
             onClick={() => setShowAbout(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm mx-4"
               onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">About DexSprint</h3>
            <p className="text-sm text-zinc-400 mb-3">
              A speed-naming challenge for the original 151 Pokémon. Zoom in to
              see detailed info for guessed Pokémon, or stay zoomed out for a
              compact sprite-only view.
            </p>
            <p className="text-sm text-zinc-400 mb-3">
              Sprites from Pokémon FireRed &amp; LeafGreen via PokeAPI.
              Pokémon names and data courtesy of PokeAPI and the Pokémon community.
            </p>
            <p className="text-xs text-zinc-500 mb-4">
              Pokémon is © Nintendo / Game Freak / Creatures Inc.
            </p>
            <button
              onClick={() => setShowAbout(false)}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Pokemon grid */}
      <PokemonGrid
        guessed={guessed}
        language={language}
        showDetail={showDetail}
        flash={flash}
      />
    </div>
  );
}

// ─── Grid Component ────────────────────────────────────────────────
function PokemonGrid({
  guessed,
  language,
  showDetail,
  flash,
}: {
  guessed: Set<number>;
  language: LanguageCode;
  showDetail: boolean;
  flash: number | null;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(15);

  useEffect(() => {
    function calc() {
      if (!gridRef.current) return;
      const parent = gridRef.current.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const aspect = w / h;
      // Solve: cols * rows >= 151, cols/rows ≈ aspect
      const c = Math.max(5, Math.round(Math.sqrt(151 * aspect)));
      setCols(c);
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const rows = Math.ceil(151 / cols);

  return (
    <div className="flex-1 overflow-hidden p-1">
      <div
        ref={gridRef}
        className="grid w-full h-full gap-px"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
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

// ─── Cell Component ────────────────────────────────────────────────
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
      <div className="rounded-sm bg-zinc-800/40 flex items-center justify-center">
        <span className="text-zinc-700 text-[8px] select-none">?</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-sm flex flex-col items-center justify-center overflow-hidden
                  transition-all duration-300 relative
                  ${isFlashing ? 'animate-reveal bg-yellow-500/20 ring-1 ring-yellow-400/40' : 'bg-zinc-800/60'}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getSpriteUrl(pokemon.id)}
        alt={name}
        className="pixelated w-3/4 max-w-[64px] max-h-[80%] aspect-square object-contain"
        loading="lazy"
        draggable={false}
      />
      {showDetail && (
        <div className="flex flex-col items-center gap-0 px-0.5 pb-0.5 w-full">
          <span className="text-[7px] text-zinc-500 leading-none">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          <span className="text-[8px] font-semibold leading-tight text-center truncate w-full">
            {name}
          </span>
          <div className="flex gap-0.5 mt-0.5">
            {pokemon.types.map(t => (
              <span
                key={t}
                className="text-[6px] px-1 py-px rounded-sm leading-none font-medium"
                style={{ backgroundColor: TYPE_COLORS[t] + '40', color: TYPE_COLORS[t] }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
