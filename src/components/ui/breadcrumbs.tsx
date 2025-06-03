// src/components/ui/breadcrumbs.tsx
"use client";

import React, { Fragment } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react'; // Ikona pre domovskú stránku
import { cn } from '@/lib/utils';

// Typ pre položku
interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean; // Posledná položka
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string; // Pre dodatočné štýly
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  // Ak nie sú položky, nerenderuj nič
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1"> {/* Použitie gap pre medzery */}
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <li key={item.href + index} className="flex items-center">
              {/* Separátor (lomka) pred položkou (okrem prvej) */}
              {!isFirst && (
                <span className="mx-1.5 text-muted-foreground/60" aria-hidden="true">
                  /
                </span>
              )}

              {/* Odkaz alebo text položky */}
              <div className="flex items-center gap-1.5"> {/* Kontajner pre ikonu a text */}
                {/* Ikona Home pre prvú položku, ak je to root link */}
                {isFirst && item.href === '/' && (
                  <Home className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                )}

                {/* Aktívna položka (posledná) */}
                {isLast || item.isActive ? (
                  <span
                    className="font-semibold text-foreground" // Zvýraznená aktívna položka
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  // Klikateľný odkaz pre neaktívne položky
                  <Link
                    href={item.href}
                    className={cn(
                      "text-muted-foreground", // Základná farba pre odkazy
                      "hover:text-foreground hover:underline", // Hover efekt
                      "transition-colors duration-150 ease-in-out", // Plynulý prechod
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-[2px]" // Jemný focus ring
                    )}
                  >
                    {/* Skryť 'Domov' text, ak je tam ikona? Voliteľné */}
                    {/* {isFirst && item.href === '/' ? <span className="sr-only">{item.label}</span> : item.label} */}
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
