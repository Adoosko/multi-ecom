// src/components/navigation/MobileMenuButton.tsx
import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? "Zavrieť menu" : "Otvoriť menu"}
      aria-expanded={isOpen}
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
    >
      {isOpen ? <X size={26} /> : <Menu size={26} />}
    </button>
  );
};

export default MobileMenuButton;
