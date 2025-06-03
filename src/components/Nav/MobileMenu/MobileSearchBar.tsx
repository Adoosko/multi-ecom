// src/components/navigation/MobileMenu/MobileSearchBar.tsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MobileSearchBarProps {
    onSearch?: () => void; // Optional callback after search (e.g., to close menu)
}

const MobileSearchBar: React.FC<MobileSearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/vyhladavanie?q=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery('');
      onSearch?.(); // Call the callback if provided
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative mb-4">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Hľadať produkty..."
        aria-label="Hľadať produkty"
        className="w-full rounded-md py-2.5 pl-10 pr-4 bg-neutral-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
       <button
         type="submit"
         aria-label="Vyhľadať"
         className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:text-blue-400 hover:text-blue-300 transition-colors"
      >
        <Search size={20} />
      </button>
    </form>
  );
};

export default MobileSearchBar;
