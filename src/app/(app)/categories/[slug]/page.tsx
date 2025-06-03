import type { Category, Product } from "@/payload-types"; // Payload typy
import config from "@payload-config"; // Alias pre payload.config.ts
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload, PaginatedDocs } from "payload";

import { Breadcrumbs } from "@/components/ui/breadcrumbs"; // Breadcrumbs
import CategoryClientPage from "./CategoriesClientPage";

// Typy pre parametre stránky (updated for Next.js 15)
interface CategoryPageParams {
  params: Promise<{ slug: string }>; // Changed to Promise
  searchParams: Promise<{
    // Changed to Promise
    page?: string; // Parameter pre číslo stránky
    // Tu môžu byť ďalšie parametre pre sortovanie, filtrovanie...
  }>;
}

// --- Generovanie Metadát (updated for Next.js 15) ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // Await the params
  const payload = await getPayload({ config });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteName = "Pyroshop.sk";

  try {
    const { docs: categories } = await payload.find({
      collection: "categories",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0, // Pre metadáta nepotrebujeme hĺbku
    });

    const category = categories[0] as Category | null;

    if (!category) {
      return { title: "Kategória nenájdená" };
    }

    const metadataTitle = category.name ?? "Kategória";
    // Použijeme description z kategórie, ak existuje, inak fallback
    const metadataDescription =
      category.slug ?? `Prehľad produktov v kategórii ${category.name}`;
    // TODO: Pridať obrázok kategórie pre OG/Twitter, ak existuje

    return {
      title: `${metadataTitle} | ${siteName}`,
      description:
        typeof metadataDescription === "string" ? metadataDescription : "", // RichText by potreboval konverziu na string
      openGraph: {
        title: metadataTitle,
        description:
          typeof metadataDescription === "string" ? metadataDescription : "",
        type: "website",
        url: `${siteUrl}/categories/${slug}`,
        siteName: siteName,
        // images: category.image ? [{ url: getImageUrl(category.image) }] : undefined,
      },
      twitter: {
        card: "summary", // alebo summary_large_image ak má kategória obrázok
        title: metadataTitle,
        description:
          typeof metadataDescription === "string" ? metadataDescription : "",
        // images: category.image ? [getImageUrl(category.image)] : undefined,
      },
      alternates: {
        canonical: `${siteUrl}/categories/${slug}`,
      },
    };
  } catch (error) {
    console.error("Category Metadata Error:", error);
    return { title: "Kategória Produktov" };
  }
}

// --- Hlavný Server Component Stránky (updated for Next.js 15) ---
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageParams) {
  const { slug } = await params; // Await the params
  const searchParamsResolved = await searchParams; // Await the searchParams
  const payload = await getPayload({ config });

  // --- Fetchovanie Kategórie ---
  let category: Category | null = null;
  try {
    const { docs: categories } = await payload.find({
      collection: "categories",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1, // Hĺbka 1 pre prípadné dáta ako obrázok kategórie
    });
    category = categories[0] ?? null;
  } catch (error) {
    console.error("Error fetching category:", error);
    // notFound() sa zavolá nižšie, ak kategória nebola nájdená
  }

  // Ak kategória neexistuje, zobraz 404
  if (!category) {
    notFound();
  }

  // --- Fetchovanie Produktov (s pagináciou) ---
  const page = parseInt(searchParamsResolved.page || "1", 10); // Use awaited searchParams
  const limit = 12; // Počet produktov na stránku (môže byť konfigurovateľné)

  let productsResult: PaginatedDocs<Product> | null = null;
  try {
    productsResult = await payload.find({
      collection: "products",
      where: {
        // Filter podľa ID kategórie
        // Názov poľa 'category' musí zodpovedať názvu relationship poľa v kolekcii 'products'
        category: { equals: category.id },
        // Zobraz len publikované produkty
        status: { equals: "published" },
        // Tu môžeš pridať ďalšie filtre na základe searchParams
      },
      limit: limit,
      page: page,
      depth: 1, // Hĺbka 1 pre obrázok, cenu atď. pre ProductCard
      sort: "-publishDate", // Príklad triedenia (najnovšie) - uprav podľa potreby
    });
  } catch (error) {
    console.error("Error fetching products for category:", error);
    // Môžeme zobraziť chybu alebo pokračovať s prázdnymi produktmi
    productsResult = {
      // Vytvoríme fallback štruktúru
      docs: [],
      totalDocs: 0,
      limit: limit,
      totalPages: 0,
      page: page,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };
  }

  // --- Príprava dát pre Breadcrumbs ---
  const breadcrumbItems = [
    { label: "Domov", href: "/" },
    { label: "Kategórie", href: "/kategorie" }, // Predpokladáme stránku so zoznamom kategórií
    {
      label: category.name ?? "Kategória",
      href: `/kategorie/${category.slug}`,
      isActive: true,
    },
  ];

  // --- Renderovanie Klientského Komponentu s Dátami ---
  return (
    <div className="bg-background  text-foreground min-h-screen">
      {/* Hlavička s Breadcrumbs (ak nie je globálna) */}
      <div className="border-b mt-24 border-border">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Hlavný obsah delegovaný na klientský komponent */}
      <CategoryClientPage
        category={category}
        productsResult={productsResult} // Odovzdáme výsledky paginácie
        currentPage={page} // Odovzdáme aktuálnu stránku
      />
      {/* Tu môže byť pätička */}
    </div>
  );
}
