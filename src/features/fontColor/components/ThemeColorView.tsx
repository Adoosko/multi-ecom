// src/features/fontColor/components/ThemeColorsView.tsx
import themeColors, { createSentenceFromCamelCase } from '../colors'; // Import mapovania farieb
import { ThemeColorButton } from './ThemeColorButton';


interface ThemeColorsViewProps {
  onColorChange: (color: string, cssVariableColor: string) => void;
}

export const ThemeColorsView: React.FC<ThemeColorsViewProps> = ({ onColorChange }) => {
  // Získame kľúče a premenné z mapovania
  const themeEntries = Object.entries(themeColors);

  return (
    <div className="grid grid-cols-4 gap-2 p-2 max-h-60 overflow-y-auto"> {/* Grid pre tlačidlá farieb */}
      {themeEntries.map(([key, variable]) => (
        <ThemeColorButton
          key={key}
          label={createSentenceFromCamelCase(key)} // Vytvoríme čitateľný label
          variable={variable} // CSS premenná (napr. '--primary')
          onColorChange={onColorChange}
        />
      ))}
      {/* Môžeš pridať aj tlačidlo na reset farby */}
      {/* <button onClick={() => onColorChange('inherit', null)}>Reset</button> */}
    </div>
  );
};