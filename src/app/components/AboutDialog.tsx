'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AboutDialogProps {
  open: boolean;
  language: string;
  onClose: () => void;
}

export function AboutDialog({ open, language, onClose }: AboutDialogProps) {
  const currencyMap: Record<string, string> = {
    en: 'USD', fr: 'EUR', de: 'EUR', es: 'EUR', it: 'EUR', ja: 'JPY'
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-[#141416] border-[#27272a]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">About DexSprint</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm text-[#a1a1aa] leading-relaxed">
          A speed-naming challenge for the original 151 Pokémon. Zoom in to see detailed info for guessed Pokémon.
        </DialogDescription>
        <p className="text-xs text-[#52525b]">
          Sprites from Pokémon FireRed & LeafGreen.
        </p>
        <p className="text-xs text-[#52525b]">
          Pokémon is © Nintendo / Game Freak / Creatures Inc.
        </p>
        <div className="border-t border-[#1f1f22] pt-4">
          <p className="text-xs text-[#a1a1aa]">
            Developed by <span className="text-[#fafafa] font-medium">Tuan Anh Le</span>
          </p>
          <a
            href="mailto:ta.lepham16@gmail.com"
            className="text-xs text-[#ef4444] hover:text-[#f87171] transition-colors"
          >
            ta.lepham16@gmail.com
          </a>
        </div>
        <a
          href={`https://www.paypal.com/donate?business=ta.lepham16%40gmail.com&currency_code=${currencyMap[language] || 'USD'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white text-sm font-medium transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 4.643-5.813 4.643h-2.19a.5.5 0 0 0-.493.423l-1.12 7.106-.314 2.005h3.004c.46 0 .85-.334.921-.788l.038-.196.733-4.64.047-.257a.928.928 0 0 1 .921-.788h.58c3.76 0 6.7-1.528 7.557-5.946.357-1.84.172-3.378-.723-4.275z"/>
          </svg>
          Support Development
        </a>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
