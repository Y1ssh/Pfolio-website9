import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ModelViewer } from './ModelViewer';

export function Scene() {
  const [leftRotating, setLeftRotating] = useState(false);
  const [leftPosition, setLeftPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [leftScale, setLeftScale] = useState(1);
  const [meshMode, setMeshMode] = useState(false);
  const [meshOpacity, setMeshOpacity] = useState(0.5);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [rotationAxis, setRotationAxis] = useState<'x' | 'y' | 'z'>('x');

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
              leftRotating ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {leftRotating ? 'Stop Rotation' : 'Start Rotation'}
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

      {/* Mesh Settings Panel */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-gray-900 bg-opacity-90 p-4 rounded-lg">
        <h3 className="text-white text-sm font-bold mb-3">Mesh Settings</h3>
        
        {/* Mesh Mode Toggle */}
        <div className="flex items-center space-x-2 mb-3">
          <label className="text-white text-xs">Mesh Mode:</label>
          <button
            onClick={() => setMeshMode(!meshMode)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              meshMode ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {meshMode ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Rotation Axis Selection */}
        <div className="mb-3">
          <label className="text-white text-xs block mb-1">Rotation Axis:</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setRotationAxis('x')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                rotationAxis === 'x' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              X-Axis
            </button>
            <button
              onClick={() => setRotationAxis('y')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                rotationAxis === 'y' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Y-Axis
            </button>
            <button
              onClick={() => setRotationAxis('z')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                rotationAxis === 'z' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Z-Axis
            </button>
          </div>
        </div>

        {/* Rotation Speed Slider */}
        <div className="mb-3">
          <label className="text-white text-xs block mb-1">Rotation Speed: {rotationSpeed.toFixed(3)}</label>
          <input
            type="range"
            min="0"
            max="0.05"
            step="0.001"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(rotationSpeed / 0.05) * 100}%, #374151 ${(rotationSpeed / 0.05) * 100}%, #374151 100%)`
            }}
          />
        </div>

        {/* Mesh Opacity Slider */}
        <div className="mb-3">
          <label className="text-white text-xs block mb-1">Mesh Opacity: {meshOpacity.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={meshOpacity}
            onChange={(e) => setMeshOpacity(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${meshOpacity * 100}%, #374151 ${meshOpacity * 100}%, #374151 100%)`
            }}
          />
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
              rotationSpeed={rotationSpeed}
              rotationAxis={rotationAxis}
              meshMode={meshMode}
              meshOpacity={meshOpacity}
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