import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingCoinProps {
  position: [number, number, number];
  color?: string;
  speed?: number;
  phase?: number;
  shape?: 'coin' | 'gem' | 'disc' | 'sphere';
}

export default function FloatingCoin({ position, color = '#9CAF88', speed = 1, phase = 0, shape = 'sphere' }: FloatingCoinProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + phase;
    ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.30;
    ref.current.rotation.y = t * 0.55;
    ref.current.rotation.x = Math.sin(t * 0.35) * 0.12;
  });

  return (
    <mesh ref={ref} position={position}>
      {shape === 'coin'   && <cylinderGeometry args={[0.28, 0.28, 0.07, 32]} />}
      {shape === 'gem'    && <dodecahedronGeometry args={[0.24, 0]} />}
      {shape === 'disc'   && <cylinderGeometry args={[0.20, 0.26, 0.09, 6]} />}
      {shape === 'sphere' && <sphereGeometry args={[0.22, 16, 16]} />}
      <meshStandardMaterial
        color={color}
        metalness={0.4}
        roughness={0.55}
        emissive={color}
        emissiveIntensity={0.06}
      />
    </mesh>
  );
}
