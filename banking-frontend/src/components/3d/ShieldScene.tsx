import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import SecurityShield from './SecurityShield';

export default function ShieldScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={1} color="#00d4ff" />
        <pointLight position={[-3, -2, 2]} intensity={0.5} color="#a855f7" />
        <SecurityShield />
      </Suspense>
    </Canvas>
  );
}
