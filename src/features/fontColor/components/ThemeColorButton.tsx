import React, { useRef, useEffect, useState } from 'react';
import { translateColor } from '../utils/utils'; // Import utility
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Príklad tooltipu zo ShadCN

interface ThemeColorButtonProps {
  label: string;
  variable: string; // CSS premenná, napr. '--primary'
  onColorChange: (color: string, cssVariableColor: string) => void;
}

export const ThemeColorButton: React.FC<ThemeColorButtonProps> = ({ label, variable, onColorChange }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [resolvedColor, setResolvedColor] = useState<string | null>(null);

  useEffect(() => {
    // Získame vypočítanú hodnotu CSS premennej na klientovi
    if (buttonRef.current) {
      const computedColor = getComputedStyle(buttonRef.current).getPropertyValue(variable.trim()); // .trim() pre istotu
      if (computedColor) {
        setResolvedColor(computedColor);
      }
    }
  }, [variable]); // Závislosť na premennej

  const handleClick = () => {
    if (resolvedColor) {
      const displayColor = translateColor(resolvedColor, 'HEX'); // Získame HEX pre zobrazenie/interný stav
      // Vytvoríme reťazec pre aplikáciu štýlu pomocou OKLCH (alebo HSL ako fallback)
      // Predpokladáme, že tvoje premenné sú definované ako OKLCH
      const cssApplyValue = `oklch(var(${variable}))`;
      // const cssApplyValueHSL = `hsl(var(${variable}))`; // Alternatíva, ak OKLCH nefunguje spoľahlivo

      if (displayColor) {
        onColorChange(displayColor, cssApplyValue); // Posielame HEX a CSS premennú
      }
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
           <button
              ref={buttonRef}
              onClick={handleClick}
              className="w-8 h-8 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
              style={{
                  // Nastavíme pozadie tlačidla na reálnu farbu premennej
                  backgroundColor: resolvedColor ?? 'transparent',
              }}
              aria-label={`Set color to ${label}`}
            />
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-gray-900 text-white border-gray-700">
          <p>{label}</p>
          {resolvedColor && <p className="text-xs text-gray-400">{resolvedColor}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};