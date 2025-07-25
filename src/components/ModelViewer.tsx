import React, { Suspense, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelViewerProps {
  modelPath: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export function ModelViewer({ modelPath, autoRotate = false, rotationSpeed = 0.01 }: ModelViewerProps) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={scene.clone()} />
    </group>
  );
}

// Preload model for faster subsequent loads
useGLTF.preload('/endurance_from_interstellar_lowpoly.glb'); 