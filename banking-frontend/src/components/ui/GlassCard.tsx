import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type GlowVariant = 'sage' | 'terra' | 'olive' | 'none'
  | 'blue' | 'purple' | 'green' | 'gold' | 'pink' | 'aqua' | 'cyan' | 'sky' | 'mint' | 'violet' | 'success' | 'warning' | 'danger';

type TintVariant = 'sage' | 'terra' | 'olive' | 'none';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: GlowVariant;
  tint?: TintVariant;
  onClick?: () => void;
  'data-hover'?: string;
}

const glowMap: Record<GlowVariant, string> = {
  sage:    'hover:shadow-[0_16px_48px_rgba(156,175,136,0.30)] hover:border-[rgba(156,175,136,0.35)]',
  terra:   'hover:shadow-[0_16px_48px_rgba(169,113,78,0.28)]  hover:border-[rgba(169,113,78,0.32)]',
  olive:   'hover:shadow-[0_16px_48px_rgba(63,74,61,0.22)]    hover:border-[rgba(63,74,61,0.28)]',
  none:    '',
  // legacy compat → map to closest earthy equivalent
  blue:    'hover:shadow-[0_16px_48px_rgba(156,175,136,0.30)] hover:border-[rgba(156,175,136,0.35)]',
  purple:  'hover:shadow-[0_16px_48px_rgba(169,113,78,0.28)]  hover:border-[rgba(169,113,78,0.32)]',
  green:   'hover:shadow-[0_16px_48px_rgba(156,175,136,0.30)] hover:border-[rgba(156,175,136,0.35)]',
  gold:    'hover:shadow-[0_16px_48px_rgba(169,113,78,0.28)]  hover:border-[rgba(169,113,78,0.32)]',
  pink:    'hover:shadow-[0_16px_48px_rgba(169,113,78,0.28)]  hover:border-[rgba(169,113,78,0.32)]',
  aqua:    'hover:shadow-[0_16px_48px_rgba(156,175,136,0.30)] hover:border-[rgba(156,175,136,0.35)]',
  cyan:    'hover:shadow-[0_16px_48px_rgba(156,175,136,0.30)] hover:border-[rgba(156,175,136,0.35)]',
  sky:     'hover:shadow-[0_16px_48px_rgba(156,175,136,0.30)] hover:border-[rgba(156,175,136,0.35)]',
  mint:    'hover:shadow-[0_16px_48px_rgba(156,175,136,0.30)] hover:border-[rgba(156,175,136,0.35)]',
  violet:  'hover:shadow-[0_16px_48px_rgba(169,113,78,0.28)]  hover:border-[rgba(169,113,78,0.32)]',
  success: 'hover:shadow-[0_16px_48px_rgba(156,175,136,0.30)] hover:border-[rgba(156,175,136,0.35)]',
  warning: 'hover:shadow-[0_16px_48px_rgba(169,113,78,0.28)]  hover:border-[rgba(169,113,78,0.32)]',
  danger:  'hover:shadow-[0_16px_48px_rgba(180,60,60,0.22)]   hover:border-[rgba(180,60,60,0.28)]',
};

const tintClass: Record<TintVariant, string> = {
  sage:  'ecard-sage',
  terra: 'ecard-terra',
  olive: 'ecard-olive',
  none:  '',
};

export default function GlassCard({
  children, className = '', hover = true,
  glow = 'sage', tint = 'none', onClick,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.006, rotateZ: 0.3 } : undefined}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      onClick={onClick}
      data-hover={hover ? 'true' : undefined}
      className={[
        'ecard',
        tint !== 'none' ? tintClass[tint] : '',
        hover ? `cursor-pointer ${glowMap[glow]}` : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className="ecard-shimmer" />
      {children}
    </motion.div>
  );
}
