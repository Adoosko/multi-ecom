// src/components/products/ProductCard.tsx
"use client"; // Potrebujeme klientský komponent kvôli state pre hover (aj keď teraz ho nepoužijeme)

import React from 'react'; // Import Reactu
import Link from 'next/link';
import Image from 'next/image';
import type { Product, Media, Manufacturer } from '@/payload-types'; // Importuj správne typy
import { Button } from '@/components/ui/button'; // Ak by si chcel tlačidlo
import { Heart, ShoppingCart } from 'lucide-react'; // Ikony
import { cn } from '@/lib/utils'; // Utility pre triedy

// Helper pre formátovanie ceny
const formatPrice = (price: number | null | undefined): string => {
    if (typeof price !== 'number') return 'N/A'; // Fallback pre neplatnú cenu
    // Použijeme sk-SK lokalizáciu a menu EUR
    return price.toLocaleString('sk-SK', { style: 'currency', currency: 'EUR' });
};

interface ProductCardProps {
  product: Product;
  index?: number; // index pre "Nové" badge, ak ho chceš stále používať
  className?: string; // Pre extra štýly z rodiča
}

export default function ProductCard({ product, index, className }: ProductCardProps) {

  // Bezpečné získanie obrázka (predpokladá depth >= 1 pri fetchovaní)
  const featuredImage = (typeof product.featuredImage === 'object' && product.featuredImage !== null)
    ? product.featuredImage as Media // Pretypujeme na Media
    : null;

  // Bezpečné získanie výrobcu (predpokladá depth >= 1)
 const manufacturer = (typeof product.manufacturer === 'object' && product.manufacturer !== null)
         ? product.manufacturer.value as Manufacturer // Access the value property which contains the Manufacturer object
         : null;
   

  // Ceny - predpokladáme, že sú s DPH
  const currentPrice = product.price;
  const originalPrice = product.originalPrice;
  const hasDiscount = typeof originalPrice === 'number' && typeof currentPrice === 'number' && originalPrice > currentPrice;

  // Podmienka pre "Nové" badge (môžeš nahradiť vlastným poľom z CMS, napr. product.isNew)
  const isNew = index !== undefined && index < 3; // Napríklad prvé 3 produkty sú "Nové"

  return (
    <Link
      href={`/products/${product.slug}`} // Používame správnu cestu
      className={cn(
          "group block overflow-hidden rounded-lg ", // Základný kontajner a group pre hover efekty
          "bg-card  ", // Sémantické farby pozadia a borderu
          'shadow-none',
          "transition-all duration-300 ease-in-out", // Plynulý prechod
          className // Externé triedy
      )}
      // Odstránené onMouseMove a onMouseLeave pre 3D efekt
    >
      {/* Kontajner pre obrázok a badges */}
      <div className="relative overflow-hidden">
        {/* Image Container */}
        <div className="relative w-full  aspect-[4/3] bg-muted/50"> {/* Pomer strán 4:3, fallback pozadie */}
          <Image
            fill // Vyplní rodičovský div
            src={featuredImage?.url ?? '/images/placeholder.png'} // Fallback obrázok
            alt={featuredImage?.alt || product.title || 'Produkt'} // Alt text
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" // Optimalizácia pre rôzne veľkosti
            className={cn(
                "object-contain p-3", // Contain, aby bol vidieť celý, s paddingom
                "transition-transform duration-300 ease-in-out", // Plynulý prechod
                "group-hover:scale-105" // Zoom efekt pri hoveri nad celou kartou
            )}
          />
        </div>

        {/* Badges (Nové, Zľava) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {isNew && (
            <span className="inline-block bg-primary dark:bg-red-600 text-primary-foreground dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Nové
            </span>
          )}
          {hasDiscount && (
            <span className="inline-block bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Zľava
            </span>
          )}
        </div>

        {/* Wishlist Button (Voliteľné) */}
        {/* <Button
             variant="secondary"
             size="icon"
             onClick={(e) => { e.preventDefault(); console.log('Wishlist clicked'); }}
             className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 bg-background/70 hover:bg-background"
             aria-label="Pridať do obľúbených"
        >
             <Heart size={16} className="text-foreground/80" />
        </Button> */}

      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 space-y-1"> {/* Padding a medzery */}
        {/* Výrobca */}
        {manufacturer?.name && (
          <p className="text-xs text-muted-foreground mb-0.5 line-clamp-1">
            {manufacturer.name}
          </p>
        )}

        {/* Názov Produktu */}
        <h3
            className="text-sm font-semibold text-foreground leading-snug line-clamp-2 h-[2.6em]" // Fixná výška pre 2 riadky
            title={product.title} // Tooltip pre dlhý názov
        >
          {product.title}
        </h3>

        {/* Cena */}
        <div className="flex items-baseline gap-2 pt-1"> {/* Odsadenie ceny */}
          <span className="text-base font-bold text-foreground">
            {formatPrice(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs line-through text-muted-foreground">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* DPH Text */}
        <p className="text-[11px] text-muted-foreground/80 !mt-0"> {/* Menší text, odstránená horná medzera */}
            Cena s DPH
        </p>
      </div>
    </Link>
  );
}
