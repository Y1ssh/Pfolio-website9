import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ModelViewer } from './ModelViewer';

export function Scene() {
  const [leftRotating, setLeftRotating] = useState(false);
  const [leftPosition, setLeftPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [leftScale, setLeftScale] = useState(1);

  return (
    <div className="w-full h-screen bg-space-black">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-white text-xl font-bold mb-2">GLB Model Viewer</h1>
        <button
          onClick={() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
              const controls = (canvas as any).__r3f?.controls;
              if (controls) {
                controls.reset();
              }
            }
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Reset Camera
        </button>
      </div>

      {/* Model Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        {/* Rotation Controls */}
        <div className="flex space-x-2">
          <button
            onClick={() => setLeftRotating(!leftRotating)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              leftRotating ? 'bg-space-blue text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Rotate Model
          </button>
        </div>

        {/* Position Controls */}
        <div className="flex space-x-2">
          <button
            onClick={() => setLeftPosition([leftPosition[0] - 1, leftPosition[1], leftPosition[2]])}
            className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            ←
          </button>
          <button
            onClick={() => setLeftPosition([leftPosition[0] + 1, leftPosition[1], leftPosition[2]])}
            className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            →
          </button>
        </div>

        {/* Scale Controls */}
        <div className="flex space-x-2">
          <button
            onClick={() => setLeftScale(Math.max(0.5, leftScale - 0.1))}
            className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            -
          </button>
          <button
            onClick={() => setLeftScale(Math.min(3, leftScale + 0.1))}
            className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            +
          </button>
        </div>
      </div>

      {/* Single 3D Scene */}
      <Canvas
        camera={{ 
          position: [0, 0, 8], 
          fov: 45 
        }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <Environment preset="city" />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={50}
          target={[0, 0, 0]}
        />

        {/* Model - Endurance (Low Poly) */}
        <group position={leftPosition} scale={[leftScale, leftScale, leftScale]}>
          <Suspense fallback={null}>
            <ModelViewer 
              modelPath="/endurance_from_interstellar_lowpoly.glb" 
              autoRotate={leftRotating}
              rotationSpeed={0.01}
            />
          </Suspense>
        </group>
      </Canvas>

      {/* Model Label */}
      <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
        Endurance (Low Poly)
      </div>
    </div>
  );
} 