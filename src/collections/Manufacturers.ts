import type { CollectionConfig } from "payload";

export const Manufacturers: CollectionConfig = {
  labels: {
    singular: "Výrobca",
    plural: "Výrobcovia",
  },
  slug: "manufacturers",
  
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name"],
  },
  access: {
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
  ],
};
