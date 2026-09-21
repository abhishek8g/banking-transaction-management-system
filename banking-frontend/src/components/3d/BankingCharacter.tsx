import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type CharacterMood = 'idle' | 'success' | 'error' | 'point' | 'wave';

interface BankingCharacterProps {
  mood?: CharacterMood;
  position?: [number, number, number];
  scale?: number;
}

export default function BankingCharacter({ mood = 'idle', position = [0, 0, 0], scale = 1 }: BankingCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const moodRef = useRef(mood);

  useEffect(() => { moodRef.current = mood; }, [mood]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    // Idle breathing
    if (bodyRef.current) bodyRef.current.scale.y = 1 + Math.sin(t * 1.5) * 0.01;

    // Head subtle look-around
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.4) * 0.15;
      headRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
    }

    const m = moodRef.current;
    if (rightArmRef.current) {
      if (m === 'point') {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI * 0.45, 0.05);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0.2, 0.05);
      } else if (m === 'wave') {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI * 0.5, 0.05);
        rightArmRef.current.rotation.z = Math.sin(t * 4) * 0.3 - 0.3;
      } else if (m === 'success') {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI * 0.7, 0.08);
      } else {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, Math.sin(t * 0.8) * 0.05, 0.05);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, 0.05);
      }
    }

    if (leftArmRef.current) {
      if (m === 'error') {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.3, 0.05);
        leftArmRef.current.rotation.z = Math.sin(t * 8) * 0.1;
      } else {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, Math.sin(t * 0.8 + 1) * 0.05, 0.05);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0, 0.05);
      }
    }

    // Body sway
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
    if (m === 'success') groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 4)) * 0.1;
    else groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1], 0.05);
  });

  const suitColor = '#1a2744';
  const shirtColor = '#e8f4fd';
  const skinColor = '#f5c5a3';
  const hairColor = '#2d1b00';
  const tieColor = '#00d4ff';

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Legs */}
      <mesh position={[-0.18, -1.1, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.9, 8]} />
        <meshStandardMaterial color={suitColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.18, -1.1, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.9, 8]} />
        <meshStandardMaterial color={suitColor} roughness={0.7} />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.18, -1.6, 0.06]}>
        <boxGeometry args={[0.22, 0.1, 0.38]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0.18, -1.6, 0.06]}>
        <boxGeometry args={[0.22, 0.1, 0.38]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Body / Suit jacket */}
      <mesh ref={bodyRef} position={[0, -0.2, 0]}>
        <capsuleGeometry args={[0.32, 0.6, 8, 16]} />
        <meshStandardMaterial color={suitColor} roughness={0.7} />
      </mesh>
      {/* Shirt & Tie */}
      <mesh position={[0, -0.1, 0.28]}>
        <boxGeometry args={[0.22, 0.55, 0.04]} />
        <meshStandardMaterial color={shirtColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.22, 0.3]}>
        <boxGeometry args={[0.07, 0.38, 0.03]} />
        <meshStandardMaterial color={tieColor} roughness={0.5} emissive={tieColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.46, -0.05, 0]}>
        <mesh position={[0, -0.28, 0]}>
          <capsuleGeometry args={[0.1, 0.42, 6, 8]} />
          <meshStandardMaterial color={suitColor} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.11, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
      </group>

      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.46, -0.05, 0]}>
        <mesh position={[0, -0.28, 0]}>
          <capsuleGeometry args={[0.1, 0.42, 6, 8]} />
          <meshStandardMaterial color={suitColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.11, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.18, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.75, 0]}>
        <mesh>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.18, -0.04]}>
          <sphereGeometry args={[0.29, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.1, 0.05, 0.28]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.1} />
        </mesh>
        <mesh position={[0.1, 0.05, 0.28]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.1} />
        </mesh>
        {/* Eye glow */}
        <mesh position={[-0.1, 0.05, 0.3]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.1, 0.05, 0.3]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} />
        </mesh>
        {/* Smile */}
        <mesh position={[0, -0.08, 0.3]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.08, 0.015, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#c0392b" roughness={0.8} />
        </mesh>
      </group>

      {/* Ambient glow under feet */}
      <mesh position={[0, -1.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#00d4ff" transparent opacity={0.15} emissive="#00d4ff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}
