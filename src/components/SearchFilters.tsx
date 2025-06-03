'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IoFilterOutline, IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';

type FilterGroup = {
  name: string;
  options: string[];
  paramName: string;
}

// This is a mock filter structure - you would fetch this from your backend
const filterGroups: FilterGroup[] = [
  {
    name: 'Kategória',
    options: ['Workwear', 'PPE', 'Safety Footwear', 'High Visibility'],
    paramName: 'category'
  },
  {
    name: 'Značka',
    options: ['Snickers', 'Uvex', 'Blaklader', 'Portwest'],
    paramName: 'brand'
  },
  {
    name: 'Veľkosť',
    options: ['S', 'M', 'L', 'XL', 'XXL'],
    paramName: 'size'
  }
];

export default function SearchFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(filterGroups.map(group => [group.paramName, true]))
  );
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilterGroup = (paramName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [paramName]: !prev[paramName]
    }));
  };

  const handleFilterChange = (paramName: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Handle multi-select for filters
    const currentValues = params.getAll(paramName);
    if (currentValues.includes(value)) {
      // Remove value if already selected
      const newValues = currentValues.filter(v => v !== value);
      params.delete(paramName);
      newValues.forEach(v => params.append(paramName, v));
    } else {
      // Add new value
      params.append(paramName, value);
    }
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Mobile Filter Toggle Button */}
      <button 
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden flex items-center text-gray-700 font-medium mb-4"
      >
        <IoFilterOutline className="mr-2" />
        Filtre {showFilters ? 'skryť' : 'zobraziť'}
      </button>

      {/* Filters Container */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white rounded-lg shadow-sm border border-gray-200 p-4`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filterGroups.map((group) => (
            <div key={group.paramName} className="border-b md:border-b-0 pb-3 md:pb-0">
              <button
                onClick={() => toggleFilterGroup(group.paramName)}
                className="flex justify-between items-center w-full text-left font-medium text-gray-800 mb-2"
              >
                {group.name}
                {expandedGroups[group.paramName] 
                  ? <IoChevronUpOutline /> 
                  : <IoChevronDownOutline />
                }
              </button>
              
              {expandedGroups[group.paramName] && (
                <div className="space-y-2 pl-1">
                  {group.options.map((option) => {
                    const isSelected = searchParams.getAll(group.paramName).includes(option);
                    
                    return (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleFilterChange(group.paramName, option)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
