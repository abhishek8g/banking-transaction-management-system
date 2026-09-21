import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface FloatingBubbleProps {
  visible: boolean; children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'security';
  className?: string;
}

const styles = {
  info:     { bg: 'rgba(251,248,243,0.92)', border: 'rgba(63,74,61,0.18)',    color: '#3F4A3D' },
  success:  { bg: 'rgba(245,250,242,0.92)', border: 'rgba(156,175,136,0.35)', color: '#4A6E35' },
  warning:  { bg: 'rgba(251,246,240,0.92)', border: 'rgba(169,113,78,0.30)',  color: '#7D5239' },
  error:    { bg: 'rgba(251,243,241,0.92)', border: 'rgba(180,60,60,0.25)',   color: '#8B2020' },
  security: { bg: 'rgba(243,246,244,0.92)', border: 'rgba(63,74,61,0.22)',    color: '#3F4A3D' },
};

export default function FloatingBubble({ visible, children, variant = 'info', className = '' }: FloatingBubbleProps) {
  const s = styles[variant];
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity:0, scale:0.85, y:8 }}
          animate={{ opacity:1, scale:1, y:0 }}
          exit={{ opacity:0, scale:0.85, y:8 }}
          transition={{ type:'spring', stiffness:360, damping:26 }}
          className={`backdrop-blur-md rounded-2xl px-4 py-2.5 text-xs font-semibold shadow-lg pointer-events-none ${className}`}
          style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.color, backdropFilter:'blur(16px)' }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
