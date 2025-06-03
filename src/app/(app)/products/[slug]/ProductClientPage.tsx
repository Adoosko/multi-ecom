// src/app/(app)/produkty/[slug]/ProductClientPage.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Product, Media, Category, Manufacturer } from '@/payload-types';
import { motion, Variants } from 'framer-motion';

// Import čiastkových komponentov
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductDetails from '@/components/products/ProductDetails';
import ProductInfoSection from '@/components/products/ProductInfoSection';
import { useCartStore } from '@/store/cartStore'; // <-- Importuj hook pre store
import type { CartItem } from '@/store/cartStore'; // <-- Importuj typ CartItem
// import RelatedProducts from '@/components/products/RelatedProducts';
import { Breadcrumbs } from '@/components/ui/breadcrumbs'; // Predpokladáme UI komponent
import { toast } from 'sonner';

// Klientský typ pre FAREBNÝ variant
export interface ClientColorVariant {
    id: string | null;
    color: string;
    colorCode: string | null;
    image: { url: string; alt?: string | null } | null;
    sizes: Array<SelectedSize>; // Použijeme typ SelectedSize
}

// Klientský typ pre VEĽKOSTNÝ variant (pre stav a props)
export interface SelectedSize {
    id: string | null;
    size: string;
    sku: string | null;
    stock: number;
}

// Props pre hlavný klientský komponent
interface ProductClientPageProps {
  product: Product; // Už by nemal byť null
  relatedProducts: Product[];
}

