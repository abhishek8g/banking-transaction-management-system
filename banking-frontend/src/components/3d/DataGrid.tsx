import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Earthy floor grid — very subtle, warm tones
export default function DataGrid() {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];
    const cols: number[] = [];
    const size = 18; const step = 2.5;
    for (let x = -size; x <= size; x += step) {
      verts.push(x, -0.01, -size, x, -0.01, size);
      const a = Math.abs(x) / size;
      // Sage fading to transparent
      cols.push(0.612*(1-a), 0.686*(1-a), 0.533*(1-a),  0.612*(1-a), 0.686*(1-a), 0.533*(1-a));
    }
    for (let z = -size; z <= size; z += step) {
      verts.push(-size, -0.01, z, size, -0.01, z);
      const a = Math.abs(z) / size;
      cols.push(0.612*(1-a), 0.686*(1-a), 0.533*(1-a),  0.612*(1-a), 0.686*(1-a), 0.533*(1-a));
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('color',    new THREE.Float32BufferAttribute(cols, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.z = ((clock.getElapsedTime() * 0.3) % 2.5);
  });

  return (
    <lineSegments ref={ref} geometry={geometry} position={[0, -3.8, 0]}>
      <lineBasicMaterial vertexColors transparent opacity={0.15} />
    </lineSegments>
  );
}
