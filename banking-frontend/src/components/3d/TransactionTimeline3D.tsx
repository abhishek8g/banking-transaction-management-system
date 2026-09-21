import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Transaction } from '../../types';

interface NodeProps {
  position: [number, number, number];
  tx: Transaction;
  selected: boolean;
  onClick: () => void;
}

const TYPE_COLOR: Record<string, string> = {
  DEPOSIT: '#20E3A2',
  WITHDRAWAL: '#FF5C77',
  TRANSFER: '#00E5FF',
};

function TxNode({ position, tx, selected, onClick }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = TYPE_COLOR[tx.transactionType] || '#00E5FF';

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const target = selected ? 1.4 : 1.0;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, target, 0.1));
    meshRef.current.rotation.y = t * (selected ? 1.5 : 0.4);
    ;(meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = selected
      ? 0.8 + Math.sin(t * 4) * 0.2
      : 0.3 + Math.sin(t * 1.5) * 0.1;
  });

  return (
    <group position={position} onClick={onClick}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.7} roughness={0.2} transparent opacity={0.9} />
      </mesh>
      <Text position={[0, 0.45, 0]} fontSize={0.13} color={color} anchorX="center">
        {tx.transactionType === 'DEPOSIT' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
      </Text>
      {selected && (
        <>
          <Text position={[0, 0.65, 0]} fontSize={0.09} color="#9AAAC0" anchorX="center">
            {new Date(tx.createdAt).toLocaleDateString('en-IN')}
          </Text>
          <Text position={[0, -0.45, 0]} fontSize={0.09} color={color} anchorX="center">
            {tx.status}
          </Text>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color={color} transparent opacity={0.07} emissive={color} emissiveIntensity={0.15} />
          </mesh>
        </>
      )}
    </group>
  );
}

function ConnectionLine({ from, to, color }: { from: [number,number,number]; to: [number,number,number]; color: string }) {
  const lineRef = useRef<THREE.Line>(null);
  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    (lineRef.current.material as THREE.LineBasicMaterial).opacity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
  });

  const pts = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  const geo = new THREE.BufferGeometry().setFromPoints(pts);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <primitive object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 }))} ref={lineRef as any} />
  );
}

interface TimelineSceneProps {
  transactions: Transaction[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

function TimelineScene({ transactions, selectedId, onSelect }: TimelineSceneProps) {
  const shown = transactions.slice(0, 7);
  const spacing = 1.6;
  const startX = -((shown.length - 1) * spacing) / 2;

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 4]} intensity={1} color="#00E5FF" />
      <pointLight position={[-6, 2, 2]} intensity={0.4} color="#8B7CFF" />
      <pointLight position={[6, 2, 2]} intensity={0.4} color="#19F5D2" />

      {shown.map((tx, i) => {
        const x = startX + i * spacing;
        const color = TYPE_COLOR[tx.transactionType] || '#00E5FF';
        return (
          <group key={tx.id}>
            <TxNode
              position={[x, 0, 0]}
              tx={tx}
              selected={selectedId === tx.id}
              onClick={() => onSelect(tx.id)}
            />
            {i < shown.length - 1 && (
              <ConnectionLine
                from={[x + 0.22, 0, 0]}
                to={[startX + (i + 1) * spacing - 0.22, 0, 0]}
                color={color}
              />
            )}
          </group>
        );
      })}
    </>
  );
}

export default function TransactionTimeline3D({ transactions, selectedId, onSelect }: TimelineSceneProps) {
  return (
    <Canvas camera={{ position: [0, 1.5, 6], fov: 55 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
      <TimelineScene transactions={transactions} selectedId={selectedId} onSelect={onSelect} />
    </Canvas>
  );
}
