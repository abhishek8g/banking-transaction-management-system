import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface FinancialOrbProps {
  balance: number;
  income: number;
  expenses: number;
  transfers: number;
}

export default function FinancialOrb({ balance, income, expenses, transfers }: FinancialOrbProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.3;
      const s = 1 + Math.sin(t * 1.5) * 0.02;
      orbRef.current.scale.setScalar(s);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.2 + 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.3;
      ring2Ref.current.rotation.y = Math.sin(t * 0.2) * 0.3;
    }
  });

  const fmt = (n: number) => n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n.toFixed(0)}`;

  return (
    <group>
      {/* Core orb */}
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          color="#00d4ff"
          metalness={0.8}
          roughness={0.1}
          emissive="#00d4ff"
          emissiveIntensity={0.15}
          transparent
          opacity={0.85}
          wireframe={false}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#a855f7" transparent opacity={0.15} emissive="#a855f7" emissiveIntensity={0.4} />
      </mesh>

      {/* Rings */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.4, 0.04, 8, 64]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.025, 8, 64]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.6} transparent opacity={0.6} />
      </mesh>

      {/* Balance text */}
      <Text position={[0, 0, 0.92]} fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle" font={undefined}>
        {fmt(balance)}
      </Text>

      {/* Satellite labels */}
      <group position={[2.2, 0.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.4} metalness={0.7} roughness={0.2} />
        </mesh>
        <Text position={[0, -0.35, 0]} fontSize={0.12} color="#00ff88" anchorX="center">Income</Text>
        <Text position={[0, -0.52, 0]} fontSize={0.1} color="#ffffff" anchorX="center">{fmt(income)}</Text>
      </group>

      <group position={[-2.2, 0.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.4} metalness={0.7} roughness={0.2} />
        </mesh>
        <Text position={[0, -0.35, 0]} fontSize={0.12} color="#ec4899" anchorX="center">Expenses</Text>
        <Text position={[0, -0.52, 0]} fontSize={0.1} color="#ffffff" anchorX="center">{fmt(expenses)}</Text>
      </group>

      <group position={[0, -1.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.4} metalness={0.7} roughness={0.2} />
        </mesh>
        <Text position={[0, -0.35, 0]} fontSize={0.12} color="#fbbf24" anchorX="center">Transfers</Text>
        <Text position={[0, -0.52, 0]} fontSize={0.1} color="#ffffff" anchorX="center">{fmt(transfers)}</Text>
      </group>

      {/* Connecting lines */}
      {[[2.2, 0.8, 0], [-2.2, 0.8, 0], [0, -1.8, 0]].map((p, i) => {
        const start = new THREE.Vector3(0, 0, 0);
        const end = new THREE.Vector3(p[0] as number, p[1] as number, p[2] as number);
        const mid = start.clone().lerp(end, 0.5);
        const dir = end.clone().sub(start);
        const len = dir.length();
        const geo = new THREE.CylinderGeometry(0.01, 0.01, len * 0.65, 4);
        const mat = new THREE.MeshBasicMaterial({ color: '#00d4ff', transparent: true, opacity: 0.3 });
        return (
          <mesh key={i} geometry={geo} material={mat} position={mid} 
            quaternion={new THREE.Quaternion().setFromUnitVectors(
              new THREE.Vector3(0, 1, 0), dir.clone().normalize()
            )} />
        );
      })}
    </group>
  );
}
