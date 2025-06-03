import React from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import type { Product, Media, Manufacturer, Category } from '@/payload-types'; // Importuj viac typov
import ProductClientPage from './ProductClientPage';

interface ProductPageParams { params: { slug: string }; }
const revalidate=0
export async function generateMetadata({ params }: ProductPageParams): Promise<Metadata> {
  const { slug } = params;
  const payload = await getPayload({ config });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Default URL
  const siteName = 'Pyroshop.sk'; // Názov tvojho obchodu

  try {
    const { docs } = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      depth: 2, // Depth 2 pre SEO obrázok, featured image
      limit: 1,
    });
    const product = docs[0] as Product | null;
    if (!product) return { title: 'Produkt Nenájdený' };

    // Získanie URL obrázka pre OG/Twitter
    const getImageUrl = (imageField: Product['seo']| Product['featuredImage']): string | undefined => {
        if (typeof imageField === 'object' && imageField !== null && 'url' in imageField && imageField.url) {
            // Ak je URL relatívna, pridaj base URL
            return imageField.url.startsWith('/') ? `${siteUrl}${imageField.url}` : imageField.url;
        }
        return undefined;
    };

    const ogImageUrl = getImageUrl(product.seo?.metaImage) ?? getImageUrl(product.featuredImage);

    const metadataTitle = product.seo?.metaTitle || product.title;
    const metadataDescription = product.seo?.metaDescription || product.shortDescription || ''; // Fallback na prázdny string

    return {
      title: metadataTitle,
      description: metadataDescription,
      openGraph: {
        title: metadataTitle,
        description: metadataDescription,
        // === OPRAVA: Použi platný typ ===
        type: 'website', // Najbezpečnejší typ pre produkt
        url: `${siteUrl}/produkty/${product.slug}`, // Kanonická URL stránky
        siteName: siteName,
        ...(ogImageUrl && { images: [{ url: ogImageUrl }] }), // Pridaj obrázok, len ak existuje
        // Prípadné ďalšie OG tagy špecifické pre produkt (ak to platformy podporujú)
        // 'product:price:amount': product.price?.toString(),
        // 'product:price:currency': 'EUR',
      },
      twitter: {
        card: ogImageUrl ? 'summary_large_image' : 'summary', // Typ karty podľa obrázka
        title: metadataTitle,
        description: metadataDescription,
        ...(ogImageUrl && { images: [ogImageUrl] }),
        // creator: '@tvojTwitterHandle', // Voliteľné
      },
      // Pridaj aj kanonický odkaz pre SEO
      alternates: {
        canonical: `${siteUrl}/produkty/${product.slug}`,
      },
    };
  } catch (error) {
    console.error("[Metadata Error]", error);
    return { title: 'Produkt' };
  }
}

export default async function ProductPage({ params }: ProductPageParams) {
  const { slug } = params;
  const payload = await getPayload({ config });
  try {
    const { docs } = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      depth: 2, // Potrebujeme depth 2 pre kategóriu, výrobcu, obrázky variantov atď.
      limit: 1,
    });
    const product = docs[0] as Product | null;
    if (!product) notFound();

    let relatedProductsData: Product[] = [];
    if (product.relatedProducts && product.relatedProducts.length > 0) {
      const relatedIds = product.relatedProducts.map(rel => typeof rel === 'object' && rel !== null ? rel.id : rel).filter(Boolean); // Získaj ID a odfiltruj null/undefined
      if (relatedIds.length > 0) {
          const { docs: relatedDocs } = await payload.find({
            collection: 'products',
            where: { id: { in: relatedIds }, status: { equals: 'published' } },
            limit: 4, depth: 1, // Stačí menšia hĺbka
          });
          relatedProductsData = relatedDocs as Product[];
      }
    }

    // Odovzdáme NAJDENÝ produkt (nie null) do klientského komponentu
    return <ProductClientPage product={product} relatedProducts={relatedProductsData} />;
  } catch (error) {
    console.error(`[Product Fetch Error] Slug: "${slug}"`, error);
    notFound();
  }
}
