// src/components/categories/PopularCategories.tsx
import React from 'react';
import CategoryCard from './CategoryCard'; // Import nového komponentu

// Znovu použijeme interface Category alebo ho importujeme
interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  image?: {
    url?: string | null;
  } | null;
}

interface PopularCategoriesProps {
  categories: Category[];
}

const PopularCategories: React.FC<PopularCategoriesProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return null; // Nerenderovať nič, ak nie sú kategórie
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50 w-full"> {/* Svetlejšie pozadie a väčší padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 md:mb-16 text-center">
          Populárne kategórie
        </h2>
        {/* Optimalizovaný grid layout pre rôzne veľkosti */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
