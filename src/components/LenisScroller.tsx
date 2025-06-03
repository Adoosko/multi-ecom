"use client";

import React, { useRef, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

const LenisScroller: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!lenisRef.current) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // smoothTouch: true,
      });
      lenisRef.current = lenis;

      const frame = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
};

export default LenisScroller;
