import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

interface Ripple { id: number; x: number; y: number; type: 'terra' | 'sage' }

export default function CustomCursor() {
  const { settings } = useSettings();
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -200, y: -200 });
  const ring    = useRef({ x: -200, y: -200 });
  const raf     = useRef<number>(0);
  const [hovering, setHovering] = useState(false);
  const [ripples, setRipples]   = useState<Ripple[]>([]);

  useEffect(() => {
    if (settings.standardCursor || settings.disable3D) return;

    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };

    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isTerra = !!(el.closest('.ebtn-terra,[data-terra]'));
      const id = Date.now();
      setRipples(r => [...r, { id, x: e.clientX, y: e.clientY, type: isTerra ? 'terra' : 'sage' }]);
      setTimeout(() => setRipples(r => r.filter(p => p.id !== id)), 750);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovering(!!(el.closest('button,a,[role="button"],input,select,textarea,[data-hover]')));
    };

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.10;
      ring.current.y += (pos.current.y - ring.current.y) * 0.10;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${pos.current.x}px,${pos.current.y}px) translate(-50%,-50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px) translate(-50%,-50%)`;
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);
    window.addEventListener('mouseover', onOver);
    raf.current = requestAnimationFrame(loop);
    document.documentElement.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf.current);
      document.documentElement.style.cursor = '';
    };
  }, [settings.standardCursor, settings.disable3D]);

  if (settings.standardCursor || settings.disable3D) return null;

  return (
    <>
      {/* Dot — Deep Olive */}
      <div ref={dotRef} className="pointer-events-none fixed top-0 left-0 z-[9999]" style={{ willChange: 'transform' }}>
        <div className={`rounded-full transition-all duration-150 ${hovering ? 'w-3 h-3' : 'w-2 h-2'}`}
          style={{
            background: hovering ? '#A9714E' : '#3F4A3D',
            boxShadow: hovering
              ? '0 0 10px rgba(169,113,78,0.80)'
              : '0 0 6px rgba(63,74,61,0.50)',
          }}
        />
      </div>

      {/* Ring — Sage */}
      <div ref={ringRef} className="pointer-events-none fixed top-0 left-0 z-[9998]" style={{ willChange: 'transform' }}>
        <div className={`rounded-full border-2 transition-all duration-300 ${hovering ? 'w-11 h-11' : 'w-7 h-7'}`}
          style={{
            borderColor: hovering ? 'rgba(169,113,78,0.55)' : 'rgba(156,175,136,0.55)',
            background: hovering ? 'rgba(169,113,78,0.06)' : 'transparent',
          }}
        />
      </div>

      {/* Organic ripples on click */}
      {ripples.map(rp => {
        const isTerra = rp.type === 'terra';
        const color   = isTerra ? '#A9714E' : '#9CAF88';
        return (
          <div key={rp.id} className="pointer-events-none fixed top-0 left-0 z-[9997]"
            style={{ transform: `translate(${rp.x}px,${rp.y}px) translate(-50%,-50%)` }}>
            {/* Water-drop rings */}
            {[1, 2, 3].map(i => (
              <div key={i} className="absolute rounded-full border-2"
                style={{
                  width: i * 28, height: i * 28,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  borderColor: color,
                  opacity: 0.7 - (i - 1) * 0.2,
                  animation: `clickRing ${0.45 + i * 0.12}s ease-out forwards`,
                  animationDelay: `${(i-1) * 0.07}s`,
                }}
              />
            ))}
            {/* Soft dust burst */}
            {Array.from({ length: 6 }).map((_, j) => {
              const angle = (j / 6) * Math.PI * 2;
              const particleColors = isTerra
                ? ['#A9714E','#C4926D','#D4AC95']
                : ['#9CAF88','#B5C4A4','#D4DDCD'];
              return (
                <div key={j} className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    top: '50%', left: '50%',
                    background: particleColors[j % 3],
                    animation: 'particle 0.55s ease-out forwards',
                    '--dx': `${Math.cos(angle) * 22}px`,
                    '--dy': `${Math.sin(angle) * 22}px`,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}
