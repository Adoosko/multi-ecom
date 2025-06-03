// src/components/products/ColorSelectorTrigger.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorSelectorTriggerProps {
  selectedColor: string | null;
  selectedColorCode?: string | null; // HEX alebo CSS farba pre vizuálny swatch
  onClick: () => void;
  disabled?: boolean;
}

const ColorSelectorTrigger: React.FC<ColorSelectorTriggerProps> = ({
  selectedColor,
  selectedColorCode,
  onClick,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Farba
      </h3>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "min-w-0 w-full lg:w-full justify-between items-center px-4 py-[2px] h-11",
            "rounded-full border border-border text-base font-medium truncate transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            disabled
              ? "bg-muted/30 text-muted-foreground cursor-not-allowed opacity-60"
              : "bg-background"
          )}
          aria-haspopup="dialog"
          aria-expanded={false}
        >
          <div className="flex items-center gap-2   rounded-full w-full px-4 py-2">
            {/* Swatch (ak máš farbu) */}
            {selectedColorCode && (
              <span
                className="inline-block w-5 h-5 rounded-full border border-border mr-2"
                style={{ backgroundColor: selectedColorCode }}
                aria-label={selectedColor || "Vyberte farbu"}
              />
            )}
            <span className={cn("truncate", !selectedColor && "text-muted-foreground")}>
              {selectedColor || "Vyberte farbu"}
            </span>
          </div>
          <ChevronRight className="h-10 w-10 text-muted-foreground ml-2 flex-shrink-0" />
        </Button>
      </div>
    </div>
  );
};

export default ColorSelectorTrigger;
