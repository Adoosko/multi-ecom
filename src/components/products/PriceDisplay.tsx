// src/components/products/PriceDisplay.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Switch } from "@/components/ui/switch"; // ShadCN/ui Switch
import { Label } from "@/components/ui/label"; // ShadCN/ui Label pre prístupnosť switchu
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  priceWithVat: number | null | undefined; // Predajná cena vrátane DPH
  originalPriceWithVat?: number | null | undefined; // Pôvodná cena vrátane DPH (pre zľavu)
  vatRate?: number; // Sadzba DPH (napr. 0.23 pre 23%)
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  priceWithVat,
  originalPriceWithVat,
  vatRate = 0.23, // Predvolená sadzba 23%
  className,
}) => {
  // Stav určujúci, či sa má primárne zobraziť cena S DPH
  const [showWithVat, setShowWithVat] = useState(true); // Predvolene zobrazujeme S DPH

  // Memoizované výpočty cien
  const prices = useMemo(() => {
    if (typeof priceWithVat !== 'number') {
      return { main: null, secondary: null, original: null };
    }

    const calculatedPriceWithoutVat = priceWithVat / (1 + vatRate);
    const calculatedOriginalPriceWithoutVat = (typeof originalPriceWithVat === 'number')
      ? originalPriceWithVat / (1 + vatRate)
      : null;

    const format = (price: number | null): string | null => {
      if (price === null) return null;
      return price.toLocaleString('sk-SK', { style: 'currency', currency: 'EUR' });
    };

    return {
      withVat: priceWithVat,
      withoutVat: calculatedPriceWithoutVat,
      originalWithVat: originalPriceWithVat,
      originalWithoutVat: calculatedOriginalPriceWithoutVat,
      formattedWithVat: format(priceWithVat),
      formattedWithoutVat: format(calculatedPriceWithoutVat),
      formattedOriginalWithVat: format(originalPriceWithVat),
      formattedOriginalWithoutVat: format(calculatedOriginalPriceWithoutVat),
    };
  }, [priceWithVat, originalPriceWithVat, vatRate]);

  // Určenie, ktorá cena a popis sa zobrazia ako primárne a sekundárne
  const mainPriceValue = showWithVat ? prices.formattedWithVat : prices.formattedWithoutVat;
  const secondaryPriceValue = showWithVat ? prices.formattedWithoutVat : prices.formattedWithVat;
  const secondaryPriceLabel = showWithVat ;

  // Určenie, ktorá pôvodná cena sa zobrazí (ak existuje zľava)
  const showOriginalPrice =
      (showWithVat && prices.formattedOriginalWithVat && prices.originalWithVat && prices.originalWithVat > prices.withVat) ||
      (!showWithVat && prices.formattedOriginalWithoutVat && prices.originalWithoutVat && prices.originalWithoutVat > prices.withoutVat);

  const originalPriceValue = showWithVat ? prices.formattedOriginalWithVat : prices.formattedOriginalWithoutVat;

  // Ak cena nebola poskytnutá, nezobrazuj nič
  if (mainPriceValue === null) {
    return null;
  }

  return (
    <div className={cn("w-[70%] flex gap-12 lg:gap-0 md:flex-row justify-between", className)}>
      {/* Hlavná cena a prípadná pôvodná cena */}
      <div className="flex items-baseline space-x-3">
        <p className="text-3xl lg:text-4xl font-bold text-foreground">
          {mainPriceValue}
        </p>
        {/* Zobrazenie prečiarknutej pôvodnej ceny */}
        {showOriginalPrice && (
          <p className="text-xl line-through text-muted-foreground">
            {originalPriceValue}
          </p>
        )}
      </div>

      {/* Sekundárna cena a prepínač */}
      <div className="flex items-center justify-start space-x-2">
       
       
        {/* Prepínač DPH */}
        <div className="flex items-center justify-center  space-x-1.5 pt-2">
            <Switch
              id="vat-toggle"
              checked={showWithVat}
              onCheckedChange={setShowWithVat} // Priamo meníme stav
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted scale-150 flex" // Menší switch, farby podľa módu
             
            />
            {/* Label pre switch (vizuálne skrytý, ale dôležitý pre prístupnosť) */}
            <Label htmlFor="vat-toggle" className="pl-2">
                {showWithVat ? 's' : 'bez'} DPH
            </Label>
        </div>
         {/* Zobrazenie sekundárnej ceny */}
        {secondaryPriceValue && (
          <span className="text-sm text-muted-foreground">
            {secondaryPriceLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;
