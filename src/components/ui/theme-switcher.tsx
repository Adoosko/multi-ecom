// src/components/ui/theme-switcher.tsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button"; // Predpokladáme použitie ShadCN/ui Button
import { Sun, Moon } from "lucide-react"; // Import ikon

export function ThemeSwitcher() {
  // Hook z next-themes na získanie aktuálnej témy a funkcie na jej zmenu
  const { theme, setTheme } = useTheme();
  // Stav na sledovanie, či komponent už bol pripojený na klientovi
  const [mounted, setMounted] = React.useState(false);

  // Efekt, ktorý sa spustí len na klientovi po pripojení
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Kým komponent nie je pripojený, nerenderujeme tlačidlo (prevencia hydration mismatch)
  // Namiesto toho môžeme zobraziť placeholder alebo nič
  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden="true"></div>; // Placeholder rovnakej veľkosti
    // Alebo: return null;
  }

  // Funkcia na prepnutie témy
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost" // Priehľadné tlačidlo
      size="icon"     // Ikonové tlačidlo
      onClick={toggleTheme}
      aria-label="Toggle theme" // Pre prístupnosť
      className="rounded-full" // Voliteľné: Okrúhle tlačidlo
    >
      {/* Zobrazíme ikonu podľa aktuálnej témy */}
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 rotate-90 scale-100 dark:rotate-0" /> // Pridaná animácia pre ikonu mesiaca
      )}
      <span className="sr-only">Prepnúť tému</span> {/* Text pre čítačky obrazovky */}
    </Button>
  );
}
