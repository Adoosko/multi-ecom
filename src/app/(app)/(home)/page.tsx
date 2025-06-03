// src/app/page.tsx
import config from '@payload-config';
import { getPayload } from 'payload';
import ProductCard from '../../../components/ProductCard';
import PopularCategories from '@/components/categories/PopularCategories'; // Import nového komponentu
import WhyChooseUs from '@/components/whychooseus/WhyChooseUs';
import HeroCarousel from '@/components/HeroCarousel';
import { cn } from '@/lib/utils';

// Rozšírime typ Category, aby zahŕňal slug (ak už nie je)
interface Category {
  id: string;
  name: string;
  slug: string; // Uistíme sa, že slug je súčasťou typu
  color?: string | null;
  image?: {
    url?: string | null;
  } | null;
  popular?: boolean | null; // Atď.
}



export default async function Home() {
  const payloadClient = await getPayload({ config });
const { docs: featuredProducts } = await payloadClient.find({
collection: 'products',
where: { featured: { equals: true } },
limit: 4,
depth: 1, // populate manufacturer relationship
});
const { docs: categories } = await payloadClient.find({
collection: 'categories',
where: { popular: { equals: true } },
limit: 10,
depth: 1, // populate image relation
}) as { docs: Category[] };
  return (
    <main className="flex flex-col items-center">
      <HeroCarousel/>

      {/* Použitie nového komponentu */}
      <PopularCategories categories={categories} />

      <section
  className={cn(
    "relative py-16 w-full md:px-6 lg:px-28 mx-auto overflow-hidden",
    "bg-gradient-to-br from-background via-muted to-muted-foreground/10 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800"
  )}
>
  {/* Dekoratívne gradientové kruhy */}


  <div className="w-full h-auto mx-auto">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground drop-shadow">
      Obľúbené produkty
    </h2>
    <div
      className={cn(
        "grid h-auto grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 lg:gap-4",
        // Glass efekt pod gridom pre lepší kontrast kariet na svetlom aj tmavom
        "rounded-2xl p-2 md:p-4",
        ""
      )}
    >
      {featuredProducts.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  </div>
</section>


      <WhyChooseUs />

    </main>
  );
}
