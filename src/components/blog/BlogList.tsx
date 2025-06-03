'use client'
import React from 'react';
import { motion, Variants } from 'framer-motion';
import BlogCard from './BlogCard';

interface BlogPost {
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

interface BlogListProps {
  posts: BlogPost[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          id={post.id}
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt}
          publishDate={post.publishDate}
          readingTime={post.readingTime}
          featuredImage={post.featuredImage}
        />
      ))}
    </motion.div>
  );
};

export default BlogList;
