import { Suspense, lazy, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import VideoBackground, { type VideoPage } from './VideoBackground';

const Scene3D = lazy(() => import('../3d/Scene3D'));

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
  mood?: 'idle' | 'success' | 'error' | 'point' | 'wave';
  minHeight?: string;
  character?: 'assistant' | 'specialist' | 'guardian' | 'analyst' | 'admin' | 'support';
  page?: VideoPage;
  titleGradient?: string;
}

export default function PageHero({
  title, subtitle, badge, children,
  mood = 'idle', minHeight = '200px',
  character = 'assistant', page = 'dashboard',
}: PageHeroProps) {
  const { settings } = useSettings();
  const parts = title.split('|');

  return (
    <div className="relative rounded-[28px] overflow-hidden"
      style={{
        minHeight,
        border: '1px solid rgba(63,74,61,0.12)',
        boxShadow: '0 8px 40px rgba(63,74,61,0.10), inset 0 1px 0 rgba(255,255,255,0.70)',
      }}>
      <VideoBackground page={page} />

      {!settings.disable3D && (
        <div className="absolute inset-0 opacity-60">
          <Suspense fallback={null}>
            <Scene3D mood={mood} character={character} reduceMotion={settings.reduceMotion} />
          </Suspense>
        </div>
      )}

      <div className="relative z-10 p-7 lg:p-9">
        {badge && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="ebadge mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9CAF88] animate-breathe inline-block" />
            {badge}
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="text-3xl lg:text-4xl font-black leading-tight"
          style={{ color: '#3F4A3D' }}
        >
          {parts.length === 2 ? (
            <>
              <span>{parts[0]} </span>
              <span className="text-gradient-terra">{parts[1]}</span>
            </>
          ) : (
            <span>{title}</span>
          )}
        </motion.h1>

        {subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-sm mt-2 max-w-md" style={{ color: '#8A9688' }}>
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-5">
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}
