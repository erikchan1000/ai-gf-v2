'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { VRMAvatar } from './VRMAvatar';
import { Suspense } from 'react';
import { VRM } from '@pixiv/three-vrm';

interface Scene3DProps {
  modelPath?: string;
  onModelLoad?: (vrm: VRM) => void;
}

export const Scene3D = ({
  modelPath = '/models/avatar.vrm',
  onModelLoad
}: Scene3DProps) => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 2]}
      >
        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={[0, 1.4, 1.5]}
          fov={50}
        />

        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.5}
        />

        {/* Environment */}
        <Environment preset="studio" />

        {/* VRM Avatar */}
        <Suspense fallback={null}>
          <VRMAvatar
            modelPath={modelPath}
            position={[0, 0, 0]}
            scale={1}
            onLoad={onModelLoad}
          />
        </Suspense>

        {/* Ground */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial
            color="#f0f0f0"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={3}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          target={[0, 1.2, 0]}
        />
      </Canvas>
    </div>
  );
};
