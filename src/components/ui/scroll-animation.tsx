import React, { ReactNode, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, Variants } from 'framer-motion';
import { cn } from '@/lib/utils'; // Predpokladáme existenciu cn utility

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-right' | 'fade-left' | 'scale-up' | 'zoom-in';
  delay?: number;
  amount?: number | 'some' | 'all'; // Premenované z threshold na amount
  className?: string;
  duration?: number;
  once?: boolean; // Pridaná možnosť pre jednorazovú animáciu
}

// Definícia variantov zostáva rovnaká
const animationVariants: Record<string, Variants['visible']> = {
    'fade-up': { opacity: 1, y: 0 },
    'fade-right': { opacity: 1, x: 0 },
    'fade-left': { opacity: 1, x: 0 },
    'scale-up': { opacity: 1, scale: 1 },
    'zoom-in': { opacity: 1, scale: 1 },
};

const initialStates: Record<string, Variants['hidden']> = {
    'fade-up': { opacity: 0, y: 20 },
    'fade-right': { opacity: 0, x: -20 },
    'fade-left': { opacity: 0, x: 20 },
    'scale-up': { opacity: 0, scale: 0.95 },
    'zoom-in': { opacity: 0, scale: 0.9 },
};


export function AnimateOnScroll({
  children,
  animation = 'fade-up',
  delay = 0,
  amount = 0.1, // Predvolená hodnota pre amount (10% viditeľnosti)
  className = '',
  duration = 700,
  once = true, // Predvolene animácia spustí len raz
}: AnimateOnScrollProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  // Použijeme amount namiesto threshold
  const isInView = useInView(ref, { amount, once });

  useEffect(() => {
    if (isInView) {
      // Ak používame once: false, musíme zvážiť resetovanie animácie
      // if (!once) controls.start("hidden"); // Príklad resetu

      // Použijeme setTimeout pre delay, ako si mal v pôvodnom kóde
      // Aj keď Framer Motion má vlastný delay v transition, toto zachováva pôvodnú logiku
      const timer = setTimeout(() => {
        controls.start('visible');
      }, delay);
      return () => clearTimeout(timer); // Cleanup časovača
    } else {
        // Ak chceme, aby sa animácia opakovala pri opustení view, resetujeme ju tu
        // (ale len ak once=false)
        if (!once) {
             controls.start('hidden');
        }
    }
  }, [controls, isInView, delay, once]); // Pridaná závislosť 'once'

  const variants: Variants = {
      hidden: initialStates[animation] || { opacity: 0 }, // Fallback pre neznámu animáciu
      visible: animationVariants[animation] || { opacity: 1 }, // Fallback
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{ duration: duration / 1000, ease: "easeOut" }} // Delay riešime cez setTimeout vyššie
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredChildrenProps extends AnimateOnScrollProps {
  baseDelay?: number;
  children: ReactNode[];
}

interface StaggeredChildrenProps {
    children: ReactNode[]; // Explicitne pole ReactNode
    baseDelay?: number;
    animation?: 'fade-up' | 'fade-right' | 'fade-left' | 'scale-up' | 'zoom-in';
    amount?: number | 'some' | 'all'; // Premenované z threshold
    className?: string;
    duration?: number; // Pridaná možnosť duration
    once?: boolean; // Pridaná možnosť once
  }
  
  export function StaggeredChildren({
    children,
    baseDelay = 100,
    animation = 'fade-up',
    amount = 0.1, // Predvolená hodnota pre amount
    className = '',
    duration = 700, // Default duration
    once = true, // Default once
  }: StaggeredChildrenProps) {
    return (
      <>
        {/* Kontrola, či children je pole, je stále dobrá prax */}
        {Array.isArray(children) &&
          children.map((child, index) => (
            <AnimateOnScroll
              key={index} // Použitie indexu ako kľúča je tu OK, ak sa poradie nemení
              delay={baseDelay * index} // Upravené oneskorenie, začína od 0
              animation={animation}
              amount={amount} // Použijeme amount
              className={className} // Prenesieme className na každé dieťa
              duration={duration} // Prenesieme duration
              once={once} // Prenesieme once
            >
              {child}
            </AnimateOnScroll>
          ))}
      </>
    );
  }
