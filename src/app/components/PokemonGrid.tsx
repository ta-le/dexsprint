"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  POKEMON,
  getGeneration,
  type Pokemon,
  type LanguageCode,
  type GenerationId,
} from "../data/pokemon";

const GIF_PLAY_DURATION_MS = 1200;

interface PokemonGridProps {
  guessed: Set<number>;
  language: LanguageCode;
  showDetail: boolean;
  flash: number | null;
  isMobile: boolean;
  generations: Set<GenerationId>;
  soundEnabled: boolean;
}

export function PokemonGrid({
  guessed,
  language,
  showDetail,
  flash,
  isMobile,
  generations,
  soundEnabled,
}: PokemonGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(15);
  const [cellSize, setCellSize] = useState(44);
  const [playingIds, setPlayingIds] = useState<Set<number>>(new Set());
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const playCountRef = useRef<Map<number, number>>(new Map());
  const [playCounts, setPlayCounts] = useState<Map<number, number>>(new Map());
  const criesRef = useRef<HTMLAudioElement[]>([]);

  const startPlaying = useCallback((id: number) => {
    const prev = playCountRef.current.get(id) ?? 0;
    const next = prev + 1;
    playCountRef.current.set(id, next);
    setPlayCounts(new Map(playCountRef.current));
    setPlayingIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const existing = timersRef.current.get(id);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      setPlayingIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      timersRef.current.delete(id);
    }, GIF_PLAY_DURATION_MS);
    timersRef.current.set(id, timer);
  }, []);

  const playCry = useCallback((id: number) => {
    const audio = new Audio(`/cries/old/${id}.ogg`);
    audio.volume = 0.4;
    criesRef.current.push(audio);
    const cleanup = () => {
      const idx = criesRef.current.indexOf(audio);
      if (idx !== -1) criesRef.current.splice(idx, 1);
    };
    audio.addEventListener("ended", cleanup);
    audio.addEventListener("error", cleanup);
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    const cries = criesRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
      cries.forEach((a) => a.pause());
      cries.length = 0;
    };
  }, []);

  useEffect(() => {
    if (flash !== null) {
      startPlaying(flash);
      if (soundEnabled) playCry(flash);
    }
  }, [flash, startPlaying, playCry, soundEnabled]);

  const activePokemon = useMemo(() => {
    return POKEMON.filter((p) => {
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
      if (w === 0 || h === 0) return;
      if (isMobile) {
        const minCellSize = 64;
        const c = Math.max(5, Math.floor(w / minCellSize));
        setCols(c);
        setCellSize(w / c);
      } else {
        const maxCellSize = 128;
        const itemCount = activePokemon.length;
        const gaps = 1;
        let bestSize = 0;
        let bestCols = Math.max(5, Math.floor(w / 96));
        for (let c = 5; c <= itemCount; c++) {
          const r = Math.ceil(itemCount / c);
          const size = Math.min(
            (w - (c - 1) * gaps) / c,
            (h - (r - 1) * gaps) / r,
          );
          if (size > bestSize) {
            bestSize = size;
            bestCols = c;
          }
        }
        setCols(bestCols);
        setCellSize(Math.min(bestSize, maxCellSize));
      }
    }
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(containerRef.current!);
    return () => ro.disconnect();
  }, [isMobile, activePokemon.length]);

  useEffect(() => {
    if (flash === null) return;
    const el = containerRef.current?.querySelector<HTMLElement>(
      `[data-pokemon-id="${flash}"]`,
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [flash]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isMobile) return;
    const ro = new ResizeObserver(() => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (el.scrollTop > maxScroll) {
        el.scrollTop = maxScroll;
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${isMobile ? "overflow-y-auto" : "overflow-hidden flex items-center justify-center"}`}
      style={{ overscrollBehavior: "none", touchAction: "auto" }}
    >
      <div
        className="grid"
        style={
          isMobile
            ? {
                width: "100%",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridAutoRows: `${cellSize}px`,
                gap: "1px",
                paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
              }
            : {
                gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                gridAutoRows: `${cellSize}px`,
                gap: "1px",
              }
        }
      >
        {activePokemon.map((pokemon, idx) => (
          <div
            key={pokemon.id}
            style={
              generationBreaks.includes(idx)
                ? { borderLeft: "2px solid var(--accent)", marginLeft: "-1px" }
                : undefined
            }
            className="min-h-0"
          >
            <PokemonCell
              pokemon={pokemon}
              revealed={guessed.has(pokemon.id)}
              language={language}
              showDetail={showDetail}
              isFlashing={flash === pokemon.id}
              playing={playingIds.has(pokemon.id)}
              playCount={playCounts.get(pokemon.id) ?? 0}
              onReplay={() => {
                startPlaying(pokemon.id);
                if (soundEnabled) playCry(pokemon.id);
              }}
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
  playing: boolean;
  playCount: number;
  onReplay: () => void;
}

export function PokemonCell({
  pokemon,
  revealed,
  language,
  showDetail,
  isFlashing,
  playing,
  playCount,
  onReplay,
}: PokemonCellProps) {
  const name = pokemon.names[language] || pokemon.names.en;
  const spriteId = pokemon.id === 201 ? "201-t" : String(pokemon.id);
  const gifSrc = `/sprites/animated/${spriteId}.gif`;
  const blobRef = useRef<Blob | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(gifSrc)
      .then((r) => r.blob())
      .then((b) => {
        blobRef.current = b;
      });
  }, [gifSrc]);

  useEffect(() => {
    if (playCount > 0 && blobRef.current) {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      const url = URL.createObjectURL(blobRef.current);
      blobUrlRef.current = url;
      setGifUrl(url);
    }
  }, [playCount]);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  return (
    <div
      data-pokemon-id={pokemon.id}
      onClick={playing ? undefined : onReplay}
      style={{ containerType: "inline-size", aspectRatio: "1" }}
      className={`relative transition-all duration-200
        ${
          isFlashing
            ? "animate-reveal -m-px p-px bg-linear-to-br from-amber-500/20 to-amber-400/10"
            : revealed
              ? "bg-surface hover:bg-surface-hover"
              : "bg-surface"
        }
        ${!revealed ? "pointer-events-none" : playing ? "cursor-default" : "cursor-pointer"}`}
    >
      <div className="absolute inset-[8%]">
        {/* Number text - fades out when revealed */}
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-200 ${revealed ? "opacity-0" : "opacity-100"}`}
        >
          <span className="text-foreground-muted text-[10px] select-none font-sans drop-shadow-sm">
            {String(pokemon.id).padStart(3, "0")}
          </span>
        </div>

        {/* Static image - always mounted, hidden when GIF showing */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${revealed && !playing ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={`/sprites/${spriteId}.png`}
            alt={name}
            fill
            unoptimized
            loading="eager"
            className="pixelated object-contain"
            draggable={false}
            sizes="(max-width: 767px) 64px, 96px"
          />
        </div>

        {/* Animated GIF - always mounted, hidden when not playing */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${playing ? "opacity-100" : "opacity-0"}`}
        >
          {gifUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`gif-${playCount}`}
              src={gifUrl}
              alt={name}
              loading="eager"
              className="absolute inset-0 w-full h-full pixelated object-contain"
              draggable={false}
              style={{ transform: "scale(1.5)" }}
            />
          )}
        </div>
      </div>

      {showDetail && (
        <>
          <span
            style={{ fontSize: "clamp(7px, 13cqi, 10px)" }}
            className={`absolute top-1 left-1 text-foreground-muted font-sans drop-shadow-sm transition-opacity duration-200 ${revealed ? "opacity-100" : "opacity-0"}`}
          >
            {String(pokemon.id).padStart(3, "0")}
          </span>
          <div
            className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-surface/85 to-transparent flex flex-col items-center px-0.5 pt-2 pb-1 transition-opacity duration-200 ${revealed ? "opacity-100" : "opacity-0"}`}
          >
            <span
              style={{ fontSize: "clamp(8px, 15cqi, 11px)" }}
              className="font-sans font-semibold leading-tight text-center truncate w-full text-foreground drop-shadow-sm"
            >
              {name}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
