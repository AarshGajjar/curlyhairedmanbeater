// Pink gradient ring that fills as the workout progresses.
import { motion } from 'motion/react';

export default function ProgressRing({ progress, size = 300, stroke = 10, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="ring-svg" aria-hidden="true">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff8fb8" />
            <stop offset="50%" stopColor="#c89bff" />
            <stop offset="100%" stopColor="#8fd3ff" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-bg" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-fill"
          strokeWidth={stroke}
          strokeDasharray={c}
          animate={{ strokeDashoffset: c - c * Math.min(1, Math.max(0, progress)) }}
          transition={{ type: 'spring', stiffness: 60, damping: 18 }}
        />
      </svg>
      <div className="ring-content">{children}</div>
    </div>
  );
}
