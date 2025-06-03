import type { CollectionConfig } from "payload";
export const Categories: CollectionConfig = {
  labels: {
    singular: "Kategória",
    plural: "Kategórie",
  },
  slug: "categories",
  // access: {
  //   create: () => false,
  //   update: () => false,
  // },
  fields: [
    {
      label:'Názov',
      name: "name",
      type: "text",
      required: true,
    },
    {
      label:'Slug',
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      label:'Farba',
      name: "color",
      type: "text",
    },
    {
      label:'Populárna',
      name: "popular",
      type: "checkbox",
      defaultValue: false,
    },
    {
      label:'Obrázok',
      name: "image",
      type: "upload",
      relationTo: "media",
      required: false,
    },
    {
      label:'Nadkategória',
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      label:'Podkategórie',
      name: "subcategories",
      type: "join",
      collection: "categories",
      on: "parent",
      hasMany: true,
    },
  ],
};
