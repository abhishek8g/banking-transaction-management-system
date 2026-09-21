import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SecurityShield() {
  const shieldRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (shieldRef.current) {
      shieldRef.current.rotation.y = t * 0.4;
      shieldRef.current.position.y = Math.sin(t * 0.8) * 0.1;
    }
    if (innerRef.current) {
      const s = 1 + Math.sin(t * 2) * 0.05;
      innerRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={shieldRef} scale={0.6}>
      {/* Shield body using extruded shape */}
      <mesh>
        <coneGeometry args={[0.7, 0.4, 6]} />
        <meshStandardMaterial color="#00d4ff" metalness={0.8} roughness={0.2} emissive="#00d4ff" emissiveIntensity={0.2} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.7, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#00d4ff" metalness={0.8} roughness={0.2} emissive="#00d4ff" emissiveIntensity={0.2} transparent opacity={0.9} />
      </mesh>

      {/* Inner glow */}
      <mesh ref={innerRef}>
        <coneGeometry args={[0.5, 0.28, 6]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>

      {/* Checkmark */}
      <mesh position={[0, 0.2, 0.55]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.06, 0.3, 0.04]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.12, 0.05, 0.55]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.06, 0.18, 0.04]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.8} />
      </mesh>

      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.02, 8, 48]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
