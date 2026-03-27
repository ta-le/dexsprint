'use client';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface GameMenuProps {
  forceDetail: boolean;
  onToggleDetail: () => void;
  onRestartClick: () => void;
  onAboutClick: () => void;
  onClose: () => void;
}

export function GameMenu({ 
  forceDetail, 
  onToggleDetail, 
  onRestartClick, 
  onAboutClick,
  onClose 
}: GameMenuProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-start justify-end pt-16 pr-3 sm:pr-5 animate-fade-in"
         onClick={onClose}>
      <div className="bg-surface-elevated border border-border rounded-xl shadow-sm py-2 min-w-[200px] animate-scale-in"
           onClick={e => e.stopPropagation()}>
        <button
          onClick={onToggleDetail}
          className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between gap-3"
        >
          <span className="text-foreground-muted">Always show details</span>
          <Switch checked={forceDetail} onCheckedChange={onToggleDetail} className="data-checked:bg-accent data-unchecked:bg-foreground-dim" />
        </button>
        <div className="border-t border-border-subtle my-1" />
        <Button
          variant="ghost"
          onClick={onRestartClick}
          className="w-full justify-start text-foreground-muted hover:text-foreground px-4 py-3"
        >
          Restart
        </Button>
        <Button
          variant="ghost"
          onClick={onAboutClick}
          className="w-full justify-start text-foreground-muted hover:text-foreground px-4 py-3"
        >
          About
        </Button>
      </div>
    </div>
  );
}
