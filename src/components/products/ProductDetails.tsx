// src/components/products/ProductDetails.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

import SizeSelectorDrawer from "./SizeSelectorDrawer";
import ColorSelectorTrigger from "./ColorSelectorTrigger";
import ColorSelectorDrawer from "./ColorSelectorDrawer";
import AddToCartSection from "./AddToCartSection";
import PriceDisplay from "./PriceDisplay";
import TrustSignals from "./TrustSignals";
import { cn } from "@/lib/utils";
import type { Product, Manufacturer } from "@/payload-types";
import type { ClientColorVariant, SelectedSize } from "@/app/(app)/products/[slug]/ProductClientPage";
import SizeSelectorTrigger from "./SizeSelector";
import { RotateCw, ShieldCheck, Truck } from "lucide-react";

// Props definícia
interface ProductDetailsProps {
  product: Product;
  colorOptions: ClientColorVariant[];
  availableSizes: SelectedSize[];
  selectedColor: string | null;
  selectedSize: string | null;
  quantity: number;
  isLoadingCart?: boolean;
  currentStock: number;
  canAddToCart: boolean;
  onColorChange: (color: string | null) => void;
  onSizeChange: (size: string | null) => void;
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  colorOptions,
  availableSizes,
  selectedColor,
  selectedSize,
  quantity,
  isLoadingCart,
  currentStock,
  canAddToCart,
  onColorChange,
  onSizeChange,
  onQuantityChange,
  onAddToCart,
}) => {
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);
  const [isColorDrawerOpen, setIsColorDrawerOpen] = useState(false);

  // Najdi aktuálne vybraný farebný variant (kvôli swatchu)
  const selectedColorVariant = colorOptions.find(
    (c) => c.color === selectedColor
  );

  // Trust signals
  const trustSignalsData = [
    { id: "returns", icon: RotateCw, text: "Garancia vrátenia 30 dní" },
    { id: "shipping", icon: Truck, text: "Doprava od 3,99 €" },
    { id: "payment", icon: ShieldCheck, text: "Bezpečné platby" },
  ];

  // Výrobca (ak je načítaný s depth >= 1)
  const manufacturer =
    typeof product.manufacturer === "object" && product.manufacturer !== null
      ? (product.manufacturer.value as Manufacturer)
      : null;

  // DPH sadzba
  const vatRate = 0.23;

  // Výber variantu je platný ak je vybraná farba aj veľkosť
  const isVariantSelected = !!(selectedColor && selectedSize);

  // Wishlist handler (prispôsob podľa projektu)
  const handleAddToWishlist = () => {
    console.log("TODO: Add to wishlist");
  };

  // Handler pre potvrdenie veľkosti v draweri
  const handleConfirmSize = (confirmedSize: string | null) => {
    onSizeChange(confirmedSize);
  };

  // Handler pre potvrdenie farby v draweri
  const handleConfirmColor = (color: string | null) => {
    onColorChange(color);
  };

  return (
    <div className="space-y-6 md:space-y-8 text-foreground">
      {/* Sekcia: Značka, Názov, SKU */}
      <div>
        {manufacturer && (
          <Link
            href={`/vyrobca/${manufacturer.name || "#"}`}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-block"
          >
            {manufacturer.name}
          </Link>
        )}
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {product.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {product.sku && <span>SKU: {product.sku}</span>}
        </div>
      </div>

      {/* Sekcia: Cena */}
      <PriceDisplay
        priceWithVat={product.price}
        originalPriceWithVat={product.originalPrice}
        vatRate={vatRate}
      />

      {/* Sekcia: Krátky popis */}
      {product.shortDescription && (
        <p className="text-base text-muted-foreground leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      <div className="flex gap-3 lg:flex-row">
        {/* === Výber Farby === */}
        <div className="flex-1">
          <ColorSelectorTrigger
            selectedColor={selectedColor}
            selectedColorCode={selectedColorVariant?.colorCode}
            onClick={() => setIsColorDrawerOpen(true)}
            disabled={colorOptions.length === 0}
          />
          <ColorSelectorDrawer
            isOpen={isColorDrawerOpen}
            onOpenChange={setIsColorDrawerOpen}
            availableColors={colorOptions}
            selectedColor={selectedColor}
            onConfirm={(color) => {
              handleConfirmColor(color);
              setIsColorDrawerOpen(false);
            }}
          />
        </div>

        {/* === Výber Veľkosti === */}
        <div className="flex-1">
          {selectedColor && (
            <>
              <SizeSelectorTrigger
                currentStock={currentStock}
                selectedSize={selectedSize}
                onClick={() => setIsSizeDrawerOpen(true)}
                disabled={availableSizes.length === 0}
              />
              <SizeSelectorDrawer
                isOpen={isSizeDrawerOpen}
                onOpenChange={setIsSizeDrawerOpen}
                availableSizes={availableSizes}
                selectedSize={selectedSize}
                onConfirm={handleConfirmSize}
              />
            </>
          )}
        </div>
      </div>

      {/* === Množstvo & Pridanie do košíka === */}
      {selectedColor && (
        <AddToCartSection
          quantity={quantity}
          currentStock={currentStock}
          canAddToCart={canAddToCart}
          isVariantSelected={isVariantSelected}
          onQuantityChange={onQuantityChange}
          onAddToCart={onAddToCart}
          isLoading={isLoadingCart}
          onAddToWishlist={handleAddToWishlist}
        />
      )}

      {/* === Trust Signals === */}
      <TrustSignals signals={trustSignalsData} />
    </div>
  );
};

export default ProductDetails;
