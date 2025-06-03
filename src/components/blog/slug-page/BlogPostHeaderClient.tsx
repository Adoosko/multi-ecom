// src/components/blog/BlogPostHeaderClient.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { motion, Variants } from 'framer-motion';
import { CalendarDays, Clock, User } from 'lucide-react'; // Pridaná ikona User

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Author {
    name?: string | null;
}

interface BlogPostHeaderClientProps {
    title: string;
    publishDate: string;
    readingTime?: number | null;
    categories?: Category[] | null;
    author?: Author | null;
}

// Varianty pre postupné objavovanie
const headerItemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({ // Prijíma index pre delay
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1, // Oneskorenie na základe indexu
            duration: 0.5,
            ease: "easeOut"
        },
    }),
};

export function BlogPostHeaderClient({
    title,
    publishDate,
    readingTime,
    categories,
    author,
}: BlogPostHeaderClientProps) {
    return (
        // Celý header má základnú animáciu
        <motion.header
            className="mb-10 md:mb-14 text-center"
            initial="hidden"
            animate="visible" // Header sa zobrazí hneď pri načítaní stránky
            variants={{ // Jednoduchý fade-in pre celý header
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.5 } }
            }}
        >
            {/* Kategórie */}
            {categories && categories.length > 0 && (
                <motion.div
                    className="flex flex-wrap justify-center gap-2 mb-4"
                    custom={0} // Index pre delay
                    variants={headerItemVariants}
                >
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/blog/kategoria/${category.slug}`}
                            className="bg-red-900/60 hover:bg-red-900/80 px-3 py-1 rounded-full text-xs font-medium text-red-200 transition-colors"
                        >
                            {category.name}
                        </Link>
                    ))}
                </motion.div>
            )}

            {/* Nadpis */}
            <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl text-left font-bold text-white mb-5 leading-tight"
                custom={1} // Index pre delay
                variants={headerItemVariants}
            >
                {title}
            </motion.h1>

            {/* Metadáta */}
            <motion.div
                className="flex flex-wrap justify-start items-start gap-x-4 gap-y-2 text-base text-gray-400"
                custom={2} // Index pre delay
                variants={headerItemVariants}
            >
                {author?.name && (
                    <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{author.name}</span>
                    </span>
                )}
                {author?.name && <span className="hidden md:inline mx-1">•</span>}
                <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <time dateTime={publishDate}>
                        {format(new Date(publishDate), 'd. MMMM yyyy', { locale: sk })}
                    </time>
                </span>
                {readingTime && (
                    <>
                        <span className="hidden md:inline mx-1">•</span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{readingTime} min čítania</span>
                        </span>
                    </>
                )}
            </motion.div>
        </motion.header>
    );
}
