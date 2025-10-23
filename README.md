# AI Girlfriend Web Application

An interactive AI girlfriend web application built with Next.js, Three.js, React Three Fiber, and VRoid models.

## Features

- **3D VRoid Avatar Rendering**: Load and display VRoid (.vrm) models in a 3D environment
- **React Three Fiber Integration**: Smooth 3D rendering with React
- **Animation System**: Built-in animation hook for controlling avatar animations including:
  - Idle breathing animation
  - Waving
  - Nodding
  - Talking animations with lip sync support
- **Interactive Controls**: Orbit controls to rotate and zoom the camera
- **Responsive Design**: Full-screen 3D canvas with responsive UI overlay
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **3D Rendering**: Three.js, React Three Fiber, React Three Drei
- **Avatar System**: @pixiv/three-vrm
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Language**: TypeScript

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your VRM Model

Place your `.vrm` file at `public/models/avatar.vrm`

**Don't have a model?** Get one from:
- [VRoid Studio](https://vroid.com/en/studio) - Create your own (free)
- [VRoid Hub](https://hub.vroid.com/) - Download existing models
- [Booth.pm](https://booth.pm/) - Purchase high-quality models

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your AI girlfriend!

## Project Structure

```
ai-gf-v2/
├── app/
│   ├── globals.css          # Global styles with Tailwind and shadcn theme
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page with 3D scene
├── components/
│   ├── Scene3D.tsx          # Main 3D scene component
│   ├── VRMAvatar.tsx        # VRM model loader and renderer
│   └── index.ts             # Component exports
├── hooks/
│   ├── useVRMAnimation.ts   # Animation control hook
│   └── index.ts             # Hook exports
├── public/
│   └── models/
│       ├── README.md        # Instructions for adding models
│       └── avatar.vrm       # Your VRM model (add this)
└── lib/
    └── utils.ts             # Utility functions
```

## Core Components

### Scene3D Component

The main 3D rendering environment with camera, lighting, and controls.

```tsx
import { Scene3D } from '@/components/Scene3D';

<Scene3D
  modelPath="/models/avatar.vrm"
  onModelLoad={(vrm) => console.log('Model loaded:', vrm)}
/>
```

**Key features:**
- React Three Fiber Canvas setup
- Perspective camera positioned for portrait view
- Ambient and directional lighting
- Studio environment preset
- Orbit controls for user interaction
- Ground plane

### VRMAvatar Component

Loads and renders VRoid models with animation support.

```tsx
import { VRMAvatar } from '@/components/VRMAvatar';

<VRMAvatar
  modelPath="/models/avatar.vrm"
  position={[0, 0, 0]}
  scale={1}
  onLoad={(vrm) => {
    // Access loaded VRM instance
  }}
/>
```

### useVRMAnimation Hook

Provides animation state management and control functions.

```tsx
import { useVRMAnimation } from '@/hooks/useVRMAnimation';

const [animationState, animationControls] = useVRMAnimation(vrm);

// Available controls:
animationControls.startIdle();     // Default breathing animation
animationControls.startWaving();   // Wave gesture
animationControls.startNodding();  // Head nod
animationControls.startTalking();  // Talking animation
animationControls.stopAnimation(); // Stop current animation
```

## Animation System

The animation system uses VRM humanoid bones and blend shapes:

### Built-in Animations

| Animation | Description | Bones Used |
|-----------|-------------|------------|
| **Idle** | Subtle breathing and head sway | Spine, Head |
| **Waving** | Right arm wave gesture | RightUpperArm, RightLowerArm, RightHand |
| **Nodding** | Head nodding motion | Head |
| **Talking** | Mouth movement with head gestures | Head + blend shapes (aa) |

### Extending Animations

Edit `hooks/useVRMAnimation.ts` to add custom animations:

1. Add new state to `VRMAnimationState`
2. Implement animation logic in `useFrame` hook
3. Add control function to `VRMAnimationControls`
4. Export updated types

## Customization

### Adjust Camera Position

Edit `components/Scene3D.tsx:24`:
```tsx
<PerspectiveCamera
  makeDefault
  position={[0, 1.4, 1.5]}  // [x, y, z]
  fov={50}                   // Field of view
/>
```

### Modify Lighting

Edit `components/Scene3D.tsx:28-40`:
```tsx
<ambientLight intensity={0.8} />
<directionalLight
  position={[5, 5, 5]}
  intensity={1.2}
  castShadow
/>
```

### Configure Orbit Controls

Edit `components/Scene3D.tsx:73-80`:
```tsx
<OrbitControls
  enablePan={false}
  enableZoom={true}
  minDistance={1}      // Closest zoom
  maxDistance={3}      // Farthest zoom
  minPolarAngle={Math.PI / 4}  // Lowest angle
  maxPolarAngle={Math.PI / 2}  // Highest angle
  target={[0, 1.2, 0]} // Look at point
/>
```

### Change Model Scale

In your page component:
```tsx
<VRMAvatar scale={1.5} />  // Make model larger
<VRMAvatar scale={0.8} />  // Make model smaller
```

## Troubleshooting

### Model Not Loading

- Verify file is at `public/models/avatar.vrm`
- Check browser console for errors
- Ensure `.vrm` file is valid (VRM 0.0 or VRM 1.0)
- Try a different VRM model to isolate the issue

### Model Appears Too Dark

Increase lighting intensity in `Scene3D.tsx`:
```tsx
<ambientLight intensity={1.2} />
<directionalLight intensity={1.5} />
```

### Model Positioned Incorrectly

Adjust position in VRMAvatar:
```tsx
<VRMAvatar position={[0, -0.5, 0]} />  // Move down
```

### Camera Too Close/Far

Adjust camera position or orbit controls min/max distance in `Scene3D.tsx`

## Advanced Usage

### Accessing VRM Instance

```tsx
const handleModelLoad = (vrm: VRM) => {
  // Access humanoid bones
  const head = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.Head);

  // Control expressions
  vrm.expressionManager?.setValue('happy', 1.0);

  // Get model metadata
  console.log(vrm.meta);
};
```

### Creating Custom Animations

```tsx
// In a custom component
import { useFrame } from '@react-three/fiber';
import { VRM, VRMHumanBoneName } from '@pixiv/three-vrm';

function CustomAnimation({ vrm }: { vrm: VRM }) {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const head = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.Head);

    if (head) {
      head.rotation.y = Math.sin(time) * 0.3; // Rotate head
    }
  });

  return null;
}
```

### Multiple Camera Angles

```tsx
const cameraPositions = {
  front: [0, 1.4, 1.5],
  side: [2, 1.4, 0],
  closeup: [0, 1.6, 0.8],
};

<PerspectiveCamera position={cameraPositions.front} />
```

## File Reference

| File | Purpose | Key Functions |
|------|---------|---------------|
| `app/page.tsx` | Main entry point | Model loading state management |
| `components/Scene3D.tsx` | 3D scene setup | Canvas, camera, lighting config |
| `components/VRMAvatar.tsx` | VRM loader | Model loading, animation integration |
| `hooks/useVRMAnimation.ts` | Animation system | Animation state and controls |
| `app/globals.css` | Global styles | Tailwind + shadcn theme variables |

## Next Steps

### Immediate Enhancements
- [ ] Add UI controls for animations (buttons, sliders)
- [ ] Create expression presets (happy, sad, angry, etc.)
- [ ] Add background environment options
- [ ] Implement camera preset buttons

### AI Integration
- [ ] Add AI chat functionality (OpenAI, Anthropic, etc.)
- [ ] Implement text-to-speech for responses
- [ ] Add voice recognition for input
- [ ] Sync talking animation with audio
- [ ] Implement emotion detection from AI responses

### Advanced Features
- [ ] Multiple character support
- [ ] Character customization UI
- [ ] Save/load conversation history
- [ ] Add more complex animations (dancing, gestures)
- [ ] Implement lip sync from audio
- [ ] Add particle effects and post-processing

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [VRM Specification](https://vrm.dev/en/)
- [@pixiv/three-vrm Documentation](https://pixiv.github.io/three-vrm/)
- [VRoid Studio](https://vroid.com/en/studio)
- [Next.js Documentation](https://nextjs.org/docs)

## Additional Documentation

- `ARCHITECTURE.md` - Detailed technical architecture and data flow
- `EXAMPLES.md` - Code examples and usage patterns
- `public/models/README.md` - VRM model instructions

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review `EXAMPLES.md` for usage patterns
3. Consult the Resources section for library documentation
