// src/components/navigation/popups/CartPopupContent.tsx
"use client";

import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/ui/quantity-selector"; // Náš selector
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/store/cartStore";
import { useCartStore } from "@/store/cartStore"; // Zustand store
import { Loader2, ShoppingCart, Trash2 } from "lucide-react"; // Ikony
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface CartPopupContentProps {
  onLinkClick?: () => void; // Zavrie Sheet/Popup
}

// Helper pre formátovanie ceny
const formatPrice = (price: number | null | undefined): string => {
  if (typeof price !== "number") return "N/A";
  return price.toLocaleString("sk-SK", { style: "currency", currency: "EUR" });
};

// --- Komponent pre jednu položku ---
const CartItemDisplay: React.FC<{ item: CartItem }> = ({ item }) => {
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  // Handler pre QuantitySelector v položke
  const handleItemQuantityChange = (newQuantity: number) => {
    updateQuantity(item.variantId, newQuantity);
  };

  return (
    // Flex kontajner pre položku
    <div className="flex items-start gap-4 py-4">
      {" "}
      {/* Väčší padding */}
      {/* Obrázok */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted/50">
        {" "}
        {/* Väčší obrázok */}
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="80px"
            className="object-contain p-1" // Malý padding pre lepší vzhľad
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <ShoppingCart size={32} className="text-muted-foreground" />{" "}
            {/* Väčšia ikona */}
          </div>
        )}
      </div>
      {/* Detaily a Akcie */}
      <div className="flex-1 space-y-2">
        {/* Názov a Odstránenie */}
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-sm font-medium text-foreground leading-snug line-clamp-2 mr-1">
            {item.title}
          </h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 -mt-1 -mr-1" // Upravené pozicovanie
            onClick={() => removeItem(item.variantId)}
            aria-label={`Odstrániť ${item.title}`}
          >
            <Trash2 size={14} />
          </Button>
        </div>

        {/* Info o variante */}
        <p className="text-xs text-muted-foreground">
          {item.color && `${item.color}${item.size ? " / " : ""}`}
          {item.size && item.size}
          {!item.color && !item.size && item.sku && `SKU: ${item.sku}`}
        </p>

        {/* Quantity Selector a Cena */}
        <div className="flex items-center justify-between gap-2">
          {/* Mini Quantity Selector */}
          {/* Pozor: maxQuantity tu nie je ľahko dostupné, spoliehame sa na logiku v store alebo neskôr */}
          <QuantitySelector
            quantity={item.quantity}
            minQuantity={1}
            // maxQuantity={item.stock || 99} // Ak by sme mali stock v CartItem
            maxQuantity={999} // Placeholder, ak nemáme presný sklad
            onChange={handleItemQuantityChange}
            className="h-8 scale-90 origin-left" // Menšia verzia selectoru
            // disabled={item.stock <= 0} // Ak by sme mali stock
          />
          <span className="text-sm font-semibold text-foreground whitespace-nowrap">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Hlavný Komponent Popupu ---
const CartPopupContent: React.FC<CartPopupContentProps> = ({ onLinkClick }) => {
  const items = useCartStore((state) => state.items);
  const itemCount = useCartStore((state) => state.getItemCount());
  const cartTotal = useCartStore((state) => state.getCartTotal());

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const itemsToShow = items.slice(0, 3);

  if (!isHydrated) {
    return (
      <div className="p-6 text-sm text-center text-muted-foreground min-w-[300px] sm:min-w-[360px]">
        <Loader2 className="animate-spin mx-auto h-6 w-6" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-0 text-sm bg-popover text-popover-foreground min-w-[300px] sm:min-w-[360px] max-w-md", // Širší min-width
        "flex flex-col h-full overflow-hidden" // Zabraňuje pretečeniu obsahu
      )}
    >
      {/* Hlavička */}
      <div className="px-4 sm:px-6 py-4 border-b border-border flex justify-between items-center flex-shrink-0">
        <h4 className="font-semibold text-base text-foreground">
          Nákupný košík
        </h4>
        {/* Tlačidlo Zavrieť pre Popup (nie Sheet) - voliteľné */}
        {/* <Button variant="ghost" size="icon" onClick={onLinkClick} className="h-7 w-7 text-muted-foreground"><X size={16} /></Button> */}
      </div>

      {/* Obsah */}
      {itemCount > 0 ? (
        <>
          {/* Zoznam položiek */}
          <ScrollArea className="flex-grow px-4 sm:px-6">
            {" "}
            {/* Odsadenie obsahu */}
            <div className="divide-y divide-border">
              {itemsToShow.map((item) => (
                <CartItemDisplay key={item.variantId} item={item} />
              ))}
            </div>
            {items.length > itemsToShow.length && (
              <p className="text-xs text-muted-foreground text-center pt-3 pb-1">
                A ďalších {items.length - itemsToShow.length}{" "}
                {items.length - itemsToShow.length === 1
                  ? "položka"
                  : "položiek"}
                ...
              </p>
            )}
          </ScrollArea>

          {/* Pätička */}
          <div className="px-4 sm:px-6 py-4 mt-auto border-t border-border space-y-4 flex-shrink-0 bg-popover">
            {" "}
            {/* bg-popover pre istotu prekrytia */}
            <div className="flex items-center justify-between text-base">
              <span className="font-medium text-muted-foreground">Celkom:</span>
              <span className="font-bold text-lg text-foreground">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <Link href="/kosik" onClick={onLinkClick} legacyBehavior>
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-red-700 dark:hover:bg-red-800 dark:text-white h-11 text-base"
              >
                Zobraziť košík
              </Button>
            </Link>
          </div>
        </>
      ) : (
        // Prázdny košík
        <div className="flex-grow flex flex-col items-center justify-center px-6 py-10 text-center">
          <ShoppingCart size={48} className="text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Váš košík je prázdny.</p>
          <Link href="/produkty" onClick={onLinkClick} legacyBehavior>
            <Button variant="outline" size="sm" className="mt-6">
              Pokračovať v nákupe
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPopupContent;
