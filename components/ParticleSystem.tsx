'use client';

import { useState, useEffect, useRef } from 'react';
import ParticleExplosion from './ParticleExplosion';
import PulseEffect from './PulseEffect';

// Detect mobile device for performance optimization (including tablets)
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const hasTouchSupport = 'ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
  const isSmallViewport = window.innerWidth < 1024;
  return isMobileUserAgent || (hasTouchSupport && isSmallViewport);
};

interface ParticleEvent {
  id: string;
  position: [number, number, number];
  color: string;
  count: number;
}

interface PulseEvent {
  id: string;
  position: [number, number, number];
}

interface ParticleSystemProps {
  clearedPositions: Array<{ x: number; y: number }>;
  clearedCount: number;
  comboMultiplier: number;
  gridWidth: number;
  gridHeight: number;
}

export default function ParticleSystem({
  clearedPositions,
  clearedCount,
  comboMultiplier,
  gridWidth,
  gridHeight,
}: ParticleSystemProps) {
  const [particles, setParticles] = useState<ParticleEvent[]>([]);
  const [pulses, setPulses] = useState<PulseEvent[]>([]);
  const prevClearedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (clearedPositions.length === 0) {
      prevClearedRef.current.clear();
      return;
    }

    // Find newly cleared positions
    const newParticles: ParticleEvent[] = [];
    const currentCleared = new Set(
      clearedPositions.map((pos) => `${pos.x},${pos.y}`)
    );

    clearedPositions.forEach((pos) => {
      const key = `${pos.x},${pos.y}`;
      if (!prevClearedRef.current.has(key)) {
        // Convert grid position to world position
        const worldX = pos.x - gridWidth / 2 + 0.5;
        const worldZ = pos.y - gridHeight / 2 + 0.5;

        // Determine particle color and count based on combo and cleared count
        // Reduce particle count on mobile for better performance
        const isMobile = isMobileDevice();
        const mobileMultiplier = isMobile ? 0.5 : 1; // Reduce particles by 50% on mobile
        
        let particleColor = '#60a5fa'; // Default blue
        let particleCount = Math.floor((40 + Math.floor(Math.random() * 30)) * mobileMultiplier);
        
        if (comboMultiplier >= 4) {
          particleColor = '#fbbf24'; // Bright yellow for very high combo
          particleCount = Math.floor((80 + Math.floor(Math.random() * 40)) * mobileMultiplier);
        } else if (comboMultiplier >= 3) {
          particleColor = '#f59e0b'; // Orange for high combo
          particleCount = Math.floor((60 + Math.floor(Math.random() * 30)) * mobileMultiplier);
        } else if (clearedCount >= 7) {
          particleColor = '#ef4444'; // Red for very large combinations
          particleCount = Math.floor((70 + Math.floor(Math.random() * 30)) * mobileMultiplier);
        } else if (clearedCount >= 5) {
          particleColor = '#f87171'; // Light red for large combinations
          particleCount = Math.floor((50 + Math.floor(Math.random() * 25)) * mobileMultiplier);
        } else if (comboMultiplier >= 2) {
          particleColor = '#a855f7'; // Purple for combo
          particleCount = Math.floor((45 + Math.floor(Math.random() * 20)) * mobileMultiplier);
        }

        newParticles.push({
          id: `${key}-${Date.now()}-${Math.random()}`,
          position: [worldX, 0.1, worldZ],
          color: particleColor,
          count: particleCount,
        });
      }
    });

    if (newParticles.length > 0) {
      setParticles((prev) => [...prev, ...newParticles]);
      
      // Add pulse effects for each cleared position
      const newPulses: PulseEvent[] = clearedPositions.map((pos) => {
        const worldX = pos.x - gridWidth / 2 + 0.5;
        const worldZ = pos.y - gridHeight / 2 + 0.5;
        return {
          id: `${pos.x},${pos.y}-pulse-${Date.now()}-${Math.random()}`,
          position: [worldX, 0.1, worldZ],
        };
      });
      
      setPulses((prev) => [...prev, ...newPulses]);
    }

    prevClearedRef.current = currentCleared;
  }, [clearedPositions, clearedCount, comboMultiplier, gridWidth, gridHeight]);

  const removeParticle = (id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  const removePulse = (id: string) => {
    setPulses((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      {particles.map((particle) => (
        <ParticleExplosion
          key={particle.id}
          position={particle.position}
          color={particle.color}
          count={particle.count}
          duration={0.8}
          onComplete={() => removeParticle(particle.id)}
        />
      ))}
      {pulses.map((pulse) => (
        <PulseEffect
          key={pulse.id}
          position={pulse.position}
          duration={0.6}
          onComplete={() => removePulse(pulse.id)}
        />
      ))}
    </>
  );
}

