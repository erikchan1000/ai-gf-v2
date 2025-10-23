'use client';

import { Scene3D } from '@/components/Scene3D';
import { VRM } from '@pixiv/three-vrm';
import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleModelLoad = (loadedVrm: VRM) => {
    setIsLoading(false);
    console.log('VRM model loaded in page:', loadedVrm);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading your AI girlfriend...</p>
          </div>
        </div>
      )}

      {/* 3D Scene */}
      <Scene3D modelPath="/models/TestModel.vrm" onModelLoad={handleModelLoad} />

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Girlfriend
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Using TestModel.vrm
          </p>
        </div>
      </div>
    </div>
  );
}
