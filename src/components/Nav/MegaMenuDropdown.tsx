// src/components/navigation/MegaMenuDropdown.tsx
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { type MegaMenuCategory } from '@/types';
import { ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';

interface MegaMenuDropdownProps {
  menuData: MegaMenuCategory[];
  currentItemId: string | null; // To keep the parent informed, might not be needed if logic is self-contained
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLinkClick: () => void; // To close menu when a link is clicked
}

const MegaMenuDropdown: React.FC<MegaMenuDropdownProps> = ({
  menuData,
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
}) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`absolute left-0 right-0 top-full ${theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-white text-gray-900'} shadow-2xl rounded-b-lg z-10 border-t ${theme === 'dark' ? 'border-neutral-700' : 'border-gray-200'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-10">
          {menuData.map((category) => (
            <div key={category.title} className="space-y-3">
              <h3 className={`text-md font-bold ${theme === 'dark' ? 'text-black' : 'text-white'} uppercase tracking-wide border-b border-black/30 dark:border-red-400 pb-2 mb-3`}>
                <span className={`inline-block  py-1 rounded-full ${theme === 'dark' ? 'bg-transparent' : ''} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {category.title}
                </span>
              </h3>
              {category.description && (
                <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'} mb-3`}>{category.description}</p>
              )}
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`flex items-center text-base ${theme === 'dark' ? 'text-white hover:text-red-400' : 'text-gray-900 hover:text-blue-600'} hover:translate-x-1 transition-all duration-200 ease-in-out group`}
                      onClick={onLinkClick}
                    >
                      {/* Optional icon can be added here using link.icon */}
                      {link.name}
                      <ArrowRight className={`ml-2 h-4 w-4 ${theme === 'dark' ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-gray-400 group-hover:text-gray-500'}`} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Optional: Promotional block */}
           <div className="col-span-2 md:col-span-1 lg:col-span-1 dark:bg-neutral-800 bg-neutral-100 p-4 rounded-lg flex flex-col justify-center items-center text-center ">
              <h4 className="font-bold text-black dark:text-white mb-2 text-lg">Akciová Ponuka!</h4>
              <p className="text-sm text-black dark:text-white mb-4">Zľava 20% na vybrané montérky tento týždeň.</p>
              <Link href="/akcie"
                 onClick={onLinkClick}
                 className="inline-flex items-center bg-red-700 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-red-800 transition-colors duration-200 group">
                    Zobraziť
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenuDropdown;
