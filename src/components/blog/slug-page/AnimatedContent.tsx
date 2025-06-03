/* eslint-disable */
// src/components/blog/AnimatedContent.tsx
"use client";

import RichText from "@/components/RichText";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

interface Tag {
  tag: string;
}

interface AnimatedContentProps {
  content: any;
  tags?: Tag[] | null;
}

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function AnimatedContent({ content, tags }: AnimatedContentProps) {
  return (
    <>
      {/* Obsah Článku */}
      <motion.div
        id="rich-text-content"
        // ODSTRÁNENÉ: prose prose-lg dark:prose-invert
        // Namiesto toho nastavíme základné farby a max šírku
        className="max-w-4xl mx-auto text-gray-300" // Základná farba textu pre tmavý režim
        variants={contentVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* RichText komponent vyrenderuje napr. <h2>, <strong>, <p> */}
        {/* Tieto elementy teraz budú mať predvolené štýly prehliadača, */}
        {/* alebo štýly, ktoré definuješ špecificky pre ne (napr. v globálnom CSS) */}
        {content && <RichText content={content} />}
      </motion.div>

      {/* Tagi (zostávajú bez zmeny) */}
      {tags && tags.length > 0 && (
        <motion.div
          className="mt-12 pt-8 border-t border-gray-700/50 max-w-3xl mx-auto"
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
            Štítky
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tagItem, index) => (
              <span
                key={index}
                className="bg-gray-800/70 text-gray-300 px-3 py-1 rounded-md text-xs cursor-default"
              >
                {tagItem.tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Späť na Blog Link (zostáva bez zmeny) */}
      <motion.div
        className="mt-16 text-center"
        variants={contentVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center text-red-400 hover:text-red-300 font-medium transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Späť na všetky články
        </Link>
      </motion.div>
    </>
  );
}
