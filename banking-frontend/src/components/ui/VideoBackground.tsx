import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

export type VideoPage =
  | 'dashboard' | 'accounts' | 'transactions' | 'transfer'
  | 'deposit' | 'withdraw' | 'analytics' | 'security'
  | 'profile' | 'settings' | 'help' | 'admin' | 'login';

interface PageAtmosphere {
  base: string;
  glow1: string;
  glow2: string;
}

// Earthy warm atmospheres per page — stronger color presence
const atmospheres: Record<VideoPage, PageAtmosphere> = {
  login:        { base: '#EDE6D6', glow1: 'rgba(156,175,136,0.25)', glow2: 'rgba(169,113,78,0.14)' },
  dashboard:    { base: '#F5F0E6', glow1: 'rgba(156,175,136,0.22)', glow2: 'rgba(169,113,78,0.08)' },
  accounts:     { base: '#F2EDE0', glow1: 'rgba(169,113,78,0.16)',  glow2: 'rgba(156,175,136,0.16)' },
  transactions: { base: '#EEE9E0', glow1: 'rgba(63,74,61,0.14)',    glow2: 'rgba(156,175,136,0.18)' },
  transfer:     { base: '#F1EAE0', glow1: 'rgba(169,113,78,0.20)',  glow2: 'rgba(156,175,136,0.10)' },
  deposit:      { base: '#EDF0E6', glow1: 'rgba(156,175,136,0.28)', glow2: 'rgba(63,74,61,0.08)' },
  withdraw:     { base: '#F0E9DF', glow1: 'rgba(169,113,78,0.22)',  glow2: 'rgba(63,74,61,0.10)' },
  analytics:    { base: '#ECE9DF', glow1: 'rgba(63,74,61,0.14)',    glow2: 'rgba(156,175,136,0.20)' },
  security:     { base: '#E6EAE4', glow1: 'rgba(63,74,61,0.20)',    glow2: 'rgba(156,175,136,0.16)' },
  profile:      { base: '#F4EFE6', glow1: 'rgba(156,175,136,0.18)', glow2: 'rgba(169,113,78,0.10)' },
  settings:     { base: '#EEEAE0', glow1: 'rgba(63,74,61,0.14)',    glow2: 'rgba(156,175,136,0.14)' },
  help:         { base: '#F2EFE6', glow1: 'rgba(156,175,136,0.22)', glow2: 'rgba(169,113,78,0.10)' },
  admin:        { base: '#E8ECE5', glow1: 'rgba(63,74,61,0.18)',    glow2: 'rgba(156,175,136,0.18)' },
};

interface VideoBackgroundProps {
  page: VideoPage;
  className?: string;
}

export default function VideoBackground({ page, className = '' }: VideoBackgroundProps) {
  const { settings } = useSettings();
  const atm = atmospheres[page] ?? atmospheres.dashboard;
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (settings.reduceMotion) return;
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      setOffset(((ts - start) / 28000) % 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [settings.reduceMotion]);

  const x1 = 20 + Math.sin(offset * Math.PI * 2) * 18;
  const y1 = 18 + Math.cos(offset * Math.PI * 2) * 14;
  const x2 = 70 + Math.sin(offset * Math.PI * 2 + 2.2) * 16;
  const y2 = 68 + Math.cos(offset * Math.PI * 2 + 1.4) * 18;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      {/* Warm base */}
      <div className="absolute inset-0" style={{ background: atm.base }} />

      {/* Soft organic light blobs */}
      <div className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at ${x1}% ${y1}%, ${atm.glow1} 0%, transparent 50%),
            radial-gradient(ellipse at ${x2}% ${y2}%, ${atm.glow2} 0%, transparent 46%)
          `,
          transition: 'background 3s ease',
        }}
      />

      {/* Organic grain texture overlay (very subtle) */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px',
        }}
      />

      {/* Floating dust particles */}
      {!settings.disable3D && !settings.reduceMotion && (
        <DustParticles count={settings.immersiveMode ? 18 : 8} />
      )}

      {/* Bottom warm gradient */}
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(0deg, ${atm.base}55 0%, transparent 30%)` }} />
    </div>
  );
}

function DustParticles({ count }: { count: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left:   `${8  + (i * 8.7) % 84}%`,
    top:    `${10 + (i * 11.3) % 80}%`,
    size:   1.5 + (i % 4) * 0.8,
    delay:  i * 0.55,
    dur:    5 + (i % 5) * 1.4,
    color:  i % 3 === 0 ? 'rgba(156,175,136,0.55)'
          : i % 3 === 1 ? 'rgba(169,113,78,0.45)'
          :               'rgba(63,74,61,0.35)',
    shape:  i % 4 === 0 ? '50%' : i % 4 === 1 ? '3px' : '50%',
  }));

  return (
    <>
      {particles.map(p => (
        <div key={p.id} className="absolute"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: p.color,
            borderRadius: p.shape,
            opacity: 0.5,
            animation: `dustFloat ${p.dur}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </>
  );
}
