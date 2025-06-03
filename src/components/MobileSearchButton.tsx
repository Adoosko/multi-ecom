'use client';

import { useState } from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';
import SearchBar from './SearchBar';

export default function MobileSearchButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {isOpen ? (
        <div className="fixed inset-0 bg-white z-50 p-4 pt-16">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-600"
            aria-label="Close search"
          >
            <IoClose size={24} />
          </button>
          <h2 className="text-xl font-medium mb-4">Hľadať</h2>
          <SearchBar showOnMobile={true} />
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="text-gray-700 hover:text-blue-600 transition-colors"
          aria-label="Search"
        >
          <IoSearch size={22} />
        </button>
      )}
    </div>
  );
}
