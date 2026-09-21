import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface VaultProps {
  open?: boolean;
  color?: string;
  label?: string;
  amount?: number;
}

function Vault({ open = false, color = '#00E5FF', label = 'Account', amount }: VaultProps) {
  const doorRef  = useRef<THREE.Mesh>(null);
  const glowRef  = useRef<THREE.Mesh>(null);
  const targetOpen = useRef(open);
  targetOpen.current = open;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (doorRef.current) {
      const target = targetOpen.current ? -Math.PI * 0.5 : 0;
      doorRef.current.rotation.y = THREE.MathUtils.lerp(doorRef.current.rotation.y, target, 0.06);
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group>
      {/* Vault body */}
      <mesh ref={glowRef}>
        <boxGeometry args={[1.6, 2, 0.8]} />
        <meshStandardMaterial color="#0B1F33" metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* Door frame */}
      <mesh position={[0, 0, 0.41]}>
        <torusGeometry args={[0.72, 0.06, 8, 32]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* Door */}
      <group position={[-0.72, 0, 0.42]}>
        <mesh ref={doorRef} position={[0.72, 0, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 0.08, 32, 1, false, -Math.PI * 0.5, Math.PI]} />
          <meshStandardMaterial color="#132038" metalness={0.85} roughness={0.15} />
        </mesh>
      </group>
      {/* Handle */}
      <mesh position={[0, 0, 0.5]}>
        <torusGeometry args={[0.18, 0.03, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Label */}
      {label && (
        <Text position={[0, -1.3, 0.42]} fontSize={0.18} color={color} anchorX="center">{label}</Text>
      )}
      {amount !== undefined && (
        <Text position={[0, -1.6, 0.42]} fontSize={0.14} color="#9AAAC0" anchorX="center">
          ₹{amount.toLocaleString('en-IN')}
        </Text>
      )}
      {/* Interior glow when open */}
      {open && (
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color={color} transparent opacity={0.15} emissive={color} emissiveIntensity={0.6} />
        </mesh>
      )}
    </group>
  );
}

interface MoneyStream { active: boolean; amount?: number }

function MoneyParticles({ active, amount = 1000 }: MoneyStream) {
  const count = Math.min(Math.max(Math.floor(amount / 100), 8), 40);
  const particles = useRef<THREE.Points>(null);
  const phase = useRef(0);

  const geo = useRef(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = -2.5 + (i / count) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return pos;
  }).current();

  useFrame((_, delta) => {
    if (!particles.current || !active) return;
    phase.current += delta * 1.2;
    const pos = particles.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] = -2.5 + ((i / count + phase.current * 0.1) % 1) * 5;
      pos[i * 3 + 1] = Math.sin(pos[i * 3] * 2 + phase.current) * 0.2;
    }
    particles.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geo, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#19F5D2" transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

export function TransferVaultScene({ streaming = false, amount = 1000 }: { streaming?: boolean; amount?: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 48 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#00E5FF" />
      <pointLight position={[-4, 2, 3]} intensity={0.6} color="#8B7CFF" />
      <pointLight position={[4, 2, 3]} intensity={0.6} color="#19F5D2" />

      <group position={[-2.6, 0, 0]} scale={0.75}>
        <Vault open={streaming} color="#00E5FF" label="Source" amount={undefined} />
      </group>
      <group position={[2.6, 0, 0]} scale={0.75}>
        <Vault open={streaming} color="#19F5D2" label="Destination" amount={amount} />
      </group>
      <MoneyParticles active={streaming} amount={amount} />
    </Canvas>
  );
}

export function DepositVaultScene({ open = false, amount = 0 }: { open?: boolean; amount?: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 52 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1} color="#20E3A2" />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color="#00E5FF" />
      <Vault open={open} color="#20E3A2" label="Your Vault" amount={amount} />
    </Canvas>
  );
}

export function WithdrawVaultScene({ open = false }: { open?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 52 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1} color="#FFB547" />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color="#FF5C77" />
      <Vault open={open} color="#FFB547" label="Your Vault" />
    </Canvas>
  );
}
