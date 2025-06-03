"use client";

import React from "react";
import type { Product } from "@/payload-types"; // Typ podľa tvojho Payloadu
import RichText from "@/components/RichText"; // Tvoj komponent na renderovanie RichText obsahu
import { cn } from "@/lib/utils";

interface ProductInfoSectionProps {
  longDescription?: Product['longDescription'] | null;
}

const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({ longDescription }) => {
  return (
    <div
      id="rich-text-content"
      className={cn(
        "prose prose-lg max-w-screen-2xl px-4 lg:px-0 mx-auto", // základné prose štýly
        "prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80",
        "prose-strong:text-foreground prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:text-muted-foreground",
        "prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        "prose-li:marker:text-primary",
        "dark:prose-invert"
      )}
    >
      {longDescription ? (
        <RichText content={longDescription} />
      ) : (
        <p className="text-muted-foreground italic">Podrobný popis nie je k dispozícii.</p>
      )}
    </div>
  );
};

export default ProductInfoSection;
