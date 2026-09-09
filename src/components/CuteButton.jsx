// Jelly-press button with a few color variants.
import { motion } from 'motion/react';

export default function CuteButton({ children, variant = 'primary', className = '', ...rest }) {
  return (
    <motion.button
      className={`btn btn-${variant} ${className}`}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
