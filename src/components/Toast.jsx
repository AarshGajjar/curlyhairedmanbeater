// Little floating encouragement that pops in from the bottom.
import { AnimatePresence, motion } from 'motion/react';

export default function Toast({ message }) {
  return (
    <div className="toast-anchor" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message.id}
            className="toast"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
