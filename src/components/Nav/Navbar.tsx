"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import DesktopNavItems from './DesktopNavItems';
import MegaMenuDropdown from './MegaMenuDropdown';
import SearchBar from './SearchBar';
import IconsGroup from './IconsGroup';
import MobileMenuButton from './MobileMenuButton';
import MobileMenu from './MobileMenu/MobileMenu'; // Importujeme MobileMenu
import { type NavItemData } from '@/types'; // Predpokladáme typy v samostatnom súbore
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '../ui/theme-switcher';
import { ShoppingCart, User, Search } from 'lucide-react';
import { useTheme } from 'next-themes';

// Sample data (rovnaké ako predtým, presunuté alebo importované)
// import { navItemsData } from './data/navData';
const navItemsData: NavItemData[] = [
    { id: 'clothing', name: 'Pracovné Odevy', megaMenu: [
        { title: 'Nohavice', description: "Odolné nohavice pre každú prácu.", links: [
            { name: 'Montérky', href: '/odevy/nohavice/monterky'},
            { name: 'Krátke nohavice', href: '/odevy/nohavice/kratke'},
            { name: 'Zateplené nohavice', href: '/odevy/nohavice/zateplene'}]
        },
        { title: 'Bundy a Vesty', description: "Ochrana pred počasím aj rizikom.", links: [
            { name: 'Zimné bundy', href: '/odevy/bundy/zimne' },
            { name: 'Softshellové bundy', href: '/odevy/bundy/softshell' },
            { name: 'Reflexné bundy', href: '/odevy/bundy/reflexne'},
            { name: 'Vesty', href: '/odevy/vesty'}]
        },
        { title: 'Vrchný diel', description: "Pohodlie a funkčnosť.", links: [
            { name: 'Tričká', href: '/odevy/tricka' },
            { name: 'Mikiny', href: '/odevy/mikiny' },
            { name: 'Košele', href: '/odevy/kosele'}]
        },
        { title: 'Špeciálne odevy', description: "Pre špecifické profesie.", links: [
            { name: 'Gastro odevy', href: '/odevy/gastro' },
            { name: 'Zdravotnícke odevy', href: '/odevy/zdravotnicke' }]
        },
      ]
    },
      { id: 'footwear', name: 'Pracovná Obuv', megaMenu: [
        { title: 'Bezpečnostná Obuv', description: "S ochrannou špicou a stielkou.", links: [
            { name: 'S3 Obuv', href: '/obuv/bezpecnostna/s3' },
            { name: 'S1P Obuv', href: '/obuv/bezpecnostna/s1p' }]
        },
        { title: 'Pracovná Obuv', description: "Bez ochrannej špice.", links: [
            { name: 'O1 Obuv', href: '/obuv/pracovna/o1' },
            { name: 'O2 Obuv', href: '/obuv/pracovna/o2' }]
        },
        { title: 'Špeciálna Obuv', description: "Pre náročné podmienky.", links: [
            { name: 'Zimná obuv', href: '/obuv/specialna/zimna' },
            { name: 'Gumáky', href: '/obuv/specialna/gumaky' }]
        },
        { title: 'Doplnky k Obuvi', description: "", links: [
            { name: 'Vložky do topánok', href: '/obuv/doplnky/vlozky' },
            { name: 'Ponožky', href: '/obuv/doplnky/ponozky' },
            { name: 'Šnúrky', href: '/obuv/doplnky/snurky' }]
        },
      ]
    },
    { id: 'gloves', name: 'Rukavice', href: '/rukavice' }, // Simple link example
    { id: 'blog', name: 'Blog', href: '/blog' },
    { id: 'brands', name: 'Značky', href: '/znacky' },
  ];


const Navbar: React.FC = () => {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const prevScrollY = useRef(0);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { theme } = useTheme();

  const navVariants = {
    topVisible: { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0)' : '#fff', backdropFilter: 'blur(0px)', y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    topHidden: { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0)' : '#fff', backdropFilter: 'blur(0px)', y: '-100%', transition: { duration: 0.5, ease: 'easeInOut' } },
    scrolledVisible: { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    scrolledHidden: { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', y: '-100%', transition: { duration: 0.5, ease: 'easeInOut' } },
  };
  const backgroundState = !isHome ? 'scrolled' : isScrolled ? 'scrolled' : 'top';
  const navVariantKey = `${backgroundState}${showNavbar ? 'Visible' : 'Hidden'}`;
  const initialVariant = !isHome ? 'scrolledVisible' : 'topVisible';

  // Debounced mouse leave handler
  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setHoveredItemId(null);
    }, 150);
  }, []);

  // Mouse enter handler (clears timeout)
  const handleMouseEnter = useCallback((itemId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredItemId(itemId);
  }, []);

  // Clear timeout without setting state (used by dropdown)
   const clearLeaveTimeout = useCallback(() => {
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
      }
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

   const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY.current && currentScrollY > 10) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      prevScrollY.current = currentScrollY;
      setIsScrolled(currentScrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeMegaMenu = navItemsData.find(item => item.id === hoveredItemId)?.megaMenu;

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      <motion.nav
        variants={navVariants}
        initial={initialVariant}
        animate={navVariantKey}
        className={`fixed top-0 left-0 right-0 w-full z-50 ${theme === 'dark' ? 'text-white bg-neutral-900' : 'bg-white text-gray-900'}`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <div className='lg:hidden'>
                  <MobileMenuButton isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
                </div>
                <Logo />
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2 lg:space-x-4 flex-shrink">
                <DesktopNavItems
                  items={navItemsData}
                  hoveredItemId={hoveredItemId}
                  onMouseEnter={handleMouseEnter}
                />
              </div>

              {/* Search & Icons */}
              <div className="hidden md:flex items-center space-x-4 ml-auto">
                <SearchBar isScrolled={isScrolled} />
                <IconsGroup /> {/* Example count */}
                <ThemeSwitcher />
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center space-x-2">
                <Link href="/search" className={`flex items-center p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}>
                  <Search className="h-6 w-6" />
                </Link>
                <Link href="/cart" className={`flex items-center p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}>
                  <ShoppingCart className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        <AnimatePresence>
            {activeMegaMenu && (
                <MegaMenuDropdown
                    menuData={activeMegaMenu}
                    currentItemId={hoveredItemId}
                    onMouseEnter={() => { clearLeaveTimeout(); handleMouseEnter(hoveredItemId!); }}
                    onMouseLeave={handleMouseLeave} // Reuse the same leave handler
                    onLinkClick={() => setHoveredItemId(null)}
                />
            )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Panel */}
       <MobileMenu
         isOpen={isMobileMenuOpen}
         items={navItemsData}
         onClose={closeMobileMenu}
       />
    </div>
  );
};

export default Navbar;

// Predpokladáme typy v src/types/navigation.ts
// export interface MegaMenuCategory { ... }
// export interface NavItemData { ... }
