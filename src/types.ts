// src/types/navigation.ts
import React from 'react';

export interface NavLink {
  name: string;
  href: string;
  icon?: React.ReactNode; // Optional icon for links (e.g., in MegaMenu)
}

export interface MegaMenuCategory {
  title: string;
  description?: string;
  links: NavLink[];
}

export interface NavItemData {
  id: string;
  name: string;
  href?: string; // Href for top-level link or category page
  megaMenu?: MegaMenuCategory[]; // Sub-categories and links for dropdown
}

