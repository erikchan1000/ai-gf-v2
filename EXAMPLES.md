# Usage Examples

## Basic Usage

### 1. Load and Display VRM Model

```tsx
import { Scene3D } from '@/components/Scene3D';

export default function Home() {
  return (
    <div className="w-full h-screen">
      <Scene3D modelPath="/models/avatar.vrm" />
    </div>
  );
}
```

### 2. Handle Model Load Event

```tsx
import { Scene3D } from '@/components/Scene3D';
import { VRM } from '@pixiv/three-vrm';

export default function Home() {
  const handleModelLoad = (vrm: VRM) => {
    console.log('Model loaded!', vrm);
    // Access VRM bones, expressions, etc.
  };

  return (
    <Scene3D
      modelPath="/models/avatar.vrm"
      onModelLoad={handleModelLoad}
    />
  );
}
```

## Animation Control Examples

### 3. Create Animation Control Buttons

```tsx
'use client';

import { Scene3D } from '@/components/Scene3D';
import { VRM } from '@pixiv/three-vrm';
import { useState, useRef } from 'react';
import { VRMAnimationControls } from '@/hooks';

export default function Home() {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const controlsRef = useRef<VRMAnimationControls | null>(null);

  const handleModelLoad = (loadedVrm: VRM) => {
    setVrm(loadedVrm);
    // Get animation controls from the avatar component
    // (You'll need to pass them up or use a ref)
  };

  return (
    <div className="relative w-full h-screen">
      <Scene3D onModelLoad={handleModelLoad} />

      {vrm && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => controlsRef.current?.startWaving()}
          >
            Wave
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => controlsRef.current?.startNodding()}
          >
            Nod
          </button>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded"
            onClick={() => controlsRef.current?.startTalking()}
          >
            Talk
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() => controlsRef.current?.startIdle()}
          >
            Idle
          </button>
        </div>
      )}
    </div>
  );
}
```

### 4. Custom Animation Component

```tsx
// components/AnimationPanel.tsx
'use client';

import { VRMAnimationControls } from '@/hooks';

interface AnimationPanelProps {
  controls: VRMAnimationControls;
}

export function AnimationPanel({ controls }: AnimationPanelProps) {
  const animations = [
    { name: 'Idle', action: controls.startIdle, color: 'gray' },
    { name: 'Wave', action: controls.startWaving, color: 'blue' },
    { name: 'Nod', action: controls.startNodding, color: 'green' },
    { name: 'Talk', action: controls.startTalking, color: 'purple' },
  ];

  return (
    <div className="flex gap-2 p-4 bg-white/90 rounded-lg shadow-lg">
      {animations.map(({ name, action, color }) => (
        <button
          key={name}
          onClick={action}
          className={`px-4 py-2 bg-${color}-500 text-white rounded hover:bg-${color}-600 transition`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
```

## Advanced Usage

### 5. Modify VRM Expressions Directly

```tsx
const handleModelLoad = (vrm: VRM) => {
  // Access expression manager
  if (vrm.expressionManager) {
    // Set expressions (0 = none, 1 = full)
    vrm.expressionManager.setValue('happy', 1.0);
    vrm.expressionManager.setValue('surprised', 0.5);

    // Available expressions depend on your VRM model:
    // 'neutral', 'happy', 'angry', 'sad', 'relaxed',
    // 'surprised', 'aa', 'ih', 'ou', 'ee', 'oh'
  }
};
```

### 6. Access and Control Bones Manually

```tsx
import { VRMHumanBoneName } from '@pixiv/three-vrm';

const handleModelLoad = (vrm: VRM) => {
  // Get specific bone
  const head = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.Head);

  if (head) {
    // Rotate head 30 degrees
    head.rotation.y = Math.PI / 6;

    // Tilt head
    head.rotation.x = Math.PI / 12;
  }

  // Available bones:
  // Head, Neck, Spine, Chest, UpperChest
  // LeftUpperArm, LeftLowerArm, LeftHand
  // RightUpperArm, RightLowerArm, RightHand
  // LeftUpperLeg, LeftLowerLeg, LeftFoot
  // RightUpperLeg, RightLowerLeg, RightFoot
  // and more...
};
```

### 7. Custom Animation Loop

```tsx
// Create a custom animation component
'use client';

import { useFrame } from '@react-three/fiber';
import { VRM } from '@pixiv/three-vrm';

export function CustomAnimation({ vrm }: { vrm: VRM }) {
  useFrame((state) => {
    if (!vrm) return;

    // Use state.clock for time-based animations
    const time = state.clock.getElapsedTime();

    // Custom animation: head follows a circular path
    if (vrm.expressionManager) {
      const smile = (Math.sin(time) + 1) / 2; // 0 to 1
      vrm.expressionManager.setValue('happy', smile);
    }
  });

  return null;
}
```

### 8. Multiple Camera Angles

```tsx
// components/MultiCameraScene.tsx
import { PerspectiveCamera } from '@react-three/drei';
import { useState } from 'react';

export function MultiCameraScene() {
  const [cameraView, setCameraView] = useState<'front' | 'side' | 'top'>('front');

  const cameraPositions = {
    front: [0, 1.4, 1.5] as [number, number, number],
    side: [2, 1.4, 0] as [number, number, number],
    top: [0, 3, 0] as [number, number, number],
  };

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={cameraPositions[cameraView]}
        fov={50}
      />

      {/* UI to switch cameras */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={() => setCameraView('front')}>Front</button>
        <button onClick={() => setCameraView('side')}>Side</button>
        <button onClick={() => setCameraView('top')}>Top</button>
      </div>
    </>
  );
}
```

## Integration Examples

### 9. With AI Chat (Conceptual)

```tsx
'use client';

import { Scene3D } from '@/components/Scene3D';
import { VRM } from '@pixiv/three-vrm';
import { useState } from 'react';

export default function AIGirlfriend() {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [message, setMessage] = useState('');

  const sendMessage = async (text: string) => {
    // Trigger talking animation
    // (You'd need to get animation controls reference)

    // Send to AI
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();

    // Show response
    // Trigger animations based on response
    // Optionally use text-to-speech
  };

  return (
    <div className="relative w-full h-screen">
      <Scene3D onModelLoad={setVrm} />

      {vrm && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage(message);
                setMessage('');
              }
            }}
            placeholder="Type a message..."
            className="w-full px-4 py-2 rounded"
          />
        </div>
      )}
    </div>
  );
}
```

### 10. With Emotion Detection

```tsx
const emotionToExpression = {
  happy: 'happy',
  sad: 'sad',
  angry: 'angry',
  surprised: 'surprised',
  neutral: 'neutral',
};

const setEmotion = (vrm: VRM, emotion: keyof typeof emotionToExpression) => {
  if (!vrm.expressionManager) return;

  // Reset all expressions
  Object.values(emotionToExpression).forEach(expr => {
    vrm.expressionManager?.setValue(expr, 0);
  });

  // Set target emotion
  const expression = emotionToExpression[emotion];
  vrm.expressionManager.setValue(expression, 1.0);
};
```

## Tips

1. **Performance**: VRM updates happen every frame. Keep animation logic efficient.

2. **Bone Access**: Always check if bone exists before manipulating:
   ```tsx
   const bone = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.Head);
   if (bone) {
     // safe to use
   }
   ```

3. **Expression Names**: Expression names vary by model. Check your model's available expressions.

4. **Smooth Transitions**: Use linear interpolation (lerp) for smooth animation transitions:
   ```tsx
   currentValue += (targetValue - currentValue) * 0.1;
   ```

5. **Debugging**: Use `console.log(vrm)` to explore your VRM model's structure and available features.
