'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Component to automatically refresh the route when changes
 * are saved in the Payload admin live preview
 */
const RefreshOnSave = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Function that listens for messages from the Payload admin panel
    const handleMessage = (event: MessageEvent) => {
      // Verify the message is from our expected source
      if (
        event.data &&
        event.data.type === 'payload-live-preview' &&
        (event.data.action === 'save' || event.data.action === 'publish')
      ) {
        // Refresh the current route with new data
        router.refresh();
      }
    };

    // Tell the admin panel that we're ready to receive messages
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'payload-live-preview-ready' }, '*');
    }

    // Add event listener for messages
    window.addEventListener('message', handleMessage);

    // Clean up listener when component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router, pathname]);

  // This component doesn't render anything
  return null;
};

export default RefreshOnSave;
