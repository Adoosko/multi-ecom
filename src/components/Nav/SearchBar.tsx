// src/components/navigation/SearchBar.tsx
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

// Add prop to control initial transparency based on scroll
interface SearchBarProps { isScrolled?: boolean; }

const SearchBar: React.FC<SearchBarProps> = ({ isScrolled = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/vyhladavanie?q=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery('');
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="relative group">
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Hľadať produkty..."
          aria-label="Vyhľadať produkty"
          className={`w-48 lg:w-64 rounded-full py-2 pl-10 pr-4 transition-all duration-300 ease-in-out group-focus-within:w-64 lg:group-focus-within:w-80 focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-neutral-800 text-gray-100 placeholder-gray-400 focus:ring-neutral-600 focus:bg-neutral-800' : 'bg-white text-gray-900 placeholder-gray-400 focus:ring-gray-400 focus:bg-white'} border ${theme === 'dark' ? 'border-neutral-700' : 'border-gray-200'} focus:border-transparent`}
        />
        <button
          type="submit"
          aria-label="Vyhľadať"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-white hover:text-red-400 transition-colors z-10"
        >
          <Search size={20} />
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </form>
      {isDropdownOpen && searchQuery && (
        <div className={`absolute top-full left-0 w-full bg-white dark:bg-neutral-800 mt-2 rounded-lg shadow-lg border dark:border-neutral-700 border-gray-200`}>
          <div className="p-4 text-gray-600 dark:text-gray-300">
            <p className="text-sm mb-2">Nedávne vyhľadávania</p>
            <div className="space-y-2">
              <button className="w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 py-1 rounded">
                Pracovné odevy
              </button>
              <button className="w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 py-1 rounded">
                Bezpečnostná obuv
              </button>
              <button className="w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 py-1 rounded">
                Rukavice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
