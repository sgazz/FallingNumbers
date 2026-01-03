'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Game from '@/components/Game';
import GameUI from '@/components/GameUI';
import { GameProvider } from '@/contexts/GameContext';

export default function Home() {
  return (
    <GameProvider>
      <div className="w-screen h-screen relative">
        <Canvas
          camera={{ position: [0, 20, 0], fov: 50 }}
          gl={{ antialias: true }}
        >
          {/* Improved lighting - brighter */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 15, 5]} intensity={2.0} color="#ffffff" />
          <directionalLight position={[-10, 15, -5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[0, 20, 0]} intensity={1.8} color="#ffffff" />
          <pointLight position={[0, 20, 0]} intensity={1.0} color="#ffffff" />
          <pointLight position={[5, 15, 5]} intensity={0.8} color="#a0d2ff" />
          <pointLight position={[-5, 15, -5]} intensity={0.8} color="#a0d2ff" />
          
          {/* Fog for depth - lighter */}
          <fog attach="fog" args={['#1a1f2e', 20, 35]} />
          
          <Game />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={false}
            minDistance={15}
            maxDistance={30}
            target={[0, 0, 0]}
          />
        </Canvas>
        <GameUI />
      </div>
    </GameProvider>
  );
}

