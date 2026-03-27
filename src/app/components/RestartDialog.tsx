'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RestartDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RestartDialog({ open, onConfirm, onCancel }: RestartDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="bg-surface-elevated border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Restart Game?</DialogTitle>
          <DialogDescription>
            All progress will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Restart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
