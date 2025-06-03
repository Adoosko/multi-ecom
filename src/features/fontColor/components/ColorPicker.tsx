// src/features/fontColor/components/ColorPicker.tsx
"use client";

import React, { useState } from 'react';

// Import komponentov pre Tabs (nahraď cestami k tvojim komponentom)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeColorsView } from './ThemeColorView';
import { ColorPickerView } from './ColorPickerView';

// Import komponentov pre jednotlivé pohľady (vytvoríme ich nižšie alebo v samostatných súboroch)


interface ColorPickerProps {
  initialColor: string | null; // Počiatočná farba (napr. HEX) z parent komponentu
  onColorChange: (color: string, cssVariableColor?: string | null) => void; // Callback na odoslanie vybranej farby
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  initialColor,
  onColorChange,
}) => {
  // Aktívny tab môžeme riadiť interným stavom
  const [activeTab, setActiveTab] = useState<'theme' | 'custom'>('theme');

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'theme' | 'custom')} className="w-full p-2"> {/* Pridaný padding */}
      {/* Záložky na prepínanie */}
      <TabsList className="grid w-full grid-cols-2 mb-2"> {/* Zobrazenie vedľa seba */}
        <TabsTrigger value="theme">Téma</TabsTrigger>
        <TabsTrigger value="custom">Vlastná</TabsTrigger>
      </TabsList>

      {/* Obsah pre farby témy */}
      <TabsContent value="theme">
        <ThemeColorsView onColorChange={onColorChange} />
      </TabsContent>

      {/* Obsah pre vlastný color picker */}
      <TabsContent value="custom">
        <ColorPickerView
          initialColor={initialColor}
          onColorChange={(color) => onColorChange(color, null)} // Posielame len HEX, druhý arg je null
        />
      </TabsContent>
    </Tabs>
  );
};

