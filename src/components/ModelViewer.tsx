import React, { Suspense, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelViewerProps {
  modelPath: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  meshMode?: boolean;
  meshOpacity?: number;
  meshLineDensity?: number;
  theme?: 'dark' | 'light';
}

export function ModelViewer({ 
  modelPath, 
  autoRotate = false, 
  rotationSpeed = 0.01,
  meshMode = false,
  meshOpacity = 0.5,
  meshLineDensity = 1,
  theme = 'dark'
}: ModelViewerProps) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);
  const originalMaterials = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());
  const wireframeGroups = useRef<THREE.Group[]>([]);

  // Store original materials when component mounts
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          originalMaterials.current.set(child, child.material);
        }
      });
    }
  }, []);

  // Clean up wireframe groups
  const cleanupWireframes = () => {
    wireframeGroups.current.forEach(group => {
      group.parent?.remove(group);
      group.children.forEach(child => {
        if (child instanceof THREE.LineSegments) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });
    wireframeGroups.current = [];
  };

  // Apply mesh settings to all materials in the scene
  const applyMeshSettings = () => {
    if (!meshRef.current) return;

    cleanupWireframes();

    meshRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (meshMode) {
          // Hide original mesh
          child.visible = false;
          
          // Create wireframe with adjustable density - invert mapping for intuitive control
          const thresholdAngle = 5 / meshLineDensity; // Invert: higher slider = fewer lines
          const edgesGeometry = new THREE.EdgesGeometry(child.geometry, thresholdAngle);
          const wireframeMaterial = new THREE.LineBasicMaterial({
            color: theme === 'dark' ? 0xffffff : 0x000000,
            transparent: true,
            opacity: meshOpacity,
            linewidth: 1
          });
          
          const wireframe = new THREE.LineSegments(edgesGeometry, wireframeMaterial);
          wireframe.position.copy(child.position);
          wireframe.rotation.copy(child.rotation);
          wireframe.scale.copy(child.scale);
          
          // Create a group to hold the wireframe
          const wireframeGroup = new THREE.Group();
          wireframeGroup.add(wireframe);
          
          // Add to parent and store reference
          if (child.parent) {
            child.parent.add(wireframeGroup);
            wireframeGroups.current.push(wireframeGroup);
          }
        } else {
          // Show original mesh
          child.visible = true;
          
          // Restore original material
          if (originalMaterials.current.has(child)) {
            child.material = originalMaterials.current.get(child)!;
          }
        }
      }
    });
  };

  // Apply settings when mesh mode, opacity, or density changes
  useEffect(() => {
    if (meshRef.current) {
      applyMeshSettings();
    }

    // Cleanup on unmount
    return () => {
      if (meshRef.current) {
        cleanupWireframes();
        // Restore original materials
        meshRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && originalMaterials.current.has(child)) {
            child.visible = true;
            child.material = originalMaterials.current.get(child)!;
          }
        });
      }
    };
  }, [meshMode, meshOpacity, meshLineDensity, theme]);

  // Apply settings when ref becomes available
  useEffect(() => {
    if (meshRef.current) {
      applyMeshSettings();
    }
  }, [meshRef.current]);

  useFrame(() => {
    if (meshRef.current && autoRotate) {
      // Z-axis rotation (front-to-back like a cartwheel)
      meshRef.current.rotation.z += rotationSpeed;
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
useGLTF.preload('assets/models/lander_from_interstellar.glb');
useGLTF.preload('assets/models/ranger_ship_of_interstellar_free.glb');
