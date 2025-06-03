"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { IoSearch } from "react-icons/io5";

type SearchBarProps = {
  className?: string;
  placeholder?: string;
  showOnMobile?: boolean;
};

export default function SearchBar({
  className = "",
  placeholder = "Hľadať produkty...",
  showOnMobile = true,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("q") || "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center w-full max-w-xl relative ${className} ${!showOnMobile ? "hidden md:flex" : ""}`}
    >
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
        placeholder={placeholder}
      />
      <button
        type="submit"
        className="absolute right-2 text-gray-500 hover:text-blue-600 transition-colors"
        aria-label="Search"
      >
        <IoSearch size={22} />
      </button>
    </form>
  );
}
