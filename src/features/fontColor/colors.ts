// src/features/fontColor/colors.ts (alebo iná vhodná cesta)

// Mapovanie názvov na CSS premenné z tvojho globals.css
// Názvy kľúčov sú ľubovoľné, ale mali by byť popisné
const themeColors = {
    background: '--background',
    foreground: '--foreground',
    card: '--card',
    cardForeground: '--card-foreground',
    popover: '--popover',
    popoverForeground: '--popover-foreground',
    primary: '--primary', // OKLCH (svetlá sivá v tmavom móde)
    primaryForeground: '--primary-foreground', // OKLCH (tmavá sivá v tmavom móde)
    secondary: '--secondary', // OKLCH (tmavá sivá v tmavom móde)
    secondaryForeground: '--secondary-foreground', // OKLCH (biela v tmavom móde)
    muted: '--muted',
    mutedForeground: '--muted-foreground',
    accent: '--accent', // OKLCH (tmavá sivá v tmavom móde)
    accentForeground: '--accent-foreground', // OKLCH (biela v tmavom móde)
    destructive: '--destructive', // OKLCH (červená)
    // destructiveForeground nepotrebujeme pre farbu textu
    border: '--border',
    input: '--input',
    ring: '--ring',
    // Môžeš pridať aj farby pre grafy (--chart-1 až --chart-5) alebo sidebar, ak ich chceš mať v pickeri
    chart1: '--chart-1',
    chart2: '--chart-2',
    chart3: '--chart-3',
    chart4: '--chart-4',
    chart5: '--chart-5',
    // Prípadne špecifické farby pre text
    textPrimary: '--foreground',
    textSecondary: '--secondary-foreground',
    textMuted: '--muted-foreground',
    textAccent: '--accent-foreground',
    textDestructive: '--destructive',
  };
  
  export default themeColors;
  
  // Utilita na prevod camelCase na čitateľný text (ako v článku)
  export function createSentenceFromCamelCase(text: string, maxLength: number = 30): string {
      const result = text.replace(/([A-Z])/g, ' $1');
      let finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      if (finalResult.length > maxLength) {
          finalResult = finalResult.substring(0, maxLength) + '...';
      }
      return finalResult;
  }
  