const ProductClientPage: React.FC<ProductClientPageProps> = ({ product, relatedProducts }) => {
  // --- Správa Stavov ---
  const [selectedColorVariant, setSelectedColorVariant] = useState<ClientColorVariant | null>(null);
  const [selectedSizeVariant, setSelectedSizeVariant] = useState<SelectedSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Stav 
  const addItem = useCartStore((state) => state.addItem);

  // --- Memoizované Dáta ---
  const colorVariants = useMemo((): ClientColorVariant[] => {
      if (!product?.colorVariants || product.colorVariants.length === 0) return [];
      return product.colorVariants.map(cv => {
          const colorImage = (typeof cv.image === 'object' && cv.image !== null) ? cv.image as Media : null;
          return {
            id: cv.id || null,
            color: cv.color || 'Neznáma',
            colorCode: cv.colorCode || null,
            image: colorImage ? { url: colorImage.url!, alt: colorImage.alt } : null,
            sizes: (cv.sizes || [])
                .map(s => ({
                    id: s.id || null,
                    size: s.size || 'Univerzálna',
                    sku: s.sku || null,
                    stock: typeof s.stock === 'number' ? s.stock : 0,
                }))
                // Zoradíme veľkosti v rámci farby (môžeš upraviť logiku radenia)
                .sort((a, b) => a.size.localeCompare(b.size, undefined, { numeric: true, sensitivity: 'base' })),
          };
      });
  }, [product.colorVariants]);

  const availableSizes = useMemo((): SelectedSize[] => {
    return selectedColorVariant?.sizes || [];
  }, [selectedColorVariant]);

   const galleryImages = useMemo(() => {
      const imagesSet = new Map<string, { url: string; alt: string }>();
      const addImage = (imgData: Media | null | undefined, defaultAlt: string) => {
          const img = (typeof imgData === 'object' && imgData !== null) ? imgData : null;
          if (img?.url && !imagesSet.has(img.url)) {
              imagesSet.set(img.url, { url: img.url, alt: img.alt || defaultAlt });
          }
      };
      addImage(product.featuredImage as Media | null, product.title ?? 'Produkt');
      colorVariants.forEach(cv => addImage(cv.image as Media | null, `${product.title} - ${cv.color}`));
      (product.images || []).forEach(imgItem => addImage(imgItem.image as Media | null, imgItem.alt || product.title || 'Produkt'));
      return Array.from(imagesSet.values());
   }, [product.featuredImage, product.images, product.title, colorVariants]);

  // --- Efekty ---
  useEffect(() => {
    const initialColorVariant = colorVariants[0];
    setSelectedColorVariant(initialColorVariant || null);
    setMainImage(initialColorVariant?.image?.url || galleryImages[0]?.url || '/placeholder.png');
  }, [colorVariants, galleryImages]);

  useEffect(() => {
      setSelectedSizeVariant(null);
      setQuantity(1);
      if (selectedColorVariant) {
          const firstAvailableSize = selectedColorVariant.sizes.find(s => s.stock > 0);
          setSelectedSizeVariant(firstAvailableSize || null); // Nastav prvú dostupnú alebo null
          setMainImage(selectedColorVariant.image?.url || galleryImages[0]?.url || '/placeholder.png');
      } else {
          setSelectedSizeVariant(null);
          setMainImage(galleryImages[0]?.url || '/placeholder.png');
      }
  }, [selectedColorVariant, galleryImages]); // Závislosť len na zmene farby a obrázkoch

  // --- Handlers ---
  const handleColorChange = (colorName: string | null) => {
      const newColorVariant = colorVariants.find(cv => cv.color === colorName) || null;
      if (newColorVariant !== selectedColorVariant) { // Zmena len ak je iná farba
          setSelectedColorVariant(newColorVariant);
      }
  };

  const handleSizeChange = (sizeName: string | null) => {
      const newSizeVariant = availableSizes.find(s => s.size === sizeName) || null;
      if (newSizeVariant !== selectedSizeVariant) { // Zmena len ak je iná veľkosť
         setSelectedSizeVariant(newSizeVariant);
         setQuantity(1); // Reset quantity on size change
      }
  };

  const handleQuantityChange = (newQuantity: number) => {
      const stock = selectedSizeVariant?.stock ?? 0;
      const validatedQuantity = isNaN(newQuantity) ? 1 : Math.max(1, Math.min(newQuantity, stock > 0 ? stock : 1));
      setQuantity(validatedQuantity);
  };

  const handleAddToCart = () => {
    if (!selectedColorVariant || !selectedSizeVariant || !selectedSizeVariant.id) {
        toast.error("Prosím, vyberte farbu a veľkosť.");
        console.error("Nebol vybraný kompletný variant alebo chýba ID veľkosti.");
        return;
    }
    if (selectedSizeVariant.stock < quantity) {
        toast.error("Požadované množstvo nie je na sklade.");
        console.error("Nedostatočné množstvo na sklade.");
        return;
    }
    if (isAddingToCart) return; // Zabránenie dvojkliku

    setIsAddingToCart(true); // Začni načítavanie

    // Získanie URL obrázka (variant, farba, produkt, fallback)
    const imageUrl = selectedColorVariant.image?.url
                    || (typeof product.featuredImage === 'object' && product.featuredImage?.url)
                    || galleryImages[0]?.url
                    || null;

    // Vytvorenie objektu CartItem
    const itemToAdd: CartItem = {
        productId: product.id,
        variantId: selectedSizeVariant.id, // Použijeme ID z objektu veľkosti!
        quantity: quantity,
        title: product.title ?? 'Produkt',
        color: selectedColorVariant.color,
        size: selectedSizeVariant.size,
        sku: selectedSizeVariant.sku,
        price: product.price ?? 0, // Predpokladáme, že product.price je cena za kus s DPH
        image: imageUrl,
    };

    try {
      addItem(itemToAdd);
    
      toast.success(
        <div className="flex items-center gap-3">
          {/* Obrázok produktu */}
          <div className="flex-shrink-0 rounded-full border border-border bg-background w-12 h-12 flex items-center justify-center overflow-hidden shadow-sm">
            <img
              src={itemToAdd.image || "/images/placeholder.png"}
              alt={itemToAdd.title}
              className="object-contain w-10 h-10"
              loading="lazy"
            />
          </div>
          {/* Info */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="font-semibold truncate text-foreground">{itemToAdd.title}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {/* Swatch pre farbu */}
              {itemToAdd.color && (
                <span className="flex items-center gap-1">
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-border"
                    style={{
                      background: selectedColorVariant?.colorCode || selectedColorVariant?.color || "#eee",
                    }}
                    aria-label={itemToAdd.color}
                  />
                </span>
              )}
              {/* Badge pre veľkosť */}
              {itemToAdd.size && (
                <span className="inline-block px-2 py-0.5 rounded bg-accent text-xs font-bold text-accent-foreground border border-accent">
                  {itemToAdd.size}
                </span>
              )}
              {/* Množstvo */}
              <span className="ml-2 text-xs text-muted-foreground/70">× {itemToAdd.quantity}</span>
            </div>
          </div>
        </div>,
        {
          description: (
            <span className="text-xs text-muted-foreground">
              Pridané do košíka
            </span>
          ),
          duration: 3500,
          className: "border border-border shadow-lg rounded-xl bg-popover text-popover-foreground",
          icon: null, // žiadna extra ikonka, obrázok je dosť výrazný
        }
      );
    } catch (error) {
      toast.error("Chyba pri pridávaní do košíka.", {
        description: "Skúste to znova alebo kontaktujte podporu.",
        duration: 5000,
      });
    }
    finally {
        setIsAddingToCart(false); // Ukonči načítavanie
    }
};
  // --- Vypočítané hodnoty ---
  const currentStock = selectedSizeVariant?.stock ?? 0;
  const canAddToCart = !!selectedColorVariant && !!selectedSizeVariant && currentStock > 0 && quantity <= currentStock;

  // --- Breadcrumbs ---
  const category = (typeof product.category === 'object' && product.category !== null) ? product.category as Category : null;
  const breadcrumbItems = [
    { label: 'Domov', href: '/' },
    { label: 'Produkty', href: '/products' },
    ...(category ? [{ label: category.name ?? 'Kategória', href: `/categories/${category.slug ?? '#'}` }] : []),
    { label: product.title ?? 'Produkt', href: `/products/${product.slug ?? '#'}`, isActive: true },
  ];

  // --- Animácie ---
  const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }, };
  const fadeInItem: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }, };

  return (
    <motion.div
      className="bg-background mt-24 text-foreground min-h-screen"
      variants={staggerContainer} initial="hidden" animate="visible"
    >
       <motion.div variants={fadeInItem} className="py-4 border-b border-border">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
       </motion.div>
      <div className="max-w-screen-xl mx-auto px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pt-12 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div variants={fadeInItem} className="lg:sticky lg:top-[calc(var(--header-height,64px)+1.5rem)]">
            <ProductImageGallery
              productName={product.title ?? 'Produkt'}
              mainImage={mainImage || '/placeholder.png'}
              setMainImage={setMainImage}
              allImages={galleryImages}
            />
          </motion.div>
          <motion.div variants={fadeInItem} className="space-y-6">
            <ProductDetails
              product={product}
              colorOptions={colorVariants}
              availableSizes={availableSizes} // Už prefiltrované veľkosti
              selectedColor={selectedColorVariant?.color || null}
              selectedSize={selectedSizeVariant?.size || null}
              quantity={quantity}
              currentStock={currentStock} // Aktuálny sklad vybranej veľkosti
              canAddToCart={canAddToCart}
              onColorChange={handleColorChange}
              onSizeChange={handleSizeChange}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
            />
          </motion.div>
        </div>
        <motion.div variants={fadeInItem} className="mt-16 lg:mt-24 mx-auto max-w-4xl">
          <ProductInfoSection
            longDescription={product.longDescription}
            // specifications={product.specifications}
          />
        </motion.div>
        {/* {relatedProducts.length > 0 && (
          <motion.div variants={fadeInItem} className="mt-16 lg:mt-24">
            <RelatedProducts products={relatedProducts} />
          </motion.div>
        )} */}
      </div>
    </motion.div>
  );
};
export default ProductClientPage;
