import BlogList from "@/components/blog/BlogList";
import config from "@payload-config";
import { getPayload } from "payload";

type BlogPost = {
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
};

export const revalidate = 0;

export default async function BlogPage() {
  const payloadClient = await getPayload({ config });
  const { docs: posts } = (await payloadClient.find({
    collection: "blog",
    where: { status: { equals: "published" } },
    sort: "-publishDate",
    depth: 1,
    limit: 10,
  })) as { docs: BlogPost[] };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-12">Blog</h1>
      {posts.length > 0 ? (
        <BlogList posts={posts} />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No blog posts available yet.</p>
        </div>
      )}
    </div>
  );
}
