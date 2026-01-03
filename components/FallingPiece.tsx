'use client';

import { Text } from '@react-three/drei';
import { Box } from '@react-three/drei';
import { Piece, Position } from '@/hooks/useGameLogic';

interface FallingPieceProps {
  piece: Piece;
  basePosition: Position;
}

export default function FallingPiece({ piece, basePosition }: FallingPieceProps) {
  const gridWidth = 10;
  const gridHeight = 20;

  return (
    <group>
      {piece.positions.map((relPos, index) => {
        const absX = basePosition.x + relPos.x;
        const absY = basePosition.y + relPos.y;
        const worldX = absX - gridWidth / 2 + 0.5;
        const worldZ = absY - gridHeight / 2 + 0.5;
        const number = piece.numbers[index];

        // Different color for double pieces
        const isDouble = piece.type !== 'single';
        const boxColor = isDouble ? '#f59e0b' : '#ef4444'; // Orange for double, red for single
        const emissiveColor = isDouble ? '#92400e' : '#991b1b';

        return (
          <group
            key={index}
            position={[worldX, 0.2, worldZ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <Box args={[0.8, 0.8, 0.2]}>
              <meshStandardMaterial
                color={boxColor}
                metalness={0.6}
                roughness={0.3}
                emissive={emissiveColor}
                emissiveIntensity={0.3}
              />
            </Box>
            {/* Border for double pieces */}
            {isDouble && (
              <Box args={[0.85, 0.85, 0.21]} position={[0, 0, -0.01]}>
                <meshStandardMaterial
                  color="#ffffff"
                  opacity={0.3}
                  transparent
                />
              </Box>
            )}
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
      })}
    </group>
  );
}

