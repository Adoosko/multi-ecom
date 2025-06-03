/* eslint-disable */
// src/components/products/AddToCartSection.tsx
"use client";

import React from "react";

import AddToCartButton from "@/components/ui/add-to-cart-button"; // Import tlačidla
import QuantitySelector from "@/components/ui/quantity-selector"; // Import selectoru
import { cn } from "@/lib/utils";

interface AddToCartSectionProps {
  quantity: number;
  currentStock: number;
  canAddToCart: boolean;
  isVariantSelected: boolean;
  isLoadingCart?: boolean; // <-- Nový prop
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
  isLoading?: boolean;
  onAddToWishlist?: () => void;
  className?: string;
}

const AddToCartSection: React.FC<AddToCartSectionProps> = ({
  quantity,
  currentStock,
  canAddToCart,
  isVariantSelected,
  onQuantityChange,
  onAddToCart,
  isLoading = false,
  onAddToWishlist,
  className,
}) => {
  return (
    // Hlavný kontajner sekcie
    <div
      className={cn(
        " ", // Horný oddeľovač
        className
      )}
    >
      {/* === Responzívny Flex Kontajner === */}
      {/*
        - `flex`: Základný flex layout.
        - `flex-col sm:flex-row`: Na mobiloch pod sebou, na tabletoch a väčších vedľa seba.
        - `items-stretch sm:items-center`: Na mobiloch sa roztiahnu na šírku, inak centrujú vertikálne.
        - `gap-3 sm:gap-4`: Medzery medzi prvkami.
      */}
      <div className="grid grid-cols-2 gap-3  ">
        {/* Quantity Selector */}
        <QuantitySelector
          quantity={quantity}
          minQuantity={1}
          maxQuantity={currentStock}
          onChange={onQuantityChange}
          // Deaktivujeme, ak nie je vybraný variant alebo nie je skladom
          disabled={!isVariantSelected || currentStock <= 0}
          // Na mobiloch bude mať plnú šírku (default pre flex-col),
          // na väčších obrazovkách sa nezväčšuje (`sm:flex-shrink-0`)
          className=" " // Explicitná výška pre konzistenciu
        />

        {/* Add To Cart Button */}
        <AddToCartButton
          onClick={onAddToCart}
          isLoading={isLoading}
          canAddToCart={canAddToCart}
          isVariantSelected={isVariantSelected}
          // Na mobiloch plná šírka, na väčších `flex-grow`
          className="w-full  " // Explicitná výška
        />

        {/* Wishlist Button (Voliteľné) */}
        {/* {onAddToWishlist && (
          <Button
            variant="outline"
            size="icon"
            className="border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground w-full sm:w-11 h-11 flex-shrink-0" // Na mobile plná šírka, inak fixná
            onClick={onAddToWishlist}
            aria-label="Pridať do zoznamu želaní"
          >
            <Heart size={20} />
          </Button>
        )} */}
      </div>
      {/* === Koniec Responzívneho Kontajnera === */}
    </div>
  );
};

export default AddToCartSection;
