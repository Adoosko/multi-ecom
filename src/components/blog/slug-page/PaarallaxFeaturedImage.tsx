// src/components/blog/ParallaxFeaturedImage.tsx
"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

interface ParallaxFeaturedImageProps {
    src: string;
    alt: string;
}

// Varianty pre fade-in obrázka
const imageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, delay: 0.3 } } // Mierne oneskorenie po headeri
};

export function ParallaxFeaturedImage({ src, alt }: ParallaxFeaturedImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        // Offset: Začni, keď vrch kontajnera dosiahne vrch viewportu,
        // skonči, keď spodok kontajnera dosiahne vrch viewportu.
        // Toto zaisťuje, že animácia prebieha, len keď je obrázok viditeľný.
        offset: ["start start", "end start"]
    });

    // Y posun pre parallax (mierny efekt)
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]); // Pohyb obrázka nadol pri scrollovaní nadol

    return (
        // Vonkajší kontajner s pevnou výškou a skrytým overflow
        <motion.div
            ref={containerRef}
            className="relative h-64 md:h-80 lg:h-[450px] w-full rounded-2xl overflow-hidden my-10 md:my-12 shadow-lg"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible" // Použijeme whileInView pre jednoduchý fade-in
            viewport={{ once: true, amount: 0.2 }} // Spustí sa, keď je 20% viditeľných
        >
            {/* Vnútorný motion.div, ktorý sa bude posúvať */}
            <motion.div
                className="absolute inset-0 h-[130%] bottom-[-30%]" // Vyšší a posunutý dole, aby bolo kam posúvať hore
                style={{ y }} // Aplikujeme parallax posun
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                />
                 {/* Voliteľný overlay pre stmavenie */}
                 <div className="absolute inset-0 bg-black/10"></div>
            </motion.div>
        </motion.div>
    );
}
