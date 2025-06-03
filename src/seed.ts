import config from "@payload-config";
import { getPayload } from "payload";

const categories = [
  { name: "Workwear", slug: "workwear" },
  { name: "Footwear", slug: "footwear" },
  { name: "PPE", slug: "ppe" },
  { name: "News", slug: "news" },
  { name: "Discounts", slug: "discounts" },
];

const seed = async () => {
  const payload = await getPayload({ config });

  for (const category of categories) {
    // Skip if category exists
    const { docs: existingCats } = await payload.find({
      collection: "categories",
      where: { slug: { equals: category.slug } },
      limit: 1,
    });
    const parentCategory = existingCats[0]
      ? existingCats[0]
      : await payload.create({
          collection: "categories",
          data: {
            name: category.name,
            slug: category.slug,
            parent: null,
          },
        });
  }

  // Seed sample products
  const products = [
    { title: "High-Visibility Vest", slug: "high-vis-vest", description: "Fluorescent work vest for maximum safety.", price: 29.99, stock: 200, featured: true, categorySlug: "workwear" },
    { title: "Safety Boot", slug: "safety-boot", description: "Steel-toe safety boot for rugged conditions.", price: 89.99, stock: 150, featured: true, categorySlug: "footwear" },
    { title: "Protective Helmet", slug: "protective-helmet", description: "Industrial hard hat with adjustable strap.", price: 39.99, stock: 300, featured: true, categorySlug: "ppe" },
  ];
  for (const prod of products) {
    // Skip if product exists
    const { docs: existingProd } = await payload.find({
      collection: "products",
      where: { slug: { equals: prod.slug } },
      limit: 1,
    });
    if (existingProd.length) continue;
    const { docs: catDocs } = await payload.find({ collection: "categories", where: { slug: { equals: prod.categorySlug } }, limit: 1 });
    const catId = catDocs[0]?.id;
    if (!catId) continue;
    await payload.create({
      collection: "products",
      data: {
        title: prod.title,
        slug: prod.slug,
        // Minimal empty Lexical state for description to avoid parse errors
        description: {
          root: {
            type: "root",
            version: 1,
            children: [],
            direction: null,
            format: "",
            indent: 0,
          },
        },
        price: prod.price,
        stock: prod.stock,
        featured: prod.featured,
        category: catId,
      },
    });
  }
};
seed();
