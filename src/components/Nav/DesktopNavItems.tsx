// src/components/navigation/DesktopNavItems.tsx
import React from 'react';
import Link from 'next/link';
import { type NavItemData } from '@/types';
import { ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';

interface DesktopNavItemsProps {
  items: NavItemData[];
  hoveredItemId: string | null;
  onMouseEnter: (itemId: string) => void;
   // onMouseLeave is handled by the parent Navbar div
}

const DesktopNavItems: React.FC<DesktopNavItemsProps> = ({
  items,
  hoveredItemId,
  onMouseEnter,
}) => {
  const { theme } = useTheme();
  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => item.megaMenu && onMouseEnter(item.id)}
           // onMouseLeave is handled by the parent div covering the whole navbar + dropdown
        >
          <Link
            href={item.href || '#'} // Use href if available, otherwise '#' for dropdown trigger
            aria-haspopup={!!item.megaMenu}
            aria-expanded={hoveredItemId === item.id}
            className={`px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-all duration-200 ease-in-out flex items-center
              ${hoveredItemId === item.id && item.megaMenu ? `${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} scale-105 ${theme === 'dark' ? 'shadow-lg' : 'shadow-md'}` : `${theme === 'dark' ? 'text-white hover:bg-gray-700 hover:text-white' : 'text-gray-900 hover:bg-gray-100 hover:text-gray-900'}`}
            `}
          >
            {item.name}
            {item.megaMenu && (
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                  hoveredItemId === item.id ? 'transform rotate-180' : ''
                } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                aria-hidden="true" // Decorative icon
              />
            )}
          </Link>
        </div>
      ))}
    </>
  );
};

export default DesktopNavItems;
