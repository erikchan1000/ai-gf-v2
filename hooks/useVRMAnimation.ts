import { useRef, useState } from "react";
import { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";

export interface VRMAnimationState {
  isIdle: boolean;
  isWaving: boolean;
  isNodding: boolean;
  isTalking: boolean;
}

export interface VRMAnimationControls {
  startIdle: () => void;
  startWaving: () => void;
  startNodding: () => void;
  startTalking: () => void;
  stopAnimation: () => void;
  update: (delta: number) => void;
}

export const useVRMAnimation = (
  vrm: VRM | null,
): [VRMAnimationState, VRMAnimationControls] => {
  const [animationState, setAnimationState] = useState<VRMAnimationState>({
    isIdle: true,
    isWaving: false,
    isNodding: false,
    isTalking: false,
  });

  const timeRef = useRef(0);

  const update = (delta: number) => {
    if (!vrm) return;

    timeRef.current += delta;

    // Idle animation - subtle breathing and head movement
    if (animationState.isIdle) {
      const breathingSpeed = 2;
      const breathingAmount = 0.02;
      const breathing =
        Math.sin(timeRef.current * breathingSpeed) * breathingAmount;

      const spine = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.Spine);
      if (spine) {
        spine.rotation.x = breathing;
      }

      // Subtle head sway
      const head = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.Head);
      if (head) {
        head.rotation.y = Math.sin(timeRef.current * 0.5) * 0.05;
        head.rotation.x = Math.sin(timeRef.current * 0.3) * 0.03;
      }

      // Natural arm position - bring arms down from T-pose
      const leftUpperArm = vrm.humanoid?.getNormalizedBoneNode(
        VRMHumanBoneName.LeftUpperArm,
      );
      const rightUpperArm = vrm.humanoid?.getNormalizedBoneNode(
        VRMHumanBoneName.RightUpperArm,
      );
      const leftLowerArm = vrm.humanoid?.getNormalizedBoneNode(
        VRMHumanBoneName.LeftLowerArm,
      );
      const rightLowerArm = vrm.humanoid?.getNormalizedBoneNode(
        VRMHumanBoneName.RightLowerArm,
      );

      if (leftUpperArm) {
        leftUpperArm.rotation.z = -Math.PI / 2.5; // Bring left arm down from T-pose (60 degrees)
        leftUpperArm.rotation.x = 0.1; // Slight forward angle
      }
      if (rightUpperArm) {
        rightUpperArm.rotation.z = Math.PI / 2.5; // Bring right arm down from T-pose (60 degrees)
        rightUpperArm.rotation.x = 0.1; // Slight forward angle
      }
      if (leftLowerArm) {
        leftLowerArm.rotation.z = -0.1; // Slight bend at elbow
      }
      if (rightLowerArm) {
        rightLowerArm.rotation.z = 0.1; // Slight bend at elbow
      }
    }

    // Waving animation
    if (animationState.isWaving) {
      const rightUpperArm = vrm.humanoid?.getNormalizedBoneNode(
        VRMHumanBoneName.RightUpperArm,
      );
      const rightLowerArm = vrm.humanoid?.getNormalizedBoneNode(
        VRMHumanBoneName.RightLowerArm,
      );
      const rightHand = vrm.humanoid?.getNormalizedBoneNode(
        VRMHumanBoneName.RightHand,
      );

      if (rightUpperArm) {
        rightUpperArm.rotation.z =
          -Math.PI / 2 + Math.sin(timeRef.current * 5) * 0.3;
        rightUpperArm.rotation.x = Math.PI / 4;
      }
      if (rightLowerArm) {
        rightLowerArm.rotation.z = -Math.sin(timeRef.current * 5) * 0.4;
      }
      if (rightHand) {
        rightHand.rotation.z = Math.sin(timeRef.current * 10) * 0.2;
      }
    }

    // Nodding animation
    if (animationState.isNodding) {
      const head = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.Head);
      if (head) {
        head.rotation.x = Math.sin(timeRef.current * 4) * 0.2;
      }
    }

    // Talking animation - mouth and head movement
    if (animationState.isTalking) {
      const head = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.Head);
      if (head) {
        head.rotation.x = Math.sin(timeRef.current * 8) * 0.05;
        head.rotation.y = Math.sin(timeRef.current * 3) * 0.03;
      }

      // Mouth animation through blend shapes
      if (vrm.expressionManager) {
        const talkValue = Math.abs(Math.sin(timeRef.current * 8)) * 0.5;
        vrm.expressionManager.setValue("aa", talkValue);
      }
    }
  };

  const controls: VRMAnimationControls = {
    update,
    startIdle: () => {
      setAnimationState({
        isIdle: true,
        isWaving: false,
        isNodding: false,
        isTalking: false,
      });
    },
    startWaving: () => {
      setAnimationState({
        isIdle: false,
        isWaving: true,
        isNodding: false,
        isTalking: false,
      });
      timeRef.current = 0;
    },
    startNodding: () => {
      setAnimationState({
        isIdle: false,
        isWaving: false,
        isNodding: true,
        isTalking: false,
      });
      timeRef.current = 0;
    },
    startTalking: () => {
      setAnimationState({
        isIdle: false,
        isWaving: false,
        isNodding: false,
        isTalking: true,
      });
      timeRef.current = 0;
    },
    stopAnimation: () => {
      setAnimationState({
        isIdle: true,
        isWaving: false,
        isNodding: false,
        isTalking: false,
      });
    },
  };

  return [animationState, controls];
};
