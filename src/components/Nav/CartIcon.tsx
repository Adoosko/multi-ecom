// src/components/layout/CartIcon.tsx
"use client";

import React from 'react';
import Link from 'next/link'; // Alebo Button, ak otvára modal/sidebar
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore'; // Import store hooku
import { Button } from '@/components/ui/button'; // Voliteľné, pre štýl

const CartIcon: React.FC = () => {
  // Získanie počtu položiek pomocou selektora
  // Použijeme `useStore` s callbackom, aby sa komponent re-renderoval len pri zmene počtu
  const itemCount = useCartStore(state => state.getItemCount());
  // Alebo ak chceme celý stav a počítať tu:
  // const items = useCartStore(state => state.items);
  // const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    // Použijeme Link alebo Button podľa potreby
    <Link href="/kosik" passHref>
      <Button variant="ghost" size="icon" className="relative rounded-full" aria-label={`Nákupný košík (${itemCount} položiek)`}>
        <ShoppingCart className="h-5 w-5" />
        {/* Badge s počtom položiek */}
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary dark:bg-red-600 text-xs font-bold text-primary-foreground dark:text-white">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default CartIcon;
