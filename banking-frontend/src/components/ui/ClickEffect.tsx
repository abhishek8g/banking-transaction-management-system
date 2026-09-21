import { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

interface Burst { id: number; x: number; y: number }

export default function ClickEffect() {
  const { settings } = useSettings();
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    if (settings.reduceMotion) return;
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest('button, a, [role="button"], [data-click]')) return;
      const id = Date.now() + Math.random();
      setBursts(b => [...b, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setBursts(b => b.filter(br => br.id !== id)), 700);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [settings.reduceMotion]);

  return (
    <>
      {bursts.map(burst => (
        <div key={burst.id} className="pointer-events-none fixed top-0 left-0 z-[9996]"
          style={{ transform: `translate(${burst.x}px, ${burst.y}px) translate(-50%, -50%)` }}>
          {/* Expanding rings */}
          {[1, 2, 3].map(i => (
            <div key={i} className="absolute rounded-full border border-cyan-400/40"
              style={{
                width: i * 24, height: i * 24,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `clickRing ${0.3 + i * 0.1}s ease-out forwards`,
                animationDelay: `${i * 0.05}s`,
              }} />
          ))}
          {/* Particles */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const dist = 28;
            return (
              <div key={i} className="absolute w-1 h-1 rounded-full bg-cyan-400"
                style={{
                  top: '50%', left: '50%',
                  animation: `particle 0.5s ease-out forwards`,
                  '--dx': `${Math.cos(angle) * dist}px`,
                  '--dy': `${Math.sin(angle) * dist}px`,
                } as React.CSSProperties} />
            );
          })}
        </div>
      ))}
    </>
  );
}
