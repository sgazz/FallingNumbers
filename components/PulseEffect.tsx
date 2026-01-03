'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PulseEffectProps {
  position: [number, number, number];
  duration?: number;
  onComplete?: () => void;
}

export default function PulseEffect({
  position,
  duration = 0.5,
  onComplete,
}: PulseEffectProps) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const startTime = useRef(Date.now());

  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = elapsed / duration;

    if (progress >= 1) {
      if (onComplete) onComplete();
      return;
    }

    const scale = 1 + progress * 3;
    const opacity = 1 - progress;

    [ring1Ref, ring2Ref, ring3Ref].forEach((ref, index) => {
      if (ref.current) {
        const delay = index * 0.1;
        const adjustedProgress = Math.max(0, progress - delay);
        const ringScale = 1 + adjustedProgress * 3;
        const ringOpacity = (1 - adjustedProgress) * 0.6;

        ref.current.scale.set(ringScale, ringScale, ringScale);
        if (ref.current.material instanceof THREE.MeshStandardMaterial) {
          ref.current.material.opacity = ringOpacity;
        }
      }
    });
  });

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.5, 0.05, 16, 32]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.5, 0.05, 16, 32]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#9333ea"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[0.5, 0.05, 16, 32]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

