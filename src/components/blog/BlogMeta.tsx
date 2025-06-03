import React from 'react';
import { format } from 'date-fns';

interface BlogMetaProps {
  publishDate: string;
  readingTime?: number;
}

const BlogMeta: React.FC<BlogMetaProps> = ({ publishDate, readingTime }) => {
  return (
    <div className="flex gap-2 items-center text-xs text-gray-500 mb-2">
      <time dateTime={publishDate}>
        {format(new Date(publishDate), 'MMM d, yyyy')}
      </time>
      {readingTime && (
        <>
          <span>•</span>
          <span>{readingTime} min read</span>
        </>
      )}
    </div>
  );
};

export default BlogMeta;
