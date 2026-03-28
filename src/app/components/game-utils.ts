import type { LanguageCode, GenerationId } from "../data/pokemon";

export function levenshtein(a: string, b: string): number {
  const m = a.length,
    n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[♀♂]/g, "")
    .replace(
      /[^a-z0-9\u3000-\u9fff\uac00-\ud7af\u3040-\u309f\u30a0-\u30ff]/g,
      "",
    );
}

export function fuzzyMatchDist(
  input: string,
  target: string,
  threshold = 0.1,
): number | null {
  const a = normalize(input);
  const b = normalize(target);
  if (a === b) return 0;
  if (a.length === 0) return null;
  const maxDist = Math.max(1, Math.floor(b.length * threshold));
  const dist = levenshtein(a, b);
  return dist <= maxDist ? dist : null;
}

export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export interface GameState {
  language: LanguageCode;
  generations: GenerationId[];
  guessed: number[];
  startTime: number;
  elapsedBeforePause: number;
  forceDetail?: boolean;
}

const STORAGE_KEY = "dexsprint_state";

export function loadState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota exceeded */
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
