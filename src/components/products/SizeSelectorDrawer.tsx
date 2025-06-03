// src/components/products/SizeSelectorDrawer.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Ruler, X, XCircle } from "lucide-react"; // Pridané ikony pre stavy
import React, { useEffect, useState } from "react";

// Typ pre veľkosť
interface AvailableSize {
  size: string;
  stock: number;
  id?: string | null;
}

interface SizeSelectorDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableSizes: AvailableSize[];
  selectedSize: string | null; // Aktuálne vybraná z parenta
  onConfirm: (selectedSize: string | null) => void;
}

const SizeSelectorDrawer: React.FC<SizeSelectorDrawerProps> = ({
  isOpen,
  onOpenChange,
  availableSizes,
  selectedSize,
  onConfirm,
}) => {
  const [tempSelectedSize, setTempSelectedSize] = useState<string | null>(
    selectedSize
  );

  // Synchronizuj interný stav, keď sa drawer otvorí alebo zmení externý výber
  useEffect(() => {
    if (isOpen) {
      setTempSelectedSize(selectedSize);
    }
  }, [isOpen, selectedSize]);

  const handleSizeClick = (size: string) => {
    setTempSelectedSize(size);
  };

  const handleConfirmClick = () => {
    onConfirm(tempSelectedSize); // Potvrdí aktuálny dočasný výber
    onOpenChange(false); // Zatvorí drawer
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-sm", // Responzívna šírka
          "bg-background text-foreground border-l border-border", // Základné farby
          "flex flex-col p-0" // Plná výška, odstránený padding
        )}
      >
        {/* === Hlavička === */}
        <SheetHeader className="px-4 sm:px-6 py-4 border-b border-border flex flex-row justify-between items-center">
          <SheetTitle className="text-lg font-semibold text-foreground">
            Vyberte veľkosť
          </SheetTitle>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full -mr-2"
            >
              {" "}
              {/* Menšie close tlačidlo */}
              <X className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Zatvoriť</span>
            </Button>
          </SheetClose>
        </SheetHeader>

        {/* === Obsah s Veľkosťami === */}
        <ScrollArea className="flex-grow px-4 sm:px-6 py-5">
          {" "}
          {/* Vertikálny padding */}
          {/* Mriežka veľkostí */}
          <div className="grid grid-cols-3 xs:grid-cols-4 gap-2 sm:gap-3">
            {availableSizes.map(({ size, stock }) => {
              const isSelected = tempSelectedSize === size;
              const isAvailable = stock > 0;

              return (
                <Button
                  key={size}
                  variant="outline" // Základný variant
                  onClick={() => handleSizeClick(size)}
                  disabled={!isAvailable}
                  className={cn(
                    `relative h-12 sm:h-14 px-1 py-2 flex flex-col justify-center items-center`, // Layout tlačidla
                    `border text-base font-semibold transition-colors duration-150 ease-in-out`, // Základný text a border
                    `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md`, // Focus
                    // --- Štýly podľa stavu ---
                    !isAvailable
                      ? "border-border bg-muted/40 text-muted-foreground/60 cursor-not-allowed" // Nedostupné
                      : isSelected
                        ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-offset-1 ring-offset-background ring-primary" // Vybrané
                        : "border-border bg-background text-foreground hover:bg-accent hover:border-accent-foreground/50" // Dostupné
                  )}
                  aria-pressed={isSelected} // Pre prístupnosť
                >
                  {/* Hlavný text - Veľkosť */}
                  <span>{size}</span>
                  {/* Indikátor skladu (voliteľné, jemný text pod veľkosťou) */}
                  {isAvailable &&
                    stock <= 5 && ( // Zobraz len pri nízkom sklade
                      <span className="absolute bottom-0.5 text-[10px] font-normal text-orange-500 dark:text-yellow-500">
                        {stock} ks
                      </span>
                    )}
                  {/* Overlay pre nedostupné */}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 dark:bg-black/50 backdrop-blur-sm rounded-md">
                      <XCircle
                        className="w-5 h-5 text-muted-foreground/70"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  {/* Zvýraznenie pre vybrané (voliteľný Check) */}
                  {/* {isSelected && isAvailable && (
                                         <Check className="absolute top-1 right-1 h-4 w-4 text-primary-foreground/80" strokeWidth={3}/>
                                     )} */}
                </Button>
              );
            })}
            {/* Správa, ak nie sú žiadne veľkosti */}
            {availableSizes.length === 0 && (
              <p className="text-sm text-muted-foreground italic col-span-full py-4 text-center">
                {" "}
                {/* col-span-full pre zabratie šírky */}
                Pre vybranú farbu nie sú dostupné veľkosti.
              </p>
            )}
          </div>
        </ScrollArea>

        {/* === Odkaz na Veľkostnú Tabuľku === */}
        <div className="px-4 sm:px-6 py-4 border-t border-border">
          <Button
            variant="secondary" // Použijeme sekundárny variant
            className="w-full h-11 text-sm justify-start px-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground" // Zarovnanie doľava
            onClick={() => alert("TODO: Zobraziť veľkostnú tabuľku")}
          >
            <Ruler size={18} className="mr-2.5 text-muted-foreground" />{" "}
            {/* Ikona s odsadením */}
            Veľkostná tabuľka
          </Button>
        </div>

        {/* === Pätička === */}
        <SheetFooter className="px-4 sm:px-6 py-4 border-t border-border bg-muted/30 dark:bg-card/50 flex flex-row sm:justify-between items-center gap-2 mt-auto">
          {/* Indikátor výberu */}
          <div className="text-sm text-muted-foreground flex-shrink-0 hidden xs:block">
            {" "}
            {/* Skryjeme na veľmi malých */}
            Výber:{" "}
            <span className="font-semibold text-foreground">
              {tempSelectedSize || "-"}
            </span>
          </div>
          {/* Akčné tlačidlá */}
          <div className="flex gap-2 flex-grow justify-end">
            <SheetClose asChild>
              {/* Použijeme menší variant pre "Zatvoriť" */}
              <Button variant="outline" size="lg" className="h-11 px-5">
                Zatvoriť
              </Button>
            </SheetClose>
            <Button
              size="lg" // Väčšie tlačidlo
              onClick={handleConfirmClick}
              disabled={
                !tempSelectedSize ||
                (availableSizes.find((s) => s.size === tempSelectedSize)
                  ?.stock ?? 0) <= 0 ||
                availableSizes.length === 0
              }
              className="h-11 px-5 bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-red-600 dark:hover:bg-red-700 dark:text-white disabled:bg-muted disabled:text-muted-foreground"
            >
              Prevziať
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SizeSelectorDrawer;
