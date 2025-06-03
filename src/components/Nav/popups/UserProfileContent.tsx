// src/components/navigation/popups/UserProfileContent.tsx
"use client"; // Potrebujeme useState a event handlery

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // ShadCN/ui Button
import { Separator } from '@/components/ui/separator'; // ShadCN/ui Separator
import {
  UserCircle, // Ikona pre účet
  Package,    // Ikona pre objednávky
  LogOut,     // Ikona pre odhlásenie
  LogIn,      // Ikona pre prihlásenie
  UserPlus,   // Ikona pre registráciu
  X           // Ikona pre zatvorenie (ak by bola potrebná v headeri)
} from 'lucide-react'; // Ikony
import { cn } from '@/lib/utils';

interface UserProfileContentProps {
  isUserLoggedIn: boolean;
  onLinkClick?: () => void; // Na zatvorenie Sheetu/Popupu pri akcii
}

const UserProfileContent: React.FC<UserProfileContentProps> = ({ isUserLoggedIn, onLinkClick }) => {

  const handleLogout = () => {
    // TODO: Implementovať reálnu logiku odhlásenia (napr. API call, vyčistenie tokenu)
    console.log('Logging out...');
    onLinkClick?.(); // Zatvorí Sheet/Popup po akcii
  };

  // Štýly pre položky menu (Link/Button)
  const menuItemClass = cn(
    "flex items-center w-full text-left px-3 py-2.5 rounded-md", // Layout a padding
    "text-sm font-medium text-foreground", // Základný text
    "transition-colors duration-150 ease-in-out", // Plynulý prechod
    "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" // Interakcia a focus
  );

  return (
    // Použijeme farby pre popover/sheet
    <div className="bg-popover text-popover-foreground h-full flex flex-col p-0"> {/* Padding riešime vnútri */}

        {/* === Hlavička (Voliteľné, ale odporúčané pre Sheet) === */}
        <div className="px-4 sm:px-6 py-4 border-b border-border flex justify-between items-center flex-shrink-0">
            <h4 className="font-semibold text-base text-foreground">
                {isUserLoggedIn ? 'Môj účet' : 'Prihlásenie / Registrácia'}
            </h4>
            {/* Tlačidlo na zatvorenie môže byť tu alebo riešené cez SheetClose v parent komponente */}
            {/* <Button variant="ghost" size="icon" onClick={onLinkClick} className="h-7 w-7 text-muted-foreground"><X size={16} /></Button> */}
        </div>

        {/* === Hlavný Obsah === */}
        <div className="flex-grow p-4 sm:p-6 space-y-4">
            {isUserLoggedIn ? (
                // --- Stav: Prihlásený ---
                <div className="space-y-1"> {/* Menšie medzery medzi linkami */}
                    {/* Voliteľné: Zobrazenie mena/emailu */}
                    {/* <div className="px-3 py-2 mb-2">
                        <p className="text-sm font-medium text-foreground">Ján Vzorový</p>
                        <p className="text-xs text-muted-foreground">jan.vzorovy@email.com</p>
                    </div>
                    <Separator className="my-2" /> */}

                    <Link href="/ucet" onClick={onLinkClick} className={menuItemClass}>
                        <UserCircle size={18} className="mr-3 text-muted-foreground" />
                        Prehľad účtu
                    </Link>
                    <Link href="/objednavky" onClick={onLinkClick} className={menuItemClass}>
                        <Package size={18} className="mr-3 text-muted-foreground" />
                        Moje objednávky
                    </Link>

                    {/* Oddeľovač pred odhlásením */}
                    <Separator className="my-3" />

                    <Button
                        variant="ghost" // Jemnejší vzhľad, ale s deštruktívnou farbou
                        size="sm"
                        className={cn(
                            menuItemClass, // Základný štýl položky
                            "text-destructive hover:bg-destructive/10 hover:text-destructive" // Farby pre odhlásenie
                        )}
                        onClick={handleLogout}
                    >
                        <LogOut size={18} className="mr-3" />
                        Odhlásiť sa
                    </Button>
                </div>
            ) : (
                // --- Stav: Neprihlásený ---
                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                        <LogIn size={32} strokeWidth={1.5}/>
                    </div>
                    <p className="font-semibold text-foreground text-base">
                        Prihláste sa alebo sa registrujte
                    </p>
                    <p className="text-sm text-muted-foreground pb-2">
                        Získajte prístup k histórii objednávok a uložte si svoje údaje.
                    </p>
                     {/* Použijeme Button priamo s Linkom */}
                    <Button asChild size="lg" className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-red-700 dark:hover:bg-red-800 dark:text-white">
                        <Link href="/prihlasenie" onClick={onLinkClick}>
                            <LogIn size={18} className="mr-2"/> Prihlásiť sa
                        </Link>
                    </Button>
                     <Button asChild variant="outline" size="lg" className="w-full h-11">
                        <Link href="/registracia" onClick={onLinkClick}>
                            <UserPlus size={18} className="mr-2"/> Vytvoriť účet
                        </Link>
                    </Button>
                </div>
            )}
        </div>

        {/* === Pätička (Voliteľné) === */}
        {/* <div className="px-4 sm:px-6 py-4 border-t border-border mt-auto flex-shrink-0">
            <p className="text-xs text-muted-foreground text-center">Nejaký text v pätičke</p>
        </div> */}
    </div>
  );
};

export default UserProfileContent;
