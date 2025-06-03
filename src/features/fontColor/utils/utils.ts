/* eslint-disable */
// src/features/fontColor/utils/translateColor.ts
import { ColorTranslator } from "colortranslator";

// Definujeme typ pre podporované formáty
type TargetColorFormat = "HEX" | "RGB" | "HSL"; // Môžeš pridať ďalšie podľa potreby

/**
 * Konvertuje CSS farbu do špecifikovaného formátu.
 * @param color Vstupná farba (napr. 'rgb(255, 0, 0)', '#ff0000', 'hsl(0, 100%, 50%)', alebo dokonca názov ako 'red').
 * @param targetFormat Cieľový formát ('HEX', 'RGB', 'HSL').
 * @returns Farba v cieľovom formáte ako string, alebo undefined pri neúspešnej konverzii.
 */
export function translateColor(
  color: string | null | undefined,
  targetFormat: TargetColorFormat
): string | undefined {
  if (!color) {
    return undefined; // Vrátime undefined, ak je vstup neplatný
  }

  try {
    // Pokúsime sa vytvoriť inštanciu ColorTranslator
    const translator = new ColorTranslator(color);

    // Konvertujeme na cieľový formát
    switch (targetFormat) {
      case "HEX":
        return translator.HEX;
      case "RGB":
        return translator.RGB; // Vráti string ako 'rgb(r, g, b)'
      case "HSL":
        return translator.HSL; // Vráti string ako 'hsl(h, s%, l%)'
      default:
        console.warn(
          `Unsupported target format in translateColor: ${targetFormat}`
        );
        return undefined;
    }
  } catch (error) {
    // Ak colortranslator vyhodí chybu (neplatná farba)
    // console.error(`Failed to translate color "${color}":`, error); // Voliteľné logovanie
    return undefined;
  }
}

// Príklad použitia (môžeš odstrániť):
// const hexColor = translateColor('rgb(224, 31, 36)', 'HEX'); // --> #E01F24
// const rgbColor = translateColor('#E01F24', 'RGB'); // --> rgb(224, 31, 36)
// const hslColor = translateColor('oklch(0.704 0.191 22.216)', 'HSL'); // Skúsi konvertovať OKLCH na HSL
