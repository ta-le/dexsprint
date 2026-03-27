'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatTime } from './game-utils';

interface CompletionDialogProps {
  open: boolean;
  elapsed: number;
  onRestart: () => void;
  onDismiss: () => void;
}

export function CompletionDialog({ open, elapsed, onRestart, onDismiss }: CompletionDialogProps) {
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
            All 151 Pokémon named
          </DialogDescription>
        </DialogHeader>
        <div className="my-6 p-4 rounded-xl bg-surface/50 border border-border-subtle">
          <p className="text-3xl font-mono font-semibold text-accent">{formatTime(elapsed)}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onDismiss}
            className="flex-1"
          >
            View Grid
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
