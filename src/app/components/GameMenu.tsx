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
      <div className="bg-[#141416] border border-[#27272a] rounded-2xl shadow-2xl py-2 min-w-[200px] animate-scale-in"
           onClick={e => e.stopPropagation()}>
        <button
          onClick={onToggleDetail}
          className="w-full text-left px-4 py-3 text-sm hover:bg-[#1c1c1f] transition-colors flex items-center justify-between gap-3"
        >
          <span className="text-[#a1a1aa]">Always show details</span>
          <Switch checked={forceDetail} onCheckedChange={onToggleDetail} className="data-checked:bg-[#ef4444] data-unchecked:bg-[#3f3f46]" />
        </button>
        <div className="border-t border-[#1f1f22] my-1" />
        <Button
          variant="ghost"
          onClick={onRestartClick}
          className="w-full justify-start text-[#a1a1aa] hover:text-[#fafafa] px-4 py-3"
        >
          Restart
        </Button>
        <Button
          variant="ghost"
          onClick={onAboutClick}
          className="w-full justify-start text-[#a1a1aa] hover:text-[#fafafa] px-4 py-3"
        >
          About
        </Button>
      </div>
    </div>
  );
}
