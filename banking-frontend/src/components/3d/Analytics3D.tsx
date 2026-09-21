import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface BarData { label: string; value: number; color: string }

function Bar3D({ position, height, color, label, value }: { position:[number,number,number]; height:number; color:string; label:string; value:number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetH = useRef(0);
  targetH.current = height;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetH.current, 0.05);
    ;(meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + Math.sin(clock.getElapsedTime() * 1.5 + position[0]) * 0.1;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} metalness={0.5} roughness={0.3} transparent opacity={0.85} />
      </mesh>
      <Text position={[0, height + 0.3, 0]} fontSize={0.18} color={color} anchorX="center">
        ₹{value >= 1000 ? `${(value/1000).toFixed(1)}K` : value}
      </Text>
      <Text position={[0, -0.25, 0]} fontSize={0.14} color="#9AAAC0" anchorX="center">{label}</Text>
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[14, 6]} />
      <meshStandardMaterial color="#07111F" transparent opacity={0.6} />
    </mesh>
  );
}

export default function Analytics3D({ data }: { data: BarData[] }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const spacing = 2.2;
  const startX = -((data.length - 1) * spacing) / 2;

  return (
    <Canvas camera={{ position: [0, 3, 9], fov: 52 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 6, 6]} intensity={1} color="#00E5FF" />
      <pointLight position={[-6, 4, 2]} intensity={0.5} color="#8B7CFF" />
      <pointLight position={[6, 4, 2]} intensity={0.5} color="#20E3A2" />
      <Floor />
      {data.map((d, i) => (
        <Bar3D
          key={d.label}
          position={[startX + i * spacing, 0, 0]}
          height={Math.max((d.value / maxVal) * 3.5, 0.1)}
          color={d.color}
          label={d.label}
          value={d.value}
        />
      ))}
    </Canvas>
  );
}
