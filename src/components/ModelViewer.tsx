import React, { Suspense, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelViewerProps {
  modelPath: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  rotationAxis?: 'x' | 'y' | 'z';
  meshMode?: boolean;
  meshOpacity?: number;
}

export function ModelViewer({ 
  modelPath, 
  autoRotate = false, 
  rotationSpeed = 0.01,
  rotationAxis = 'x',
  meshMode = false,
  meshOpacity = 0.5
}: ModelViewerProps) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);

  // Apply mesh settings to all materials in the scene
  const applyMeshSettings = () => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (meshMode) {
            // Create wireframe material
            const wireframeMaterial = new THREE.MeshBasicMaterial({
              color: 0x00ffff,
              wireframe: true,
              transparent: true,
              opacity: meshOpacity
            });
            child.material = wireframeMaterial;
          } else {
            // Restore original material with opacity
            if (child.material) {
              child.material.transparent = true;
              child.material.opacity = meshOpacity;
              child.material.needsUpdate = true;
            }
          }
        }
      });
    }
  };

  // Apply settings when mesh mode or opacity changes
  useEffect(() => {
    applyMeshSettings();
  }, [meshMode, meshOpacity]);

  // Apply settings when ref becomes available
  useEffect(() => {
    if (meshRef.current) {
      applyMeshSettings();
    }
  }, [meshRef.current]);

  useFrame(() => {
    if (meshRef.current && autoRotate) {
      // Apply rotation based on selected axis
      switch (rotationAxis) {
        case 'x':
          meshRef.current.rotation.x += rotationSpeed;
          break;
        case 'y':
          meshRef.current.rotation.y += rotationSpeed;
          break;
        case 'z':
          meshRef.current.rotation.z += rotationSpeed;
          break;
      }
    }
    
    // Reapply mesh settings every frame to ensure they persist during rotation
    if (meshRef.current) {
      applyMeshSettings();
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