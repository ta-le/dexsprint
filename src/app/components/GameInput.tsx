'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GameInputProps {
  isMobile: boolean;
  onSubmit: (value: string) => boolean;
  shake: boolean;
}

export function GameInput({ isMobile, onSubmit, shake }: GameInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isMobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().length < 2) return;
    const success = onSubmit(value);
    if (success) {
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg flex gap-2">
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={isMobile ? "Enter a name…" : "Enter a Pokémon name…"}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className={shake 
            ? 'border-accent animate-shake placeholder:text-foreground-muted h-11' 
            : 'border-border focus:border-accent focus:ring-0 focus:outline-none placeholder:text-foreground-muted h-11'
          }
        />
        {value && !isMobile && (
          <button
            type="button"
            onClick={() => setValue('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      <Button
        type="submit"
        className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-light text-sm font-medium text-foreground transition-all shrink-0 h-11"
      >
        Guess
      </Button>
    </form>
  );
}
