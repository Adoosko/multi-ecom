// src/components/ui/add-to-cart-button.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button'; // ShadCN/ui Button
import { ShoppingCart, Loader2, AlertCircle } from 'lucide-react'; // Ikony
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean; // Pre zobrazenie načítavania po kliknutí
  canAddToCart: boolean; // Určuje, či je variant platný a skladom
  isVariantSelected: boolean; // Či je vybraný aspoň nejaký variant (farba/veľkosť)
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  canAddToCart,
  isVariantSelected,
  className,
}) => {
  // Určenie textu a ikony na základe stavu
  let buttonText = 'Pridať do košíka';
  let ButtonIcon = ShoppingCart;

  if (isLoading) {
    buttonText = 'Pridávam...';
    ButtonIcon = Loader2;
  } else if (!isVariantSelected) {
    buttonText = 'Vyberte variant';
    ButtonIcon = AlertCircle;
  } else if (!canAddToCart) {
    buttonText = 'Nedostupné';
    ButtonIcon = AlertCircle;
  }

  const isButtonDisabled = disabled || isLoading || !canAddToCart;

  return (
    <button
       // Väčšie tlačidlo pre hlavnú akciu
      className={cn(
        "w-full items-center flex justify-center gap-2 ", // Flex-grow, aby zabralo dostupný priestor vedľa quantity
        " rounded-full bg-red-600 hover:bg-red-700 text-primary-foreground", // Základné farby
        "dark:bg-red-600 dark:hover:bg-red-700 dark:text-white", // Špecifické pre dark mode (červená)
        "text-base font-semibold py-1 px-6 shadow-lg", // Väčší text a padding
        "transition-all duration-200 ease-in-out", // Plynulé prechody
        "hover:scale-[1.02]", // Jemné zväčšenie pri hover
        "disabled:bg-muted disabled:text-muted-foreground disabled:scale-100 disabled:cursor-not-allowed disabled:shadow-none", // Štýly pre disabled
        isLoading && "cursor-wait", // Kurzor pri načítavaní
        className
      )}
      onClick={onClick}
      disabled={isButtonDisabled} // Kombinovaný disabled stav
    >
      <ButtonIcon
        className={cn(
          " h-5 w-5",
          isLoading && "animate-spin" // Animácia pre načítavanie
        )}
      />
      <span className="hidden lg:block">{buttonText}</span>
    </button>
  );
};

export default AddToCartButton;
