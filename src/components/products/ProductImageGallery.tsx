// src/components/products/ProductImageGallery.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
    productName: string;
    mainImage: string;
    setMainImage: (url: string) => void;
    allImages: { url: string; alt: string }[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    productName,
    mainImage,
    setMainImage,
    allImages
}) => {
    const uniqueThumbnails = Array.from(new Map(allImages.map(img => [img.url, img])).values());

    return (
        <div className="space-y-4">
             {/* Hlavný obrázok */}
            <div className="aspect-square bg-neutral-100 dark:bg-card dark:border dark:border-border rounded-xl overflow-hidden shadow-lg relative">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={mainImage}
                        initial={{ opacity: 0.5, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.5, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={mainImage}
                            alt={productName}
                            fill
                            sizes="(max-width: 1024px) 90vw, 50vw"
                            className="object-contain p-4 md:p-6"
                            priority
                        />
                    </motion.div>
                 </AnimatePresence>
            </div>

            {/* Miniatúry */}
            {uniqueThumbnails.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent rounded-md">
                    {uniqueThumbnails.map((img, idx) => (
                        <button
                            key={img.url + idx}
                            className={cn(
                                "flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary relative",
                                img.url === mainImage
                                    ? 'border-primary opacity-100 ring-1 ring-primary'
                                    : 'border-border hover:border-muted-foreground/50 opacity-70 hover:opacity-100'
                            )}
                            onClick={() => setMainImage(img.url)}
                            aria-label={`Zobraziť obrázok ${idx + 1}: ${img.alt}`}
                        >
                            <Image
                                src={img.url}
                                alt={img.alt}
                                width={80} height={80}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ProductImageGallery;
