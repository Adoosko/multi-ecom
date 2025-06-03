// src/app/kategorie/[categorySlug]/CategoryClientPage.tsx
"use client";

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Pre pagináciu
import type { Product, Category } from '@/payload-types';
import type { PaginatedDocs } from 'payload';

import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination'; // ShadCN Paginácia
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react'; // Ikona pre prázdny stav
import ProductCard from '@/components/ProductCard';

interface CategoryClientPageProps {
  category: Category;
  productsResult: PaginatedDocs<Product>;
  currentPage: number;
}

const CategoryClientPage: React.FC<CategoryClientPageProps> = ({
  category,
  productsResult,
  currentPage,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    docs: products,
    totalPages,
    hasNextPage,
    hasPrevPage,
    prevPage,
    nextPage
  } = productsResult;

  // --- Funkcia pre navigáciu na inú stránku ---
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) {
      return; // Nerob nič, ak je stránka neplatná alebo rovnaká
    }
    // Vytvor nový objekt searchParams
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', pageNumber.toString());

    // Získaj query string
    const search = current.toString();
    const query = search ? `?${search}` : "";

    // Naviguj na novú URL
    router.push(`${pathname}${query}`);
  };

  // --- Generovanie stránok pre pagináciu (zjednodušené) ---
  // Môže byť vylepšené pre zobrazenie len niekoľkých stránok okolo aktuálnej
  const getPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; // Maximálny počet čísel stránok na zobrazenie
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, currentPage + halfMaxPages);

    // Uprav, ak sme na začiatku alebo na konci
    if (currentPage - halfMaxPages < 1) {
        endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage + halfMaxPages > totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }


    if (startPage > 1) {
      items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`${pathname}?page=${i}`} // Použijeme Link pre SEO
            onClick={(e) => { e.preventDefault(); handlePageChange(i); }} // Ale navigujeme cez router
            isActive={i === currentPage}
            aria-current={i === currentPage ? 'page' : undefined}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
    }

    return items;
  };


  return (
    <div className="max-w-screen-xl mx-auto  px-1  lg:px-8 py-8 md:py-12">
      {/* Hlavička Kategórie */}
      <div className="mb-8 md:mb-12 border-b border-border pb-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
          {category.name}
        </h1>
        {/* Popis kategórie - RichText alebo obyčajný text */}
        {category.slug && (
          <div className="prose dark:prose-invert max-w-none text-muted-foreground text-base">
            {/* Ak je slug string: */}
            {typeof category.slug === 'string' && <p>{category.slug}</p>}
            {/* Ak je slug RichText objekt (potrebuješ RichText renderer): */}
            {/* {typeof category.slug === 'object' && <RichText content={category.slug} />} */}
          </div>
        )}
      </div>

      {/* TODO: Filtrovanie a Triedenie - Miesto pre prípadné ovládacie prvky */}
      {/* <div className="mb-6 flex justify-end"> ... </div> */}

      {/* Mriežka Produktov */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ">
          {products.map((product:Product, index:number) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        // Zobrazenie, ak nie sú žiadne produkty
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-border rounded-lg bg-muted/30">
           <AlertTriangle size={48} className="text-muted-foreground/50 mb-4" />
           <h3 className="text-xl font-semibold text-foreground mb-2">Žiadne produkty</h3>
           <p className="text-muted-foreground">V tejto kategórii sa momentálne nenachádzajú žiadne produkty.</p>
           {/* <Button variant="outline" size="sm" className="mt-6" onClick={() => router.push('/produkty')}>Zobraziť všetky produkty</Button> */}
        </div>
      )}

      {/* Paginácia */}
      {totalPages > 1 && (
        <div className="mt-12 md:mt-16 flex justify-center">
          <Pagination>
            <PaginationContent>
              {/* Predchádzajúca stránka */}
              <PaginationItem>
                <PaginationPrevious
                  href={hasPrevPage ? `${pathname}?page=${prevPage}` : '#'}
                  onClick={(e) => { e.preventDefault(); if(prevPage) handlePageChange(prevPage); }}
                  aria-disabled={!hasPrevPage}
                  tabIndex={!hasPrevPage ? -1 : undefined}
                  className={!hasPrevPage ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>

              {/* Čísla stránok */}
              {getPaginationItems()}

              {/* Nasledujúca stránka */}
              <PaginationItem>
                <PaginationNext
                  href={hasNextPage ? `${pathname}?page=${nextPage}` : '#'}
                  onClick={(e) => { e.preventDefault(); if(nextPage) handlePageChange(nextPage); }}
                  aria-disabled={!hasNextPage}
                  tabIndex={!hasNextPage ? -1 : undefined}
                  className={!hasNextPage ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default CategoryClientPage;
