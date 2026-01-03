'use client';

import { Text } from '@react-three/drei';
import { Box } from '@react-three/drei';

interface FallingNumberProps {
  number: number;
  position: [number, number, number];
}

export default function FallingNumber({ number, position }: FallingNumberProps) {
  const [x, y, z] = position;
  const gridWidth = 10;
  const gridHeight = 20;
  const worldX = x - gridWidth / 2 + 0.5;
  const worldZ = y - gridHeight / 2 + 0.5;

  return (
    <group 
      position={[worldX, 0.2, worldZ]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <Box args={[0.8, 0.8, 0.2]}>
        <meshStandardMaterial 
          color="#ef4444"
          metalness={0.6}
          roughness={0.3}
          emissive="#991b1b"
          emissiveIntensity={0.3}
        />
      </Box>
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {number}
      </Text>
    </group>
  );
}

