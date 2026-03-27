'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatTime } from './game-utils';
import type { GenerationId } from '../data/pokemon';

interface CompletionDialogProps {
  open: boolean;
  elapsed: number;
  totalCount: number;
  availableGens: { id: GenerationId; label: string; startId: number; endId: number }[];
  onRestart: () => void;
  onAddGenerations: (additionalGens: Set<GenerationId>) => void;
  onDismiss: () => void;
}

export function CompletionDialog({ open, elapsed, totalCount, availableGens, onRestart, onAddGenerations, onDismiss }: CompletionDialogProps) {
  const canAddMore = availableGens.length > 0;
  const [selectedGens, setSelectedGens] = useState<Set<GenerationId>>(new Set());

  const toggleGen = (id: GenerationId) => {
    setSelectedGens(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    onAddGenerations(selectedGens);
    setSelectedGens(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDismiss()}>
      <DialogContent className="bg-surface-elevated border-border max-w-sm text-center">
        <DialogHeader>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <DialogTitle className="text-xl font-semibold tracking-tight">Complete!</DialogTitle>
          <DialogDescription className="text-foreground-muted">
            All {totalCount} Pokémon named
          </DialogDescription>
        </DialogHeader>
        <div className="my-6 p-4 rounded-xl bg-surface/50 border border-border-subtle">
          <p className="text-3xl font-mono font-semibold text-accent">{formatTime(elapsed)}</p>
        </div>
        
        {canAddMore && (
          <div className="mb-4">
            <p className="text-sm text-foreground-muted mb-3">
              Add more generations to continue?
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {availableGens.map(gen => (
                <Button
                  key={gen.id}
                  onClick={() => toggleGen(gen.id)}
                  variant={selectedGens.has(gen.id) ? 'default' : 'outline'}
                  className={`text-xs ${selectedGens.has(gen.id) ? 'bg-accent hover:bg-accent-light' : ''}`}
                >
                  {gen.label} ({gen.endId - gen.startId + 1})
                </Button>
              ))}
            </div>
            <Button
              onClick={handleConfirm}
              disabled={selectedGens.size === 0}
              className="mt-3 w-full bg-accent hover:bg-accent-light"
            >
              Add {selectedGens.size > 0 ? `${selectedGens.size} generation${selectedGens.size > 1 ? 's' : ''}` : 'generations'}
            </Button>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onDismiss}
            className="flex-1"
          >
            Dismiss
          </Button>
          <Button
            onClick={onRestart}
            className="flex-1 bg-accent hover:bg-accent-light"
          >
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}