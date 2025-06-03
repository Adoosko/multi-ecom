// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure window is defined (for SSR compatibility)
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      const updateMatch = () => setMatches(media.matches);

      // Initial check
      updateMatch();

      // Listener for changes
      media.addEventListener('change', updateMatch);

      // Cleanup listener on unmount
      return () => media.removeEventListener('change', updateMatch);
    }
  }, [query]);

  return matches;
}

export default useMediaQuery;

// Použitie: const isDesktop = useMediaQuery('(min-width: 768px)'); // md breakpoint Tailwindu
