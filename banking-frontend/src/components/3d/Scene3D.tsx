import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ParticleField from './ParticleField';
import DataGrid from './DataGrid';
import FloatingCoin from './FloatingCoin';
import {
  AssistantCharacter, SpecialistCharacter, GuardianCharacter,
  AnalystCharacter, AdminCharacter, SupportCharacter,
} from './Characters';

type CharMood = 'idle' | 'success' | 'error' | 'point' | 'wave';
type CharType = 'assistant' | 'specialist' | 'guardian' | 'analyst' | 'admin' | 'support';

interface Scene3DProps {
  mood?: CharMood;
  character?: CharType;
  reduceMotion?: boolean;
  speechText?: string;
}

const CharMap: Record<CharType, React.ComponentType<any>> = {
  assistant:  AssistantCharacter,
  specialist: SpecialistCharacter,
  guardian:   GuardianCharacter,
  analyst:    AnalystCharacter,
  admin:      AdminCharacter,
  support:    SupportCharacter,
};

function CameraRig({ reduceMotion }: { reduceMotion: boolean }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion || typeof window === 'undefined') return;
    const h = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, [reduceMotion]);

  useFrame(() => {
    if (reduceMotion) return;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.18, 0.022);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current.y * 0.12 + 1.5, 0.022);
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

export default function Scene3D({ mood = 'idle', character = 'assistant', reduceMotion = false, speechText }: Scene3DProps) {
  const CharComponent = CharMap[character];

  return (
    <Canvas
      camera={{ position: [0, 1.5, 7], fov: 52 }}
      gl={{ antialias: !reduceMotion, alpha: true }}
      dpr={[1, reduceMotion ? 1 : 1.5]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        {/* Warm natural lighting */}
        <ambientLight intensity={0.70} color="#FBF8F3" />
        <pointLight position={[5, 5, 5]}   intensity={0.80} color="#C4926D" />   {/* warm terra */}
        <pointLight position={[-5, 3, 3]}  intensity={0.50} color="#9CAF88" />   {/* sage fill */}
        <pointLight position={[0, -2, 4]}  intensity={0.25} color="#F5F0E6" />   {/* soft beige */}
        <directionalLight position={[2, 8, 3]} intensity={0.40} color="#EDE6D6" />

        <ParticleField count={reduceMotion ? 25 : 80} reduceMotion={reduceMotion} />
        {!reduceMotion && <DataGrid />}

        {/* Character */}
        <CharComponent mood={mood} position={[2.6, -1.6, 0]} scale={0.82} speechText={speechText} />

        {/* Floating earthy objects — ceramic spheres, wooden discs */}
        <FloatingCoin position={[-2.8,  0.6, -1.0]} color="#9CAF88" speed={0.55} phase={0} shape="sphere" />
        <FloatingCoin position={[-3.4, -0.3, -1.5]} color="#3F4A3D" speed={0.70} phase={2} shape="disc"   />
        <FloatingCoin position={[-2.1,  1.1, -2.0]} color="#A9714E" speed={0.50} phase={4} shape="gem"    />
        <FloatingCoin position={[ 3.8,  0.8, -2.5]} color="#C4926D" speed={0.45} phase={1} shape="sphere" />
        <FloatingCoin position={[ 4.2, -0.5, -1.8]} color="#9CAF88" speed={0.80} phase={3} shape="coin"   />

        <CameraRig reduceMotion={reduceMotion} />
      </Suspense>
    </Canvas>
  );
}
