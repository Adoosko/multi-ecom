// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import { Products } from "./collections/Products";
import { Manufacturers } from "./collections/Manufacturers";
import { Blog } from "./collections/Blog";
import { FontColorFeature } from "./features/fontColor/feature.server";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: ({ data }) => `/blog/${data.slug}`,
      breakpoints: [
        { label: 'Desktop', name: 'desktop', width: 1200, height: 800 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
      ],
      collections: ['blog'], 
    },
  },
  collections: [Users, Media, Categories, Manufacturers, Products, Blog],
  editor: lexicalEditor({
    features: ({defaultFeatures}) => {
      return [
        ...defaultFeatures,
        FontColorFeature()
      ]
    }
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});
