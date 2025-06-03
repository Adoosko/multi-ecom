// src/components/categories/CategoryCard.tsx
"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// Definícia typu pre kategóriu (môže byť importovaná z centrálneho miesta)
interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  image?: {
    url?: string | null;
  } | null;
  // Pridaj ďalšie polia podľa potreby z Payload CMS
}

interface CategoryCardProps {
  category: Category;
}

// Helper funkcia na získanie URL obrázku alebo fallbacku
const getImageUrl = (category: Category): string => {
  if (typeof category.image === 'object' && category.image?.url) {
    return category.image.url;
  }
  // Fallback obrázok, ak nie je definovaný v CMS
  return `/images/category-fallback.jpg`; // Vytvor si všeobecný fallback obrázok
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const targetRef = useRef<HTMLAnchorElement>(null);

  // useScroll sleduje scroll progress elementu vo viewporte
  const { scrollYProgress } = useScroll({
    target: targetRef,
    // Animácia začne, keď vrch elementu dosiahne spodok viewportu
    // a skončí, keď spodok elementu opustí vrch viewportu
    offset: ["start end", "end start"]
  });

  // useTransform mapuje scroll progress (0 až 1) na Y posun obrázku
  // Obrázok sa posunie od -20% do +20% svojej výšky počas scrollovania cez kartu
  // Výsledkom je, že obrázok sa pohybuje pomalšie ako karta = parallax efekt
  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']); // Môžeš experimentovať s týmito hodnotami

  const imageUrl = getImageUrl(category);
  const categoryColor = category.color || '#f97316'; // Default farba (oranžová)

  return (
    <Link
      ref={targetRef}
      key={category.id}
      href={`/categories/${category.slug}`}
      className="group block relative rounded-xl overflow-hidden shadow-lg h-80 border border-gray-200/50 hover:shadow-xl transition-shadow duration-300 ease-in-out"
    >
      {/* Kontejner pre obrázok s parallaxom */}
      {/* Musí byť overflow-hidden a position relative pre vnútorný motion.div */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        {/* Tento div sa bude pohybovať vertikálne */}
        <motion.div
          className="absolute inset-0 h-[140%] top-[-20%]" // Vyšší ako kontajner a posunutý hore, aby bolo kam scrollovať
          style={{ y }} // Aplikujeme transformovaný Y posun
        >
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover" // Zachová pomer strán a oreže
            priority={false} // Nastav na true pre prvé obrázky "above the fold"
            quality={75} // Optimalizácia kvality
          />
        </motion.div>
      </div>

      {/* Overlay pre stmavenie a lepší kontrast textu */}
      <div
        className="absolute inset-0 opacity-50 group-hover:opacity-60 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.7) 100%)` // Jemnejší gradient
        }}
      ></div>

      {/* Obsah kategórie */}
      <div className="absolute inset-x-0 bottom-0 p-6 text-white z-10"> {/* z-10 aby bol nad overlayom */}
        {/* Dekoratívna linka */}
        <div
          className="w-12 h-1 mb-3 rounded-full"
          style={{ backgroundColor: categoryColor }}
        ></div>
        <h3 className="text-2xl font-bold mb-2 drop-shadow-md">{category.name}</h3> {/* Pridaný tieň textu */}
        <div className="flex items-center text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">
          <span>Prezrieť kategóriu</span>
          <span className="ml-2 transform group-hover:translate-x-1.5 transition-transform duration-200 ease-in-out">→</span> {/* Výraznejší posun šípky */}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
