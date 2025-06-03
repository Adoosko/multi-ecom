// src/components/products/SizeSelectorTrigger.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Check, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SizeSelectorTriggerProps {
  selectedSize: string | null;
  currentStock: number | null | undefined;
  onClick: () => void;
  disabled?: boolean;
}

const SizeSelectorTrigger: React.FC<SizeSelectorTriggerProps> = ({
  selectedSize,
  currentStock,
  onClick,
  disabled = false,
}) => {

  // Komponent pre zobrazenie stavu skladu (zostáva rovnaký)
  const StockIndicator: React.FC = () => {
    if (!selectedSize || currentStock === null || currentStock === undefined) {
      return null;
    }
    if (currentStock > 5) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
          <Check size={14} /> Skladom {currentStock} ks
        </span>
      );
    } else if (currentStock > 0) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-orange-500 dark:text-yellow-400 whitespace-nowrap">
          <AlertTriangle size={14} /> Posledné kusy ({currentStock})
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-destructive dark:text-red-500 whitespace-nowrap">
          <XCircle size={14} /> Vypredané
        </span>
      );
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Veľkosť
      </h3>
      {/* === RESPONSIVE CONTAINER === */}
      {/* Použijeme `flex` a `items-center` pre zarovnanie na riadku */}
      {/* `gap-3` pre medzeru medzi tlačidlom a indikátorom */}
      <div className="flex flex-col  items-end gap-3">
        {/* Tlačidlo ako trigger */}
        <Button
          variant="outline"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            // `flex-1` zabezpečí, že tlačidlo zaberie väčšinu dostupného miesta
            // `min-w-0` je dôležité, aby sa tlačidlo mohlo zmenšiť, ak je málo miesta
            " min-w-0 justify-between items-center w-full lg:w-full px-4  h-11",
            "rounded-full",
            "border border-border",
            "text-base font-medium transition-colors duration-150 truncate", // Pridané truncate pre prípad veľmi dlhého textu
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            disabled
              ? "bg-muted/30 text-muted-foreground cursor-not-allowed opacity-60"
              : "bg-background "
          )}
          aria-haspopup="dialog"
          aria-expanded={false}
        >
          {/* Zobrazenie veľkosti - pridáme truncate, ak by bol text príliš dlhý */}
          <div className='bg-neutral-200 dark:bg-neutral-800 rounded-full w-full py-[6px]text-center'>

          <span className={cn("truncate", !selectedSize && "text-muted-foreground")}>
            {selectedSize || 'Vyberte veľkosť'}
          </span>
          </div>
          {/* Ikona šípky */}
          <ChevronRight className="h-10 w-10 text-muted-foreground ml-2 flex-shrink-0" />
        </Button>

        {/* Stav skladu */}
        {/* `flex-shrink-0` zabráni zmenšovaniu indikátora */}
        <div className="text-right items-end">
            {!disabled && <StockIndicator />}
        </div>
        {/* === END RESPONSIVE CONTAINER === */}
      </div>
    </div>
  );
};

export default SizeSelectorTrigger;
