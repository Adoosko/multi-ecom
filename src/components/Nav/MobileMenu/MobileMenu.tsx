import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import MobileNavItem from './MobileNavItem';
import MobileSearchBar from './MobileSearchBar';
import Link from 'next/link';
import { User, ShoppingCart, Search } from 'lucide-react';
import { ThemeSwitcher } from '../../ui/theme-switcher';
import { NavItemData } from '@/types';
import { useTheme } from 'next-themes';

interface MobileMenuProps {
  isOpen: boolean;
  items: NavItemData[];
  onClose: () => void;
}

const mobileMenuVariants = {
  closed: { opacity: 0, y: -30, transition: { duration: 0.3, ease: "easeInOut" } },
  open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, items, onClose }) => {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleItemToggle = (itemId: string) => {
    // If clicking on the already active item, close it
    if (activeItemId === itemId) {
      setActiveItemId(null);
    } else {
      // Otherwise, set this item as active (closing any other)
      setActiveItemId(itemId);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu" // Key is important for AnimatePresence
          variants={mobileMenuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className={`md:hidden fixed left-0 right-0 top-20 ${theme === 'dark' ? 'bg-black' : 'bg-white'} z-[9999] ${theme === 'dark' ? 'shadow-xl' : 'shadow'} pb-4 max-h-[calc(100vh-5rem)] overflow-y-auto`}
        >
          <div className="px-3 pt-3 pb-3 sm:px-4 flex flex-col items-start">
            <div className="flex justify-between w-full mb-4">
              <div className="flex items-center space-x-4">
                <Link href="/search" className={`flex items-center p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}>
                  <Search className="h-6 w-6" />
                </Link>
                <Link href="/cart" className={`flex items-center p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}>
                  <ShoppingCart className="h-6 w-6" />
                </Link>
                <Link href="/account" className="flex items-center space-x-2">
                  <User className="h-6 w-6" />
                  <span className="text-sm font-medium">Moj účet</span>
                </Link>
                <ThemeSwitcher />
              </div>
            </div>
            <div className="w-full">
              <MobileSearchBar onSearch={onClose} /> {/* Close menu on search submit */}
            </div>
            {items.map((item) => (
              <MobileNavItem 
                key={item.id} 
                item={item} 
                onClose={onClose}
                isActive={activeItemId === item.id}
                onToggle={() => handleItemToggle(item.id)}
              />
            ))}

          </div>
        </motion.div>
      )}
          
           
    </AnimatePresence>
  );
};

export default MobileMenu;