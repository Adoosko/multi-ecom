// // src/features/fontColor/components/ColorPickerView.tsx
// import { HexColorPicker } from "react-colorful";

// interface ColorPickerViewProps {
//   initialColor: string | null;
//   onColorChange: (color: string) => void;
// }

// export const ColorPickerView: React.FC<ColorPickerViewProps> = ({
//   initialColor,
//   onColorChange,
// }) => {
//   // Použijeme interný stav pre react-colorful, aby sme predišli zbytočným re-renderom pri ťahaní
//   const [pickerColor, setPickerColor] = useState(initialColor || "#ffffff"); // Default biela

//   // Aktualizujeme internú farbu, len ak sa initialColor zmení zvonka
//   React.useEffect(() => {
//     if (initialColor) {
//       setPickerColor(initialColor);
//     }
//   }, [initialColor]);

//   const handleColorChange = (newColor: string) => {
//     setPickerColor(newColor);
//     // Voláme onColorChange len pri "dokončení" zmeny (napr. onMouseUp alebo s debounce)
//     // Pre jednoduchosť teraz voláme pri každej zmene
//     onColorChange(newColor.toUpperCase()); // Posielame HEX
//   };

//   return (
//     <div className="flex flex-col items-center p-2 space-y-3">
//       {/* react-colorful picker */}
//       <HexColorPicker
//         color={pickerColor}
//         onChange={handleColorChange}
//         style={{ width: "100%", height: "150px" }}
//       />
//       {/* Zobrazenie aktuálne vybranej HEX hodnoty */}
//       <div className="w-full text-center p-2 bg-gray-700 rounded border border-gray-600">
//         <span className="font-mono text-sm">{pickerColor.toUpperCase()}</span>
//       </div>
//     </div>
//   );
// };

// src/features/fontColor/components/ThemeColorButton.tsx
