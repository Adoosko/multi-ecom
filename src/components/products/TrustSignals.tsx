// src/components/products/TrustSignals.tsx
"use client";

import React from "react";
// Príklady relevantných ikon
import { cn } from "@/lib/utils";

// Typ pre jeden signál dôvery
interface TrustSignalItem {
  icon: React.ElementType; // Komponent ikony (napr. ShieldCheck)
  text: string; // Text signálu
  id: string; // Unikátny kľúč
}

interface TrustSignalsProps {
  signals: TrustSignalItem[]; // Pole signálov na zobrazenie
  className?: string; // Pre dodatočné štýly kontajnera
}

const TrustSignals: React.FC<TrustSignalsProps> = ({ signals, className }) => {
  if (!signals || signals.length === 0) {
    return null; // Nezobrazuj nič, ak nie sú signály
  }

  return (
    // Hlavný kontajner sekcie
    <div className={cn("pt-6", className)}>
      {/* Voliteľný nadpis sekcie */}
      {/* <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Naše Garancie</h4> */}

      {/* Mriežka pre signály */}
      {/* Na malých obrazovkách 1 stĺpec, na väčších 3 stĺpce */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {signals.map((signal) => (
          // Karta pre jeden signál
          <div
            key={signal.id}
            className={cn(
              "flex items-center p-3 rounded-lg", // Základný layout a padding
              "bg-muted/40 dark:bg-secondary/50", // Jemné pozadie pre odlíšenie
              "border border-border" // Jemný border
            )}
          >
            {/* Ikona */}
            <signal.icon
              className="h-6 w-6 text-primary dark:text-green-400 mr-3 flex-shrink-0" // Výraznejšia ikona
              strokeWidth={1.5} // Trochu tenšia čiara ikony
            />
            {/* Text signálu */}
            <span className="text-xs font-medium text-muted-foreground">
              {signal.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSignals;
