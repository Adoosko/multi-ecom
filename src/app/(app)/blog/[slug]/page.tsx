/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedContent } from "@/components/blog/slug-page/AnimatedContent";
import { BlogPostHeaderClient } from "@/components/blog/slug-page/BlogPostHeaderClient";
import { ParallaxFeaturedImage } from "@/components/blog/slug-page/PaarallaxFeaturedImage";
import config from "@payload-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import RefreshOnSave from "./RefreshOnSave";

// Importujeme nové klientské komponenty

// --- Typ BlogPost (ako predtým) ---
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt: string;
  publishDate: string;
  readingTime?: number | null;
  featuredImage?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  author?: { id: string; name?: string | null } | null;
  categories?: Array<{ id: string; name: string; slug: string }> | null;
  tags?: Array<{ tag: string }> | null;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaImage?: { url: string };
  };
}

// --- generateMetadata (bez zmeny) ---
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const payloadClient = await getPayload({ config });
  try {
    const { docs } = (await payloadClient.find({
      collection: "blog",
      where: { slug: { equals: params.slug } },
      depth: 1,
      limit: 1,
    })) as { docs: BlogPost[] };
    const post = docs[0];
    if (!post) return { title: "Post Not Found" };
    return {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      openGraph: post.seo?.metaImage
        ? { images: [{ url: post.seo.metaImage.url }] }
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching blog post metadata:", error);
    return { title: "Blog Post" };
  }
}

// --- Hlavný Server Component ---
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const payloadClient = await getPayload({ config });

  try {
    const { docs } = (await payloadClient.find({
      collection: "blog",
      where: { slug: { equals: params.slug } },
      depth: 1,
      limit: 1,
    })) as { docs: BlogPost[] };

    const post = docs[0];

    if (!post) {
      notFound();
    }

    return (
      <div className="w-full bg-gradient-to-b from-black via-gray-900/95 to-black text-white min-h-screen py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-7 lg:px-8">
          <RefreshOnSave />

          <article>
            {/* Použijeme klientský komponent pre Header */}
            <BlogPostHeaderClient
              title={post.title}
              publishDate={post.publishDate}
              readingTime={post.readingTime}
              categories={post.categories}
              author={post.author}
            />

            {/* Použijeme klientský komponent pre Obrázok */}
            {post.featuredImage && (
              <ParallaxFeaturedImage
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
              />
            )}

            {/* Použijeme klientský komponent pre Obsah a Tagi */}
            <AnimatedContent content={post.content} tags={post.tags} />
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}
