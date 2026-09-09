// A springy card ("bubble") used for every panel in the app.
import { motion } from 'motion/react';

export default function Bubble({ children, className = '', delay = 0, ...rest }) {
  return (
    <motion.div
      className={`bubble ${className}`}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
