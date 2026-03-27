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
      <DialogContent className="bg-[#141416] border-[#27272a]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Restart Game?</DialogTitle>
          <DialogDescription className="text-[#a1a1aa]">
            All progress will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="default" className="bg-[#ef4444] hover:bg-[#f87171]" onClick={onConfirm}>Restart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
