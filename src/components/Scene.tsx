import React, { Suspense, useState, useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, TransformControls } from '@react-three/drei';
import { ModelViewer } from './ModelViewer';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { TransformControls as TransformControlsImpl } from 'three-stdlib';


interface ModelSettings {
  id: string;
  name: string;
  modelPath: string;
  position: [number, number, number];
  scale: number;
  autoRotate: boolean;
  rotationSpeed: number;
  meshMode: boolean;
  meshOpacity: number;
  meshLineDensity: number;
  isLocked: boolean;
}

const initialModels: ModelSettings[] = [
  { id: 'endurance', name: 'Endurance', modelPath: '/endurance_from_interstellar_lowpoly.glb', position: [0, 0, 0], scale: 1, autoRotate: false, rotationSpeed: 0.001, meshMode: false, meshOpacity: 0.5, meshLineDensity: 1, isLocked: false },
  { id: 'lander', name: 'Lander', modelPath: 'assets/models/lander_from_interstellar.glb', position: [-15, 0, 0], scale: 1, autoRotate: false, rotationSpeed: 0.001, meshMode: false, meshOpacity: 0.5, meshLineDensity: 1, isLocked: false },
  { id: 'ranger', name: 'Ranger', modelPath: 'assets/models/ranger_ship_of_interstellar_free.glb', position: [15, 0, 0], scale: 1, autoRotate: false, rotationSpeed: 0.001, meshMode: false, meshOpacity: 0.5, meshLineDensity: 1, isLocked: false },
];

interface SceneProps {
  onToggleLandingPage: () => void;
  onToggleTheme: () => void;
  theme: 'dark' | 'light';
}

