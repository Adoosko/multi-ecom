// src/features/fontColor/components/DropdownColorPicker.tsx
"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection'; // Korektný import
import { mergeRegister } from '@lexical/utils'; // Na počúvanie zmien selekcie

// Predpokladáme, že máš tieto komponenty z UI knižnice (napr. ShadCN/ui)
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { FontColorIcon } from '../icons/FontColorIcon';
import { translateColor } from '../utils/utils'; // Tvoja utilita na konverziu
import { ColorPicker } from './ColorPicker';

export const DropdownColorPicker: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [fontColor, setFontColor] = useState<string | null>(null); // Aktuálna farba (napr. HEX), null ak neznáma/mix
  const [cssVariable, setCssVariable] = useState<string | null>(null); // Uložíme HSL/OKLCH formát, ak je z témy
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- Funkcie pre interakciu s Lexical ---

  // 1. Aplikuje štýl na vybraný text
  const applyStyleTextToNodes = useCallback((styles: Record<string, string | null>) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, styles);
      }
    });
  }, [editor]);

  // 2. Získa štýly (farbu) z aktuálneho uzla
  const getNodeStyles = useCallback((node: HTMLElement): { color: string } => {
    const computedStyle = getComputedStyle(node);
    return {
      color: computedStyle.color, // Vráti farbu ako ju vidí prehliadač (napr. rgb(...))
    };
  }, []);

  // 3. Nastaví počiatočnú farbu v pickeri podľa selekcie
  const setPickerColorFromSelection = useCallback(() => {
    editor.getEditorState().read(() => { // Použijeme read namiesto update, lebo len čítame
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
          setFontColor(null); // Reset, ak nie je textová selekcia
          setCssVariable(null);
          return;
      };

      const nodes = selection.getNodes();
      if (nodes.length === 0) {
          setFontColor(null);
          setCssVariable(null);
          return;
      }

      // Zistíme farbu prvého uzla
      let firstColor: string | null = null;
      let firstCssVar: string | null = null;
      const firstDomNode = editor.getElementByKey(nodes[0].getKey());
      if (firstDomNode) {
          const style = getNodeStyles(firstDomNode);
          firstColor = translateColor(style.color, 'HEX') || null; // Prevedieme na HEX pre zobrazenie
          // Skúsime zistiť, či je to CSS premenná (toto je zložitejšie bez uloženia informácie priamo na node)
          // Jednoduchší prístup: ak je farba z témy, uložíme ju do cssVariable pri výbere
          // Tu len čítame aktuálnu farbu
      }

      // Skontrolujeme, či majú všetky uzly rovnakú farbu
      let commonColor = firstColor;
      let commonCssVar = firstCssVar; // Zatiaľ null, spoliehame sa na nastavenie pri výbere

      for (let i = 1; i < nodes.length; i++) {
          const domNode = editor.getElementByKey(nodes[i].getKey());
          if (domNode) {
              const style = getNodeStyles(domNode);
              const currentColor = translateColor(style.color, 'HEX') || null;
              if (currentColor !== commonColor) {
                  commonColor = null; // Farby sú zmiešané
                  commonCssVar = null;
                  break;
              }
          } else {
              commonColor = null; // Nemôžeme zistiť farbu, reset
              commonCssVar = null;
              break;
          }
      }

      setFontColor(commonColor);
      // setCssVariable(commonCssVar); // Toto by sme mali nastaviť len pri explicitnom výbere z témy
       setCssVariable(null); // Radšej resetujeme, ak nevieme isto

    });
  }, [editor, getNodeStyles]);

  // 4. Počúvanie zmien selekcie na aktualizáciu farby v toolbare
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          // Aktualizujeme farbu, keď sa zmení selekcia (ak dropdown nie je otvorený)
          if (!isDropdownOpen) {
            setPickerColorFromSelection();
          }
        });
      })
    );
  }, [editor, isDropdownOpen, setPickerColorFromSelection]);


  // --- Handlery pre Dropdown ---

  // 5. Zmena farby v pickeri (volané z ColorPicker, ThemeColorButton)
  const handleFontColorChange = useCallback((color: string, cssVariableColor?: string | null) => {
    setFontColor(color); // Vždy ukladáme viditeľnú farbu (napr. HEX)
    setCssVariable(cssVariableColor || null); // Uložíme CSS premennú, ak prišla
  }, []);

  // 6. Aplikovanie štýlu bez zatvorenia dropdownu (volané napr. pri kliknutí na farbu v pickeri)
  const handleApplyStyles = useCallback(() => {
    if (fontColor !== null) { // Aplikujeme len ak je farba definovaná
        // Dôležité: Použijeme cssVariable ak existuje, inak priamu farbu (fontColor)
        const colorToApply = cssVariable ?? fontColor;
        applyStyleTextToNodes({ color: colorToApply });
    } else {
        // Prípadne by sme mohli farbu resetovať na default, ak fontColor je null?
        // applyStyleTextToNodes({ color: null }); // Odstráni inline štýl
    }
  }, [applyStyleTextToNodes, fontColor, cssVariable]);


  // 7. Handler pre otvorenie/zatvorenie dropdownu + focus bug fix
  const handleOpenChange = useCallback((open: boolean) => {
    setIsDropdownOpen(open);
    if (open) {
      // Pred otvorením nastavíme farbu podľa aktuálnej selekcie
      setPickerColorFromSelection();
      // Aplikujeme dočasný štýl pre "fix" straty focusu (ako v článku)
      editor.getEditorState().read(() => { // Potrebujeme prečítať selekciu
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
             applyStyleTextToNodes({
                'background-color': 'var(--selection-bg, #7dccf8)', // Použijeme CSS premennú ak existuje
                'color': 'var(--selection-color, #000000)',
                // 'padding-bottom': '1px', // Toto môže byť rušivé
             });
        }
      });

    } else {
      // Po zatvorení dropdownu finálne aplikujeme vybranú farbu a odstránime dočasný štýl
       if (fontColor !== null) {
          const colorToApply = cssVariable ?? fontColor;
          applyStyleTextToNodes({
              color: colorToApply,
              'background-color': null, // Odstránime dočasné pozadie
              // 'padding-bottom': null,
          });
       } else {
           // Ak nebola vybraná farba (alebo bola zmiešaná), len odstránime dočasný štýl
           applyStyleTextToNodes({
                'background-color': null,
                // 'padding-bottom': null,
            });
            // Prípadne reset na default farbu, ak je to želaný behavior
            // applyStyleTextToNodes({ color: null, 'background-color': null });
       }
    }
  }, [editor, applyStyleTextToNodes, setPickerColorFromSelection, fontColor, cssVariable]);


  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="toolbar-item inline-flex items-center justify-center p-1 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 z-50">
         {/* Použijeme fontColor (napr. HEX) pre podčiarknutie */}
        <FontColorIcon underscoreColor={fontColor} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="bg-gray-800 border-gray-700 text-white p-0">
        {/* ColorPicker komponent očakáva tieto props */}
        <ColorPicker
          initialColor={fontColor} // Počiatočná farba
          onColorChange={handleFontColorChange} // Callback pri zmene farby
          // handleApplyStyles nepotrebujeme, ak sa aplikuje až po zatvorení
          // Ak by si chcel "live" update, pridal by si to sem a volal handleApplyStyles
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
