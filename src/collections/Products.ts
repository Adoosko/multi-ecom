// src/collections/Products.ts
import type { CollectionConfig } from "payload";
import { lexicalEditor } from '@payloadcms/richtext-lexical';

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Produkt", plural: "Produkty" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ['title', 'manufacturer', 'category', 'price', 'stock', 'status', 'featured'],
    // livePreview: {
    //     url: ({ data }) => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/produkty/${data.slug}`, // Uprav cestu na /produkty/
    // },
  },
  access: { read: () => true, create: () => true, update: () => true },
  fields: [
    // Základné Info
    { label: 'Názov Produktu', name: "title", type: "text", required: true, localized: true },
    { label: 'Slug (URL)', name: "slug", type: "text", required: true, unique: true, index: true, admin: { position: 'sidebar' } },
    { name: "status", label: "Stav", type: "select", options: [{ label: "Koncept", value: "draft" }, { label: "Publikovaný", value: "published" }], defaultValue: "draft", admin: { position: 'sidebar' }, required: true, index: true },
    { name: "publishDate", label: "Dátum Publikovania", type: "date", admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } }, defaultValue: () => new Date() },
    { name: "manufacturer", label: "Výrobca", type: "relationship", relationTo: ["manufacturers"], hasMany: false, required: true },
    { label: 'Krátky Popis (Prehľad)', name: "shortDescription", type: "textarea", required: true, maxLength: 250, admin: { description: 'Stručný popis produktu zobrazený v zoznamoch.' } },
    { label: 'Dlhý Popis (Detail)', name: "longDescription", type: "richText", editor: lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures] }), required: false },

    // Cena a Sklad
    { type: 'row', fields: [
        { label: 'Predajná Cena (€)', name: "price", type: "number", required: true, min: 0, admin: { width: '50%' } },
        { label: 'Pôvodná Cena (€)', name: "originalPrice", type: "number", min: 0, admin: { width: '50%', description: 'Ak je produkt v zľave.' } },
    ]},
    { type: 'row', fields: [
        { label: 'Počet na sklade', name: "stock", type: "number", required: true, min: 0, admin: { width: '50%' } },
        { label: 'SKU / Kód Produktu', name: "sku", type: "text", admin: { width: '50%' } }
    ]},

    // Kategorizácia
    { label: 'Označený (Featured)', name: "featured", type: "checkbox", defaultValue: false, admin: { position: 'sidebar' } },
    { label: 'Hlavná Kategória', name: "category", type: "relationship", relationTo: "categories", hasMany: false, required: true },

    { label: 'Štítky (Tags)', name: "tags", type: "array", fields: [{ name: "tag", label: "Štítok", type: "text", required: true }], admin: { description: 'Kľúčové slová (napr. vodeodolný, reflexný).' } },

    // Médiá
    { label: 'Hlavný obrázok', name: 'featuredImage', type: 'upload', relationTo: 'media', required: false, admin: { description: 'Hlavný obrázok produktu.' } },
    { label: 'Galéria obrázkov', name: "images", type: "array", fields: [
        { name: 'image', label: 'Obrázok', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', label: 'Alternatívny text', type: 'text' }
    ]},

    // Varianty
    {
      label: 'Farebné Varianty a Veľkosti',
      name: 'colorVariants', // Premenované pre jasnosť
      type: 'array',
      minRows: 0, // Môže byť 0, ak produkt nemá farebné varianty
      admin: {
          description: 'Definujte dostupné farby produktu a pre každú farbu zadajte veľkosti, SKU a skladové zásoby.',
          // Pridanie komponentu pre lepšie zobrazenie v zozname (voliteľné)
          components: {
               // RowLabel môže zobraziť napr. farbu a počet veľkostí
               // RowLabel: ({ data, index }) => {
               //   return `${data.color || `Variant ${index + 1}`} (${data.sizes?.length || 0} veľkostí)`;
               // },
          }
      },
      fields: [
          // --- Úroveň Farby ---
          {
              name: 'color',
              label: 'Farba (Názov)',
              type: 'text',
              required: true,
              admin: { description: 'Napr. Červená, Modrá, Antracitová' }
          },
          {
              name: 'colorCode', // Voliteľné pole pre HEX/Tailwind triedu
              label: 'Kód Farby (Voliteľné)',
              type: 'text',
               admin: { description: 'Napr. #FF0000 alebo bg-red-600. Pomôcka pre frontend.' }
          },
          {
              name: 'image', // Obrázok špecifický pre TÚTO FARBU
              label: 'Obrázok pre farbu',
              type: 'upload',
              relationTo: 'media',
               admin: { description: 'Hlavný obrázok pre tento farebný variant.'}
          },

          // --- Vnorená Úroveň Veľkostí pre danú Farbu ---
          {
              name: 'sizes',
              label: 'Dostupné Veľkosti',
              type: 'array',
              required: true, // Každá farba musí mať aspoň jednu veľkosť
              minRows: 1,
              admin: {
                  description: 'Pre zvolenú farbu pridajte dostupné veľkosti, ich SKU a skladové zásoby.',
              },
              fields: [
                  {
                      name: 'size',
                      label: 'Veľkosť',
                      type: 'text', // Alebo 'select' ak máš pevný zoznam veľkostí
                      required: true,
                      admin: { width: '30%' }
                      // options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], // Ak použiješ select
                  },
                  {
                      name: 'sku',
                      label: 'SKU Variantu',
                      type: 'text',
                      admin: { width: '35%' }
                  },
                  {
                      name: 'stock',
                      label: 'Sklad',
                      type: 'number',
                      min: 0,
                      required: true,
                      admin: { width: '35%', step: 1 } // Krok pre jednoduchšie zadávanie
                  },
              ] // Koniec fields pre 'sizes'
          } // Koniec poľa 'sizes'

      ] // Koniec fields pre 'colorVariants'
  },

    // Špecifikácie
    { label: 'Špecifikácie', name: 'specifications', type: 'blocks', blocks: [
        { slug: 'specItem', labels: { singular: 'Špecifikácia', plural: 'Špecifikácie'}, fields: [
            { name: 'name', label: 'Názov parametra', type: 'text', required: true },
            { name: 'value', label: 'Hodnota parametra', type: 'text', required: true },
        ]},
        { slug: 'specSection', labels: { singular: 'Sekcia Špecifikácií', plural: 'Sekcie'}, fields: [
            { name: 'title', label: 'Názov Sekcie', type: 'text', required: true },
            { name: 'items', label: 'Parametre', type: 'array', fields: [
                { name: 'name', label: 'Názov', type: 'text', required: true },
                { name: 'value', label: 'Hodnota', type: 'text', required: true },
            ]},
        ]}
    ]},

    // Súvisiace Produkty
    { label: 'Súvisiace Produkty', name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true, required: false, admin: { description: 'Produkty zobrazené pod detailom.' } },

    // SEO
    { label: 'SEO Nastavenia', name: 'seo', type: 'group', fields: [
        { name: 'metaTitle', label: 'Meta Titulok', type: 'text', admin: { description: 'Max 60 znakov.'} },
        { name: 'metaDescription', label: 'Meta Popis', type: 'textarea', admin: { description: 'Max 160 znakov.'} },
        { name: 'metaImage', label: 'Meta Obrázok (OG)', type: 'upload', relationTo: 'media', admin: { description: '1200x630px.'} },
    ]}
  ],
};
