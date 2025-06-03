// src/components/navigation/AnimatedPopup.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedPopupProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  // Pridáme prop pre určenie strany, defaultne vpravo
  position?: 'right' | 'left';
}

const popupVariants = {
  hidden: {
    opacity: 0,
    scale: 0.90, // Trochu výraznejší scale
    y: -5,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const AnimatedPopup: React.FC<AnimatedPopupProps> = ({
    isOpen,
    children,
    className = '',
    position = 'right'
}) => {
  const positionClasses = position === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          // Tmavé pozadie, väčší padding, zaoblenie, tieň, jemný border
          className={`absolute top-full mt-3 w-max max-w-sm z-30 bg-neutral-900 rounded-xl shadow-2xl  overflow-hidden ${positionClasses} ${className}`}
          // Zabráni nechcenému zatvoreniu pri prechode myši z ikony na popup
           style={{ pointerEvents: 'auto' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedPopup;
