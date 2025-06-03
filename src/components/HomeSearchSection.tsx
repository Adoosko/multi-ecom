'use client';

import SearchBar from './SearchBar';
import SearchFilters from './SearchFilters';

export default function HomeSearchSection() {
  return (
    <section className="w-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Čo hľadáte?</h2>
          <SearchBar className="mb-4" showOnMobile={false} />
        </div>
        <SearchFilters />
      </div>
    </section>
  );
}
