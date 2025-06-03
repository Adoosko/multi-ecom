import React from 'react';
import Link from 'next/link';

export type InternalLinkNode = {
  type: string;
  relationTo: 'blog' | 'products' | 'categories';
  value: {
    id: string;
    slug?: string;
  };
  children: {
    text: string;
  }[];
};

export const internalLinkConverter = ({ node }: { node: InternalLinkNode }) => {
  let href = '#';

  // Handle different collection types
  switch (node.relationTo) {
    case 'blog':
      href = `/blog/${node.value.slug}`;
      break;
    case 'products':
      href = `/products/${node.value.slug}`;
      break;
    case 'categories':
      href = `/categories/${node.value.slug}`;
      break;
    default:
      href = '#';
  }

  return (
    <Link 
      href={href}
      className="text-blue-600 hover:text-blue-800 underline"
    >
      {node.children.map((child, i) => child.text).join('')}
    </Link>
  );
};
