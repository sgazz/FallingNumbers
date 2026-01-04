'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Game from '@/components/Game';
import GameUI from '@/components/GameUI';
import { GameProvider } from '@/contexts/GameContext';

function ResponsiveOrbitControls() {
  const [zoomConfig, setZoomConfig] = useState({ min: 15, max: 30 });

  useEffect(() => {
    const updateZoom = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setZoomConfig({ min: 12, max: 25 }); // Mobile/Tablet
      } else {
        setZoomConfig({ min: 15, max: 30 }); // Desktop
      }
    };

    updateZoom();
    window.addEventListener('resize', updateZoom);
    return () => window.removeEventListener('resize', updateZoom);
  }, []);

  return (
    <OrbitControls
      enablePan={false}
      enableZoom={true}
      enableRotate={false}
      minDistance={zoomConfig.min}
      maxDistance={zoomConfig.max}
      target={[0, 0, 0]}
    />
  );
}

export default function Home() {
  const [cameraConfig, setCameraConfig] = useState({ position: [0, 20, 0] as [number, number, number], fov: 50 });

  useEffect(() => {
    const updateCamera = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        // Mobile/Tablet: Higher camera position and wider FOV to see more of the board
        setCameraConfig({ position: [0, 19, 0] as [number, number, number], fov: 58 }); // Mobile/Tablet
      } else {
        setCameraConfig({ position: [0, 20, 0] as [number, number, number], fov: 50 }); // Desktop
      }
    };

    updateCamera();
    window.addEventListener('resize', updateCamera);
    return () => window.removeEventListener('resize', updateCamera);
  }, []);

  return (
    <GameProvider>
      <div className="w-screen h-screen relative">
        <Canvas
          camera={{ position: cameraConfig.position, fov: cameraConfig.fov }}
          gl={{ 
            antialias: typeof window !== 'undefined' && window.innerWidth >= 1024, // Disable antialiasing on mobile/tablet for better performance
            powerPreference: 'high-performance',
          }}
          dpr={typeof window !== 'undefined' && window.innerWidth < 1024 ? [1, 1.5] : [1, 2]} // Lower DPR on mobile/tablet
          style={{ paddingBottom: typeof window !== 'undefined' && window.innerWidth < 1024 ? '100px' : '0' }} // Add padding on mobile/tablet to make room for controls below board
        >
          {/* Enhanced lighting for glossy blocks */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 20, 5]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[-10, 20, -5]} intensity={2.0} color="#ffffff" />
          <directionalLight position={[0, 25, 0]} intensity={2.2} color="#ffffff" />
          {/* Colored accent lights for better block visibility */}
          <pointLight position={[0, 20, 0]} intensity={1.2} color="#ffffff" />
          <pointLight position={[5, 18, 5]} intensity={1.0} color="#a0d2ff" />
          <pointLight position={[-5, 18, -5]} intensity={1.0} color="#ffa0a0" />
          {/* Additional rim lighting for glossy effect */}
          <pointLight position={[8, 15, 8]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-8, 15, -8]} intensity={0.8} color="#ffffff" />
          
          {/* Fog for depth - lighter */}
          <fog attach="fog" args={['#1a1f2e', 20, 35]} />
          
          <Game />
          <ResponsiveOrbitControls />
        </Canvas>
        <GameUI />
      </div>
    </GameProvider>
  );
}

