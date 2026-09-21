import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  reduceMotion?: boolean;
}

export default function ParticleField({ count = 80, reduceMotion = false }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    // Earthy palette: sage / terra / olive / warm beige
    const palette = [
      [0.612, 0.686, 0.533],  // sage   #9CAF88
      [0.663, 0.443, 0.306],  // terra  #A9714E
      [0.247, 0.290, 0.239],  // olive  #3F4A3D
      [0.961, 0.941, 0.902],  // beige  #F5F0E6
      [0.710, 0.769, 0.643],  // sage light
      [0.769, 0.573, 0.427],  // terra light
    ];
    for (let i = 0; i < count; i++) {
      pos[i*3]     = (Math.random() - 0.5) * 36;
      pos[i*3 + 1] = (Math.random() - 0.5) * 18;
      pos[i*3 + 2] = (Math.random() - 0.5) * 18 - 4;
      const p = palette[Math.floor(Math.random() * palette.length)];
      col[i*3]     = p[0];
      col[i*3 + 1] = p[1];
      col[i*3 + 2] = p[2];
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current || reduceMotion) return;
    meshRef.current.rotation.y += delta * 0.010;
    meshRef.current.rotation.x += delta * 0.003;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}
