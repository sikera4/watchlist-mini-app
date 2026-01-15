'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  isVisible: boolean;
  children: ReactNode;
};

const AnimatedPresenceFacade = ({ isVisible, children }: Props) => {
  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedPresenceFacade;
