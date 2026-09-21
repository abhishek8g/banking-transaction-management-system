import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FinancialOrb from './FinancialOrb';

interface OrbSceneProps {
  balance: number;
  income: number;
  expenses: number;
  transfers: number;
}

export default function OrbScene({ balance, income, expenses, transfers }: OrbSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 50 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00d4ff" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#a855f7" />
        <FinancialOrb balance={balance} income={income} expenses={expenses} transfers={transfers} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Suspense>
    </Canvas>
  );
}
