// src/components/navigation/MobileMenu/MobileNavItem.tsx
import React from 'react';
import Link from 'next/link';
import { type NavItemData } from '@/types';
import { ChevronDown, ShoppingCart, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"; // Ensure this path is correct

interface MobileNavItemProps {
  item: NavItemData;
  onClose: () => void; // Function to close the mobile menu
  isActive?: boolean; // Whether this item is active
  onToggle?: () => void; // Function to toggle this item
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ item, onClose, isActive = false, onToggle }) => {
  const { theme } = useTheme();

  // If the item has a megaMenu, render it as a Collapsible
  if (item.megaMenu && item.megaMenu.length > 0) {
    return (
      <Collapsible className="w-full group/collapsible" open={isActive} onOpenChange={onToggle}>
        <CollapsibleTrigger className={`flex justify-between items-center w-full px-3 py-3 rounded-md text-base font-medium ${theme === 'dark' ? 'text-gray-200 hover:bg-neutral-800 hover:text-white' : 'text-gray-900 hover:bg-gray-100 hover:text-gray-900'} transition-colors duration-150 ${theme === 'dark' ? 'data-[state=open]:bg-neutral-800 data-[state=open]:text-white' : 'data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900'}`}>
          <span>{item.name}</span>
          <ChevronDown className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} group-data-[state=open]/collapsible:rotate-180 transition-transform duration-200`} />
        </CollapsibleTrigger>
        <CollapsibleContent className={`pl-6 pr-3 pb-2 space-y-1 ${theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'} rounded-b-md overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down`}>
          {/* Flatten links for mobile simplicity, could also group by category */}
          {item.megaMenu.flatMap(category => category.links).map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 px-3 rounded-md text-sm font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-neutral-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} transition-colors duration-150`}
              onClick={onClose} // Close menu on link click
            >
              {link.name}
            </Link>
          ))}
          {/* Optional: Link to the main category page */}
          {item.href && (
            <Link
              href={item.href}
              className={`block pt-2 mt-1 border-t border-${theme === 'dark' ? 'gray-600' : 'gray-200'} py-2 px-3 rounded-md text-sm font-semibold ${theme === 'dark' ? 'text-blue-300 hover:bg-neutral-800 hover:text-blue-200' : 'text-blue-600 hover:bg-gray-100 hover:text-blue-700'} transition-colors duration-150`}
              onClick={onClose}
            >
              Zobraziť všetko v {item.name}
            </Link>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // If it's a simple link
  return (
    <Link
      href={item.href || '#'}
      className={`block px-3 py-3 rounded-md text-base font-medium ${theme === 'dark' ? 'text-gray-200 hover:bg-neutral-800 hover:text-white' : 'text-gray-900 hover:bg-gray-100 hover:text-gray-900'} transition-colors duration-150`}
      onClick={onClose}
    >
      {item.name}
    </Link>
  );
};

export default MobileNavItem;