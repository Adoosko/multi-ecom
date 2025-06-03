'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BlogMeta from './BlogMeta';

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  readingTime?: number;
  featuredImage?: {
    url: string;
    alt?: string;
  };
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  slug,
  excerpt,
  publishDate,
  readingTime,
  featuredImage,
}) => {
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
      aria-label={`Blog post: ${title}`}
    >
      {featuredImage && (
        <div className="relative h-48 w-full">
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || title}
            fill
            className="object-cover"
            priority={false}
          />
        </div>
      )}
      <div className="flex-1 p-6 flex flex-col">
        <BlogMeta publishDate={publishDate} readingTime={readingTime} />
        <Link href={`/blog/${slug}`} className="block mt-2">
          <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
            {title}
          </h2>
        </Link>
        <p className="mt-3 text-gray-600 line-clamp-3">{excerpt}</p>
        <div className="mt-4">
          <Link
            href={`/blog/${slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
            aria-label={`Read more about ${title}`}
          >
            Read more →
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
