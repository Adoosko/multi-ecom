// src/components/navigation/IconsGroup.tsx
import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import AnimatedPopup from './AnimatedPopup';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose, // Import pre explicitné zatvorenie
} from "@/components/ui/sheet"; // Import shadcn Sheet
import UserProfileContent from './popups/UserProfileContent';
import useMediaQuery from '@/hooks/use-media-query';
import CustomCartIcon from './CartIcon';
import CartPopupContent from './popups/CartPopupContent';
import CartIcon from './CartIcon';


interface IconsGroupProps {
  isUserLoggedIn?: boolean;
}

const IconsGroup: React.FC<IconsGroupProps> = ({ isUserLoggedIn = false }) => {
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);

  const userTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Použijeme md breakpoint (768px) z Tailwindu
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // --- Logika pre Desktop Hover Popups ---
  const openPopup = useCallback((setter: React.Dispatch<React.SetStateAction<boolean>>, timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (!isDesktop) return; // Neotvárať na mobile hoverom
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setter(true);
  }, [isDesktop]);

  const closePopupWithDelay = useCallback((setter: React.Dispatch<React.SetStateAction<boolean>>, timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (!isDesktop) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setter(false);
    }, 150);
  }, [isDesktop]);

  const cancelClose = useCallback((timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (!isDesktop) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [isDesktop]);

  // --- Funkcie na zatvorenie Sheetu (budú volané z content komponentov) ---
   const handleCloseUserSheet = useCallback(() => setIsUserSheetOpen(false), []);
   const handleCloseCartSheet = useCallback(() => setIsCartSheetOpen(false), []);

  // --- Renderovanie ---
  const renderUserTrigger = (isSheetTrigger = false) => (
     <button
        className="p-2 rounded-full text-black dark:text-gray-300 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
        aria-label="Môj účet"
        // Ak nie je Sheet trigger, použijeme Link pre desktop
        onClick={!isSheetTrigger && !isDesktop ? () => {/* No action, Link handles nav */} : undefined}
        // Ak je Sheet trigger, onClick obsluhuje shadcn
        disabled={isSheetTrigger && !isDesktop} // Disable Sheet trigger on desktop
      >
        <User size={22} />
      </button>
  );

 const renderCartTrigger = (isSheetTrigger = false) => (
    <CartIcon />
 );


  return (
    <div className="flex items-center space-x-1 md:space-x-2">

      {/* User Icon Logic */}
      {isDesktop ? (
        <div
          className="relative"
          onMouseEnter={() => openPopup(setIsUserPopupOpen, userTimeoutRef)}
          onMouseLeave={() => closePopupWithDelay(setIsUserPopupOpen, userTimeoutRef)}
        >
           {/* Link pre navigáciu, aj keď je popup */}
           <Link href={isUserLoggedIn ? "/ucet" : "/prihlasenie"} legacyBehavior passHref>
              {renderUserTrigger(false)}
           </Link>
           {/* Popup sa zobrazí nad Linkom */}
           <div style={{ pointerEvents: 'none' }} /* Popup nemá zachytávať pointre, len sa zobraziť */ >
                <div onMouseEnter={() => cancelClose(userTimeoutRef)} onMouseLeave={() => closePopupWithDelay(setIsUserPopupOpen, userTimeoutRef)}>
                     <AnimatedPopup isOpen={isUserPopupOpen}>
                        <UserProfileContent isUserLoggedIn={isUserLoggedIn} />
                    </AnimatedPopup>
                </div>
           </div>
        </div>
      ) : (
        <Sheet open={isUserSheetOpen} onOpenChange={setIsUserSheetOpen}>
          <SheetTrigger asChild>
             {renderUserTrigger(true)}
          </SheetTrigger>
          <SheetContent side="right" className="bg-neutral-900 border-l-neutral-700 text-white w-[300px] sm:w-[400px] p-0">
            {/* Obsah sa renderuje tu */}
            <UserProfileContent isUserLoggedIn={isUserLoggedIn} onLinkClick={handleCloseUserSheet} />
          </SheetContent>
        </Sheet>
      )}

      {/* Cart Icon Logic */}
       {isDesktop ? (
        <div
          className="relative"
          onMouseEnter={() => openPopup(setIsCartPopupOpen, cartTimeoutRef)}
          onMouseLeave={() => closePopupWithDelay(setIsCartPopupOpen, cartTimeoutRef)}
        >
           <Link href="/kosik" legacyBehavior passHref>
                {renderCartTrigger(false)}
           </Link>
           <div style={{ pointerEvents: 'none' }}>
               <div onMouseEnter={() => cancelClose(cartTimeoutRef)} onMouseLeave={() => closePopupWithDelay(setIsCartPopupOpen, cartTimeoutRef)}>
                    <AnimatedPopup isOpen={isCartPopupOpen}>
                        <CartPopupContent />
                    </AnimatedPopup>
               </div>
           </div>
        </div>
      ) : (
        <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}>
          <SheetTrigger asChild>
             {renderCartTrigger(true)}
          </SheetTrigger>
          <SheetContent side="right" className="bg-neutral-900 border-l-neutral-700 text-white w-[300px] sm:w-[400px] p-0">
             <CartPopupContent  onLinkClick={handleCloseCartSheet} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default IconsGroup;
