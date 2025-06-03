// src/components/ui/quantity-selector.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button'; // ShadCN/ui Button
import { Minus, Plus } from 'lucide-react'; // Ikony
import { cn } from '@/lib/utils'; // Utility pre triedy

interface QuantitySelectorProps {
  quantity: number; // Aktuálne množstvo
  minQuantity?: number; // Minimálne povolené množstvo (zvyčajne 1)
  maxQuantity: number; // Maximálne povolené množstvo (skladom)
  onChange: (newQuantity: number) => void; // Callback na zmenu množstva
  disabled?: boolean; // Ak je celý selector deaktivovaný (napr. nie je vybraný variant)
  className?: string; // Pre dodatočné štýly
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  minQuantity = 1, // Defaultne minimum je 1
  maxQuantity,
  onChange,
  disabled = false, // Defaultne nie je disabled
  className,
}) => {
  // Handler pre zníženie množstva
  const handleDecrement = () => {
    const newQuantity = Math.max(minQuantity, quantity - 1); // Zníž, ale nie pod minimum
    onChange(newQuantity);
  };

  // Handler pre zvýšenie množstva
  const handleIncrement = () => {
    // Zvýš, ale nie nad maximum (ak je maximum definované a > 0)
    const newQuantity = maxQuantity > 0 ? Math.min(maxQuantity, quantity + 1) : quantity + 1;
    onChange(newQuantity);
  };

  // Handler pre zmenu hodnoty priamo v inpute
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Ak je vstup prázdny, dočasne to akceptujeme (užívateľ môže písať)
    if (value === '') {
      // Môžeme dočasne nastaviť na minQuantity alebo počkať na onBlur
      // Pre jednoduchosť zatiaľ nič nerobíme, validácia prebehne v onBlur alebo pri +/-
      return;
    }

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      // Validácia hodnoty medzi min a max
      const validatedQuantity = Math.max(minQuantity, maxQuantity > 0 ? Math.min(numValue, maxQuantity) : numValue);
      onChange(validatedQuantity);
    }
  };

  // Handler pre validáciu po opustení inputu
   const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;
      let numValue = parseInt(value, 10);

      // Ak je vstup prázdny alebo neplatný, vráť na minimum
      if (isNaN(numValue) || value === '') {
          numValue = minQuantity;
      }

       // Finálna validácia rozsahu
      const validatedQuantity = Math.max(minQuantity, maxQuantity > 0 ? Math.min(numValue, maxQuantity) : numValue);

      // Ak sa hodnota líši od aktuálnej, zavolaj onChange
      if (validatedQuantity !== quantity) {
          onChange(validatedQuantity);
      } else if (value === '') {
          // Ak bol input vymazaný a aktuálne quantity je už minimum, aj tak "resetni" zobrazenie
          onChange(minQuantity);
      }
   };


  // Podmienky pre deaktiváciu tlačidiel
  const canDecrement = quantity > minQuantity;
  const canIncrement = maxQuantity <= 0 || quantity < maxQuantity; // Povolí increment, ak maxQuantity je 0 alebo neobmedzené

  return (
    // Kontajner pre integrovaný vzhľad
    <div
      className={cn(
        "flex items-center h-12  ", // Zaoblený border okolo celého prvku
        " rounded-full", // Výška a pozadie
        " ", // Focus štýl na kontajneri
        disabled ? "opacity-50 cursor-not-allowed" : "", // Štýl pre celý disabled selector
        className // Možnosť pridať externé triedy
      )}
    >
      {/* Tlačidlo Mínus */}
      <button
        
        onClick={handleDecrement}
        // Deaktivuj, ak je disabled celý selector alebo ak nie je možné znížiť
        disabled={disabled || !canDecrement}
        className="h-full border-l border-t border-b border-border/50  px-2 rounded-l-full text-muted-foreground hover:text-foreground focus-visible:z-10 disabled:opacity-40" // Zaoblenie, farby, focus z-index
        aria-label="Znížiť množstvo"
      >
        <Minus size={16} />
      </button>

      {/* Input pre zobrazenie a priamy vstup */}
      <input
        type="number" // Použijeme number, ale skryjeme šípky
        min={minQuantity}
        max={maxQuantity > 0 ? maxQuantity : undefined} // Max atribút len ak je > 0
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur} // Validácia pri opustení
        disabled={disabled} // Deaktivácia inputu
        className={cn(
          "w-full lg:w-18 h-full text-center bg-transparent", // Centrovaný text, transparentné pozadie
          "font-medium text-foreground", // Farba textu
          "border border-border/50", // Vertikálne oddeľovače
          "focus:outline-none focus:ring-0", // Odstránenie default focus štýlov inputu
          "appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", // Skrytie šípok
          "disabled:cursor-not-allowed" // Kurzor pre disabled
        )}
        aria-label="Množstvo"
      />

      {/* Tlačidlo Plus */}
      <button
        
     
        onClick={handleIncrement}
        // Deaktivuj, ak je disabled celý selector alebo ak nie je možné zvýšiť
        disabled={disabled || !canIncrement}
        className="h-full border-r border-t border-b border-border/50  px-2 rounded-r-full text-muted-foreground hover:text-foreground focus-visible:z-10 disabled:opacity-40" // Zaoblenie, farby, focus z-index
        aria-label="Zvýšiť množstvo"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;
