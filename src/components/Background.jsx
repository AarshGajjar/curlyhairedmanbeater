// Soft pastel blobs + slowly drifting sparkles behind everything.
import { motion } from 'motion/react';

const SPARKLES = ['✦', '✧', '⋆', '·', '✦', '⋆', '✧', '·', '✦', '⋆'];

export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      {SPARKLES.map((s, i) => (
        <motion.span
          key={i}
          className="sparkle"
          style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 53 + 11) % 100}%`, fontSize: 10 + (i % 3) * 6 }}
          animate={{ y: [0, -14, 0], opacity: [0.25, 0.9, 0.25], rotate: [0, 20, 0] }}
          transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        >
          {s}
        </motion.span>
      ))}
    </div>
  );
}
