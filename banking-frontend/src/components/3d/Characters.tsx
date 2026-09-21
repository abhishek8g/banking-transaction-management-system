import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

type CharMood = 'idle' | 'success' | 'error' | 'point' | 'wave';

interface CharacterProps {
  mood?: CharMood;
  position?: [number, number, number];
  scale?: number;
  suitColor?: string;
  tieColor?: string;
  label?: string;
  speechText?: string;
}

function Character({
  mood = 'idle',
  position = [0, 0, 0],
  scale = 1,
  suitColor = '#1a2744',
  tieColor = '#00E5FF',
  label,
  speechText,
}: CharacterProps) {
  const groupRef   = useRef<THREE.Group>(null);
  const bodyRef    = useRef<THREE.Mesh>(null);
  const headRef    = useRef<THREE.Group>(null);
  const rArmRef    = useRef<THREE.Group>(null);
  const lArmRef    = useRef<THREE.Group>(null);
  const moodRef    = useRef(mood);

  useEffect(() => { moodRef.current = mood; }, [mood]);

  const skinColor = '#f5c5a3';
  const shirtColor = '#e8f4fd';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    // breathing
    if (bodyRef.current) bodyRef.current.scale.y = 1 + Math.sin(t * 1.4) * 0.012;

    // head look
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.35) * 0.18;
      headRef.current.rotation.x = Math.sin(t * 0.28) * 0.06;
    }

    const m = moodRef.current;

    // right arm
    if (rArmRef.current) {
      if (m === 'point') {
        rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, -Math.PI * 0.48, 0.06);
        rArmRef.current.rotation.z = THREE.MathUtils.lerp(rArmRef.current.rotation.z, 0.18, 0.06);
      } else if (m === 'wave') {
        rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, -Math.PI * 0.52, 0.06);
        rArmRef.current.rotation.z = Math.sin(t * 3.5) * 0.35 - 0.25;
      } else if (m === 'success') {
        rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, -Math.PI * 0.75, 0.09);
        rArmRef.current.rotation.z = THREE.MathUtils.lerp(rArmRef.current.rotation.z, -0.2, 0.09);
      } else {
        rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, Math.sin(t * 0.7) * 0.05, 0.05);
        rArmRef.current.rotation.z = THREE.MathUtils.lerp(rArmRef.current.rotation.z, 0, 0.05);
      }
    }

    // left arm
    if (lArmRef.current) {
      if (m === 'error') {
        lArmRef.current.rotation.x = THREE.MathUtils.lerp(lArmRef.current.rotation.x, -0.35, 0.06);
        lArmRef.current.rotation.z = Math.sin(t * 7) * 0.12;
      } else if (m === 'success') {
        lArmRef.current.rotation.x = THREE.MathUtils.lerp(lArmRef.current.rotation.x, -Math.PI * 0.75, 0.09);
        lArmRef.current.rotation.z = THREE.MathUtils.lerp(lArmRef.current.rotation.z, 0.2, 0.09);
      } else {
        lArmRef.current.rotation.x = THREE.MathUtils.lerp(lArmRef.current.rotation.x, Math.sin(t * 0.7 + 1) * 0.05, 0.05);
        lArmRef.current.rotation.z = THREE.MathUtils.lerp(lArmRef.current.rotation.z, 0, 0.05);
      }
    }

    // body sway
    groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.04;
    if (m === 'success') {
      groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 4.5)) * 0.12;
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1], 0.06);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Legs */}
      {[-0.17, 0.17].map((x, i) => (
        <mesh key={i} position={[x, -1.1, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.9, 8]} />
          <meshStandardMaterial color={suitColor} roughness={0.7} />
        </mesh>
      ))}
      {/* Shoes */}
      {[-0.17, 0.17].map((x, i) => (
        <mesh key={i} position={[x, -1.58, 0.06]}>
          <boxGeometry args={[0.2, 0.09, 0.36]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.5} />
        </mesh>
      ))}
      {/* Body */}
      <mesh ref={bodyRef} position={[0, -0.2, 0]}>
        <capsuleGeometry args={[0.3, 0.58, 8, 16]} />
        <meshStandardMaterial color={suitColor} roughness={0.65} />
      </mesh>
      {/* Shirt */}
      <mesh position={[0, -0.12, 0.27]}>
        <boxGeometry args={[0.2, 0.52, 0.04]} />
        <meshStandardMaterial color={shirtColor} roughness={0.9} />
      </mesh>
      {/* Tie */}
      <mesh position={[0, -0.24, 0.29]}>
        <boxGeometry args={[0.065, 0.36, 0.03]} />
        <meshStandardMaterial color={tieColor} roughness={0.4} emissive={tieColor} emissiveIntensity={0.3} />
      </mesh>
      {/* Right arm */}
      <group ref={rArmRef} position={[0.44, -0.05, 0]}>
        <mesh position={[0, -0.27, 0]}>
          <capsuleGeometry args={[0.09, 0.4, 6, 8]} />
          <meshStandardMaterial color={suitColor} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
      </group>
      {/* Left arm */}
      <group ref={lArmRef} position={[-0.44, -0.05, 0]}>
        <mesh position={[0, -0.27, 0]}>
          <capsuleGeometry args={[0.09, 0.4, 6, 8]} />
          <meshStandardMaterial color={suitColor} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
      </group>
      {/* Neck */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.17, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>
      {/* Head group */}
      <group ref={headRef} position={[0, 0.73, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.17, -0.03]}>
          <sphereGeometry args={[0.27, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.44]} />
          <meshStandardMaterial color="#1a1200" roughness={0.9} />
        </mesh>
        {/* Eyes */}
        {[-0.09, 0.09].map((x, i) => (
          <group key={i} position={[x, 0.04, 0.27]}>
            <mesh><sphereGeometry args={[0.038, 8, 8]} /><meshStandardMaterial color="#1a1a2e" /></mesh>
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshStandardMaterial color={tieColor} emissive={tieColor} emissiveIntensity={0.9} />
            </mesh>
          </group>
        ))}
        {/* Smile */}
        <mesh position={[0, -0.07, 0.28]} rotation={[0.1, 0, 0]}>
          <torusGeometry args={[0.075, 0.014, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#c0392b" roughness={0.8} />
        </mesh>
      </group>
      {/* Ground glow */}
      <mesh position={[0, -1.63, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 32]} />
        <meshStandardMaterial color={tieColor} transparent opacity={0.12} emissive={tieColor} emissiveIntensity={0.4} />
      </mesh>
      {/* Speech text */}
      {speechText && (
        <group position={[0.6, 1.3, 0]}>
          <mesh>
            <boxGeometry args={[1.4, 0.35, 0.02]} />
            <meshStandardMaterial color="#0B1F33" transparent opacity={0.85} />
          </mesh>
          <Text position={[0, 0, 0.02]} fontSize={0.1} color="#00E5FF" anchorX="center" anchorY="middle" maxWidth={1.3}>
            {speechText}
          </Text>
        </group>
      )}
      {label && (
        <Text position={[0, -2.0, 0]} fontSize={0.13} color="#9AAAC0" anchorX="center">{label}</Text>
      )}
    </group>
  );
}

// ── 6 specialised characters ──────────────────────────────────────────────────

export function AssistantCharacter(p: Omit<CharacterProps, 'suitColor' | 'tieColor'>) {
  return <Character {...p} suitColor="#3F4A3D" tieColor="#9CAF88" label="Banking Assistant" />;
}
export function SpecialistCharacter(p: Omit<CharacterProps, 'suitColor' | 'tieColor'>) {
  return <Character {...p} suitColor="#566154" tieColor="#A9714E" label="Transaction Specialist" />;
}
export function GuardianCharacter(p: Omit<CharacterProps, 'suitColor' | 'tieColor'>) {
  return <Character {...p} suitColor="#2B3329" tieColor="#9CAF88" label="Security Guardian" />;
}
export function AnalystCharacter(p: Omit<CharacterProps, 'suitColor' | 'tieColor'>) {
  return <Character {...p} suitColor="#3F4A3D" tieColor="#C4926D" label="Financial Analyst" />;
}
export function AdminCharacter(p: Omit<CharacterProps, 'suitColor' | 'tieColor'>) {
  return <Character {...p} suitColor="#566154" tieColor="#9CAF88" label="Admin Specialist" />;
}
export function SupportCharacter(p: Omit<CharacterProps, 'suitColor' | 'tieColor'>) {
  return <Character {...p} suitColor="#3F4A3D" tieColor="#A9714E" label="Support Assistant" />;
}

export default Character;
