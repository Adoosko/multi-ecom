import type { CollectionConfig } from "payload";
import { Users } from "./Users";
import { Categories } from "./Categories";
import { Media } from "./Media";

export const Blog: CollectionConfig = {
  slug: "blog",
  labels: {
    singular: "Blog Post",
    plural: "Blog Posts",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "author", "status", "publishDate"],
  },
  access: {
    create: () => true,
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "author",
      label: "Author",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      required: true,
    },
    {
      name: "excerpt",
      label: "Excerpt",
      type: "textarea",
      required: true,
    },
    {
      name: "content",
      label: "Content",
      type: "richText",
      localized: false,
      required: true,
    },
    {
      name: "featuredImage",
      label: "Featured Image",
      type: "upload",
      relationTo: "media",
      required: false,
    },
    {
      name: "categories",
      label: "Categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
    },
    {
      name: "tags",
      label: "Tags",
      type: "array",
      fields: [
        { name: "tag", type: "text" },
      ],
    },
    {
      name: "seo",
      label: "SEO",
      type: "group",
      fields: [
        { name: "metaTitle", label: "Meta Title", type: "text" },
        { name: "metaDescription", label: "Meta Description", type: "textarea" },
        { name: "metaImage", label: "Meta Image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "publishDate",
      label: "Publish Date",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: "dayOnly" } },
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      defaultValue: "draft",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "readingTime",
      label: "Reading Time",
      type: "number",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.content) {
          let plainText = '';
          if (typeof data.content === 'string') {
            plainText = data.content;
          } else if (Array.isArray(data.content)) {
            try {
              plainText = data.content
                .map((block: any) => {
                  if (block.children) {
                    return block.children
                      .map((child: any) => (typeof child.text === 'string' ? child.text : ''))
                      .join(' ');
                  }
                  return '';
                })
                .join(' ');
            } catch (e) {
              console.error('Error processing content for reading time:', e);
            }
          }
          
          const words = plainText.split(/\s+/).filter(Boolean).length;
          data.readingTime = Math.ceil(words / 200);
        }
        
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        }
        
        return data;
      },
    ],
  },
};
