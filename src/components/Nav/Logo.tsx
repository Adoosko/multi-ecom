// src/components/navigation/Logo.tsx
import React from 'react';
import Link from 'next/link';

const Logo: React.FC = () => {
  return (
    <div className="flex-shrink-0 mr-6">
      <Link
        href="/"
        className="text-3xl font-extrabold tracking-tight text-blue-900 dark:text-white hover:opacity-90 transition-opacity duration-200"
      >
        Pyro<span className="text-red-700">SHOP</span>
      </Link>
    </div>
  );
};

export default Logo;
