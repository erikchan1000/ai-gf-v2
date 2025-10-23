'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useVRMAnimation, VRMAnimationControls } from '@/hooks/useVRMAnimation';

interface VRMAvatarProps {
  modelPath: string;
  position?: [number, number, number];
  scale?: number;
  onLoad?: (vrm: VRM) => void;
}

export const VRMAvatar = ({
  modelPath,
  position = [0, 0, 0],
  scale = 1,
  onLoad
}: VRMAvatarProps) => {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const groupRef = useRef<THREE.Group & { animationControls?: VRMAnimationControls }>(null);

  // Animation hook
  const [, animationControls] = useVRMAnimation(vrm);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      modelPath,
      (gltf) => {
        const vrmModel = gltf.userData.vrm as VRM;

        if (vrmModel) {
          // Disable frustum culling to prevent model disappearing
          vrmModel.scene.traverse((obj) => {
            obj.frustumCulled = false;
          });

          // Rotate model to face camera (VRM models typically face +Z)
          VRMUtils.rotateVRM0(vrmModel);

          setVrm(vrmModel);

          if (onLoad) {
            onLoad(vrmModel);
          }

          console.log('VRM model loaded successfully');
        }
      },
      (progress) => {
        console.log(
          'Loading model:',
          (100.0 * progress.loaded / progress.total).toFixed(2) + '%'
        );
      },
      (error) => {
        console.error('Error loading VRM model:', error);
      }
    );
  }, [modelPath, onLoad]);

  // Update VRM in animation loop
  useFrame((_, delta) => {
    if (vrm) {
      vrm.update(delta);
      animationControls.update(delta);
    }
  });

  // Make animation controls available
  useEffect(() => {
    if (vrm && groupRef.current) {
      // Store animation controls on the group for external access
      groupRef.current.animationControls = animationControls;
    }
  }, [vrm, animationControls]);

  if (!vrm) {
    return null;
  }

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={vrm.scene} />
    </group>
  );
};
