# Architecture Overview

## Component Hierarchy

```
app/page.tsx (Main Entry)
    │
    ├── Scene3D Component
    │   │
    │   ├── Canvas (React Three Fiber)
    │   │   ├── PerspectiveCamera
    │   │   ├── Lights (ambient + directional)
    │   │   ├── Environment
    │   │   ├── VRMAvatar Component
    │   │   │   ├── VRM Model Loader
    │   │   │   ├── useVRMAnimation Hook
    │   │   │   └── Model Scene
    │   │   ├── Ground Plane
    │   │   └── OrbitControls
    │   │
    │   └── Loading Indicator
```

## Data Flow

```
1. User visits page
   ↓
2. page.tsx renders Scene3D
   ↓
3. Scene3D sets up Canvas and renders VRMAvatar
   ↓
4. VRMAvatar loads .vrm file from /public/models/
   ↓
5. useVRMAnimation hook attaches to loaded VRM
   ↓
6. Animation loop runs (React Three Fiber's useFrame)
   ↓
7. VRM model updates and renders every frame
```

## Key Files & Responsibilities

### `app/page.tsx`
- Main entry point
- Manages loading state
- Renders Scene3D with callbacks

### `components/Scene3D.tsx`
- Sets up React Three Fiber Canvas
- Configures camera, lighting, environment
- Manages 3D scene composition
- Provides orbit controls for user interaction

### `components/VRMAvatar.tsx`
- Loads VRM model using Three.js GLTFLoader
- Integrates VRMLoaderPlugin
- Manages VRM instance lifecycle
- Exposes animation controls
- Updates VRM every frame

### `hooks/useVRMAnimation.ts`
- Provides animation state management
- Implements animation logic:
  - Idle: breathing + head sway
  - Waving: arm movements
  - Nodding: head rotation
  - Talking: mouth + head animation
- Uses React Three Fiber's useFrame for animation loop
- Returns state and control functions

## Animation System

```
useVRMAnimation Hook
    │
    ├── State: { isIdle, isWaving, isNodding, isTalking }
    │
    ├── Controls:
    │   ├── startIdle()
    │   ├── startWaving()
    │   ├── startNodding()
    │   ├── startTalking()
    │   └── stopAnimation()
    │
    └── useFrame Loop (runs every frame)
        ├── Check current animation state
        ├── Calculate bone rotations
        ├── Apply to VRM humanoid bones
        └── Update blend shapes (expressions)
```

## VRM Bone Structure Used

- **Spine** - For breathing animation
- **Head** - For nodding and idle movement
- **RightUpperArm** - For waving
- **RightLowerArm** - For waving
- **RightHand** - For waving details

## Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **@pixiv/three-vrm** - VRM model loader and utilities
- **@react-three/drei** - Useful helpers for R3F
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI component system

## Extension Points

### Add New Animations
Edit `hooks/useVRMAnimation.ts`:
1. Add new state property
2. Add animation logic in useFrame
3. Add control function
4. Export updated types

### Add UI Controls
Create new component:
```tsx
// components/AnimationControls.tsx
import { VRMAnimationControls } from '@/hooks';

export function AnimationControls({
  controls
}: {
  controls: VRMAnimationControls
}) {
  return (
    <div className="controls">
      <button onClick={controls.startWaving}>Wave</button>
      <button onClick={controls.startNodding}>Nod</button>
      {/* etc */}
    </div>
  );
}
```

### Add AI Chat
1. Install AI SDK (e.g., OpenAI, Anthropic)
2. Create chat component
3. Connect chat responses to:
   - Text display
   - Text-to-speech
   - Animation triggers (talking, nodding)

### Add Voice Input
1. Use Web Speech API or external service
2. Convert speech to text
3. Send to AI
4. Trigger talking animation during AI response
