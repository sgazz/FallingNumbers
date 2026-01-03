'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleExplosionProps {
  position: [number, number, number];
  color?: string;
  count?: number;
  duration?: number;
  onComplete?: () => void;
}

export default function ParticleExplosion({
  position,
  color = '#60a5fa',
  count = 30,
  duration = 0.5,
  onComplete,
}: ParticleExplosionProps) {
  const meshRef = useRef<THREE.Points>(null);
  const startTime = useRef(Date.now());
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lifetimes = new Float32Array(count);
    
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random direction with more variation
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 4; // Faster particles
      const verticalSpeed = 2 + Math.random() * 3; // More upward movement
      
      velocities[i3] = Math.cos(angle) * speed;
      velocities[i3 + 1] = verticalSpeed;
      velocities[i3 + 2] = Math.sin(angle) * speed;
      
      // Start at position with slight random offset
      positions[i3] = position[0] + (Math.random() - 0.5) * 0.2;
      positions[i3 + 1] = position[1] + (Math.random() - 0.5) * 0.2;
      positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.2;
      
      // Varied particle sizes
      sizes[i] = 0.1 + Math.random() * 0.2;
      
      // Varied lifetimes for staggered fade
      lifetimes[i] = 0.3 + Math.random() * 0.4;
      
      // Color with more variation and brightness
      const colorVariation = 0.6 + Math.random() * 0.4;
      const brightness = 0.8 + Math.random() * 0.2;
      colors[i3] = colorObj.r * colorVariation * brightness;
      colors[i3 + 1] = colorObj.g * colorVariation * brightness;
      colors[i3 + 2] = colorObj.b * colorVariation * brightness;
    }
    
    return { positions, velocities, colors, sizes, lifetimes };
  }, [position, color, count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = elapsed / duration;
    
    if (progress >= 1) {
      if (onComplete) onComplete();
      return;
    }
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = meshRef.current.geometry.attributes.size?.array as Float32Array;
    const velocities = particles.velocities;
    const lifetimes = particles.lifetimes;
    
    let maxOpacity = 0;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const particleAge = elapsed;
      const particleLifetime = lifetimes[i];
      const particleProgress = Math.min(particleAge / particleLifetime, 1);
      
      // Update position
      positions[i3] += velocities[i3] * delta;
      positions[i3 + 1] += velocities[i3 + 1] * delta;
      positions[i3 + 2] += velocities[i3 + 2] * delta;
      
      // Apply gravity with air resistance
      velocities[i3] *= 0.98;
      velocities[i3 + 1] -= 6 * delta; // Stronger gravity
      velocities[i3 + 2] *= 0.98;
      
      // Update size (shrink over time)
      if (sizes) {
        sizes[i] = particles.sizes[i] * (1 - particleProgress * 0.7);
      }
      
      // Calculate opacity per particle
      const particleOpacity = 1 - particleProgress;
      maxOpacity = Math.max(maxOpacity, particleOpacity);
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    if (sizes) {
      meshRef.current.geometry.attributes.size!.needsUpdate = true;
    }
    const material = meshRef.current.material as THREE.PointsMaterial;
    material.opacity = maxOpacity;
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(particles.sizes, 1));
    return geom;
  }, [particles]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.2,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  return <points ref={meshRef} geometry={geometry} material={material} />;
}