export function Scene({ onToggleLandingPage, onToggleTheme, theme }: SceneProps) {
    const [models, setModels] = useState<ModelSettings[]>(initialModels);
    const [selectedModelId, setSelectedModelId] = useState<string>('endurance');
    
    const orbitControlsRef = useRef<OrbitControlsImpl>(null);
    const transformControlsRef = useRef<TransformControlsImpl>(null);
    const modelRefs = useRef<Record<string, THREE.Group | null>>({});

    useEffect(() => {
        if (transformControlsRef.current) {
            const controls = transformControlsRef.current;
            const callback = (event: any) => {
                if (orbitControlsRef.current) {
                    orbitControlsRef.current.enabled = !event.value;
                }
            };
            controls.addEventListener('dragging-changed', callback);
            return () => controls.removeEventListener('dragging-changed', callback);
        }
    });

    const selectedModel = useMemo(() => models.find(m => m.id === selectedModelId)!, [models, selectedModelId]);

    const updateSelectedModel = (key: keyof ModelSettings, value: any) => {
        setModels(prevModels =>
            prevModels.map(model =>
                model.id === selectedModelId ? { ...model, [key]: value } : model
            )
        );
    };
    
    const isLightTheme = theme === 'light';
    const bgColor = isLightTheme ? 'bg-white' : 'bg-space-black';
    const textColor = isLightTheme ? 'text-black' : 'text-white';
    const buttonBgColor = isLightTheme ? 'bg-gray-200' : 'bg-gray-800';
    const buttonHoverBgColor = isLightTheme ? 'bg-gray-300' : 'bg-gray-700';
    const panelBgColor = isLightTheme ? 'bg-gray-100 bg-opacity-90' : 'bg-gray-900 bg-opacity-90';
    const sceneBgColor = isLightTheme ? '#ffffff' : '#1a1a1a';

    return (
        <div className={`w-full h-screen ${bgColor}`}>
            {/* Header */}
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                <h1 className={`${textColor} text-xl font-bold`}>GLB Model Viewer</h1>
                <button
                    onClick={onToggleTheme}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${buttonBgColor} ${textColor} hover:${buttonHoverBgColor} transition-colors`}
                >
                    Toggle Theme
                </button>
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${buttonBgColor} ${textColor} hover:${buttonHoverBgColor} transition-colors`}
                >
                    Reset Camera
                </button>
                <button
                    onClick={onToggleLandingPage}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${buttonBgColor} ${textColor} hover:${buttonHoverBgColor} transition-colors`}
                >
                    Toggle Landing Page
                </button>
            </div>

            {/* Model Controls for Selected Model */}
            <div className={`absolute top-4 right-4 z-10 ${panelBgColor} p-4 rounded-lg flex flex-col space-y-2`}>
                 <h3 className={`${textColor} text-sm font-bold mb-1 text-center`}>Controls: {selectedModel.name}</h3>
                {/* Rotation Controls */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => updateSelectedModel('autoRotate', !selectedModel.autoRotate)}
                        className={`w-full px-3 py-1 rounded text-xs font-medium transition-colors ${
                            selectedModel.autoRotate ? 'bg-blue-600 text-white' : `${buttonBgColor} ${textColor} hover:${buttonHoverBgColor}`
                        }`}
                    >
                        {selectedModel.autoRotate ? 'Stop Rotation' : 'Start Rotation'}
                    </button>
                </div>

                {/* Lock Controls */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => updateSelectedModel('isLocked', !selectedModel.isLocked)}
                        className={`w-full px-3 py-1 rounded text-xs font-medium transition-colors ${
                            selectedModel.isLocked ? 'bg-red-600 text-white' : `${buttonBgColor} ${textColor} hover:${buttonHoverBgColor}`
                        }`}
                    >
                        {selectedModel.isLocked ? 'Unlock' : 'Lock Position'}
                    </button>
                </div>

                {/* Scale Controls */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => updateSelectedModel('scale', Math.max(0.1, selectedModel.scale - 0.1))}
                        className={`px-2 py-1 rounded text-xs ${buttonBgColor} ${textColor} hover:${buttonHoverBgColor}`}
                    >
                        -
                    </button>
                    <span className={`${textColor} text-xs self-center`}>Scale</span>
                    <button
                        onClick={() => updateSelectedModel('scale', Math.min(5, selectedModel.scale + 0.1))}
                        className={`px-2 py-1 rounded text-xs ${buttonBgColor} ${textColor} hover:${buttonHoverBgColor}`}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Mesh Settings Panel */}
            <div className={`absolute top-1/2 left-4 transform -translate-y-1/2 z-10 ${panelBgColor} p-4 rounded-lg`}>
                <h3 className={`${textColor} text-sm font-bold mb-3`}>Mesh Settings: {selectedModel.name}</h3>
                
                {/* Mesh Mode Toggle */}
                <div className="flex items-center space-x-2 mb-3">
                    <label className={`${textColor} text-xs`}>Mesh Mode:</label>
                    <button
                        onClick={() => updateSelectedModel('meshMode', !selectedModel.meshMode)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            selectedModel.meshMode ? 'bg-blue-600 text-white' : `bg-gray-700 ${textColor} hover:bg-gray-600`
                        }`}
                    >
                        {selectedModel.meshMode ? 'ON' : 'OFF'}
                    </button>
                </div>

                {/* Rotation Speed Slider */}
                <div className="mb-3">
                    <label className={`${textColor} text-xs block mb-1`}>Rotation Speed: {selectedModel.rotationSpeed.toFixed(4)}</label>
                    <input
                        type="range"
                        min="0"
                        max="0.02"
                        step="0.0001"
                        value={selectedModel.rotationSpeed}
                        onChange={(e) => updateSelectedModel('rotationSpeed', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(selectedModel.rotationSpeed / 0.02) * 100}%, #374151 ${(selectedModel.rotationSpeed / 0.02) * 100}%, #374151 100%)`
                        }}
                    />
                </div>

                {/* Mesh Opacity Slider */}
                <div className="mb-3">
                    <label className={`${textColor} text-xs block mb-1`}>Mesh Opacity: {selectedModel.meshOpacity.toFixed(2)}</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={selectedModel.meshOpacity}
                        onChange={(e) => updateSelectedModel('meshOpacity', parseFloat(e.target.value))}
                        disabled={!selectedModel.meshMode}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${selectedModel.meshOpacity * 100}%, #374151 ${selectedModel.meshOpacity * 100}%, #374151 100%)`
                        }}
                    />
                </div>

                {/* Mesh Line Density Slider */}
                <div className="mb-3">
                    <label className={`${textColor} text-xs block mb-1`}>Mesh Line Density: {selectedModel.meshLineDensity.toFixed(1)}</label>
                    <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={selectedModel.meshLineDensity}
                        onChange={(e) => updateSelectedModel('meshLineDensity', parseFloat(e.target.value))}
                        disabled={!selectedModel.meshMode}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(selectedModel.meshLineDensity / 5) * 100}%, #374151 ${(selectedModel.meshLineDensity / 5) * 100}%, #374151 100%)`
                        }}
                    />
                </div>
            </div>

            <Canvas
                camera={{ position: [0, 0, 25], fov: 45 }}
                gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
                dpr={[1, 2]}
            >
                <color attach="background" args={[sceneBgColor]} />
                <Environment preset="city" />
                <OrbitControls ref={orbitControlsRef} enablePan={true} enableZoom={true} enableRotate={true} minDistance={3} maxDistance={100} target={[0, 0, 0]} />

                {selectedModel && !selectedModel.isLocked && modelRefs.current[selectedModelId] && (
                    <TransformControls
                        ref={transformControlsRef}
                        object={modelRefs.current[selectedModelId]!}
                        mode="translate"
                        onObjectChange={(e) => {
                            const model = modelRefs.current[selectedModelId];
                            if (model) {
                                const pos = model.position;
                                updateSelectedModel('position', [pos.x, pos.y, pos.z]);
                            }
                        }}
                    />
                )}

                {models.map(model => (
                    <group
                        key={model.id}
                        ref={el => (modelRefs.current[model.id] = el)}
                        position={model.position}
                        scale={[model.scale, model.scale, model.scale]}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModelId(model.id);
                        }}
                    >
                        <Suspense fallback={null}>
                            <ModelViewer
                                modelPath={model.modelPath}
                                autoRotate={model.autoRotate}
                                rotationSpeed={model.rotationSpeed}
                                meshMode={model.meshMode}
                                meshOpacity={model.meshOpacity}
                                meshLineDensity={model.meshLineDensity}
                                theme={theme}
                            />
                        </Suspense>
                    </group>
                ))}
            </Canvas>

            {/* Model Label */}
            <div className={`absolute bottom-4 left-4 ${textColor} text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded`}>
                Selected: {selectedModel.name}
            </div>
        </div>
    );
} 