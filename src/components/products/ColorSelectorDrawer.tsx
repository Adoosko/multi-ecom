"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Palette, XCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvailableColor {
  color: string;
  colorCode?: string | null;
  id?: string | null;
  sizes?: { stock: number }[];
  stock?: number;
}

interface ColorSelectorDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableColors: AvailableColor[];
  selectedColor: string | null;
  onConfirm: (selectedColor: string | null) => void;
}

const ColorSelectorDrawer: React.FC<ColorSelectorDrawerProps> = ({
  isOpen,
  onOpenChange,
  availableColors,
  selectedColor,
  onConfirm,
}) => {
  const [tempSelectedColor, setTempSelectedColor] = useState<string | null>(selectedColor);

  useEffect(() => {
    if (isOpen) setTempSelectedColor(selectedColor);
  }, [isOpen, selectedColor]);

  const handleColorClick = (color: string) => setTempSelectedColor(color);

  const handleConfirmClick = () => {
    onConfirm(tempSelectedColor);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-sm bg-background/80 dark:bg-background/80 text-foreground border-l border-border flex flex-col p-0 backdrop-blur-xl"
        )}
      >
        {/* === Hlavička === */}
        <SheetHeader className="px-4 sm:px-6 py-4 border-b border-border flex flex-row justify-between items-center">
          <SheetTitle className="text-lg font-bold tracking-tight text-foreground">
            Vyberte farbu
          </SheetTitle>
         
        </SheetHeader>

        {/* === Obsah s farbami === */}
        <ScrollArea className="flex-grow px-3 py-8">
          <div className="grid grid-cols-5 p-2 gap-4">
            {availableColors.map((variant) => {
              const isAvailable =
                (variant.sizes && variant.sizes.some((s) => s.stock > 0)) ||
                (typeof variant.stock === "number" && variant.stock > 0);
              const isSelected = tempSelectedColor === variant.color;
              const colorSwatch = variant.colorCode || variant.color || "#eee";

              return (
                <button
                  key={variant.id || variant.color}
                  type="button"
                  onClick={() => handleColorClick(variant.color)}
                  disabled={!isAvailable}
                  aria-pressed={isSelected}
                  tabIndex={isAvailable ? 0 : -1}
                  className={cn(
                    "relative group p-0 h-12 w-12 rounded-full flex items-center justify-center border-none outline-none transition-all duration-200",
                    "before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-300",
                    isAvailable
                      ? "hover:scale-110 active:scale-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      : "opacity-40 cursor-not-allowed"
                  )}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(0,0,0,0.10) 100%)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {/* Swatch */}
                  <span
                    className={cn(
                      "block w-12 h-12 rounded-full border-2 transition-all duration-200 shadow-md",
                      isSelected
                        ? "border-primary shadow-[0_0_0_5px_rgba(220,38,38,0.18)] scale-110"
                        : "border-border group-hover:shadow-[0_0_0_2px_rgba(0,0,0,0.05)]"
                    )}
                    style={{
                      background: colorSwatch,
                      boxShadow: isSelected
                        ? "0 4px 24px 0 rgba(220,38,38,0.10)"
                        : "0 2px 8px 0 rgba(0,0,0,0.05)",
                      transition: "box-shadow .2s, border-color .2s, transform .2s",
                    }}
                  />

                  {/* Micro-interaction ring */}
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-full border-2 border-transparent transition-all duration-200",
                      isSelected
                        ? "border-primary/80 animate-pulse"
                        : "group-hover:border-accent"
                    )}
                  />

                  {/* Overlay pre vybraný stav */}
                  {isSelected && isAvailable && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Check className="w-7 h-7 text-white drop-shadow-lg animate-fade-in" strokeWidth={3} />
                    </span>
                  )}

                  {/* Overlay pre nedostupný stav */}
                  {!isAvailable && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <XCircle className="w-8 h-8 text-muted-foreground/80" strokeWidth={1.5} />
                    </span>
                  )}
                </button>
              );
            })}
            {availableColors.length === 0 && (
              <p className="text-sm text-muted-foreground italic col-span-full py-4 text-center">
                Nie sú dostupné žiadne farby.
              </p>
            )}
          </div>
        </ScrollArea>

        {/* === Odkaz na paletu farieb alebo info === */}
        <div className="px-4 sm:px-6 py-4 border-t border-border">
          <Button
            variant="secondary"
            className="w-full h-11 text-sm justify-start px-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            onClick={() => alert("TODO: Zobraziť vzorkovník farieb")}
          >
            <Palette size={18} className="mr-2.5 text-muted-foreground" />
            Vzorkovník farieb
          </Button>
        </div>

        {/* === Pätička === */}
        <SheetFooter className="px-4 sm:px-6 py-4 border-t border-border bg-muted/30 dark:bg-card/50 flex flex-row sm:justify-between items-center gap-2 mt-auto">
          <div className="flex gap-2 flex-grow justify-end">
            <SheetClose asChild>
              <Button variant="outline" size="lg" className="h-11 px-5">
                Zatvoriť
              </Button>
            </SheetClose>
            <Button
              size="lg"
              onClick={handleConfirmClick}
              disabled={
                !tempSelectedColor ||
                !availableColors.find((c) => c.color === tempSelectedColor)
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

export default ColorSelectorDrawer;
