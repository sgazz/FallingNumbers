'use client';

import { Text, Box, RoundedBox } from '@react-three/drei';
import { Piece, Position } from '@/hooks/useGameLogic';

interface FallingPieceProps {
  piece: Piece;
  basePosition: Position;
}

export default function FallingPiece({ piece, basePosition }: FallingPieceProps) {
  const gridWidth = 10;
  const gridHeight = 20;

  // Color function based on number value (matching Grid)
  const getBlockColor = (num: number) => {
    if (num <= 3) return { main: '#10b981', emissive: '#059669', shadow: '#047857' }; // Green
    if (num <= 6) return { main: '#ef4444', emissive: '#dc2626', shadow: '#b91c1c' }; // Red
    return { main: '#3b82f6', emissive: '#2563eb', shadow: '#1e40af' }; // Blue
  };

  return (
    <group>
      {piece.positions.map((relPos, index) => {
        const absX = basePosition.x + relPos.x;
        const absY = basePosition.y + relPos.y;
        const worldX = absX - gridWidth / 2 + 0.5;
        const worldZ = absY - gridHeight / 2 + 0.5;
        const number = piece.numbers[index];
        const isDouble = piece.type !== 'single';
        
        // Get colors based on number
        const colors = getBlockColor(number);
        
        // Slight float animation for falling pieces
        const floatOffset = Math.sin(Date.now() * 0.003 + index) * 0.05;

        return (
          <group
            key={index}
            position={[worldX, 0.25 + floatOffset, worldZ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {/* Main glossy block with rounded edges */}
            <RoundedBox args={[0.85, 0.85, 0.25]} radius={0.08} smoothness={4}>
              <meshStandardMaterial
                color={colors.main}
                metalness={0.8}
                roughness={0.1}
                emissive={colors.emissive}
                emissiveIntensity={0.4}
              />
            </RoundedBox>
            
            {/* Top highlight for glossy effect */}
            <Box 
              args={[0.7, 0.7, 0.01]} 
              position={[0, 0, 0.13]}
            >
              <meshStandardMaterial
                color="#ffffff"
                opacity={0.5}
                transparent
                roughness={0.1}
                metalness={0.9}
              />
            </Box>
            
            {/* Shadow/Depth effect */}
            <Box 
              args={[0.88, 0.88, 0.02]} 
              position={[0, 0, -0.12]}
            >
              <meshStandardMaterial
                color={colors.shadow}
                opacity={0.6}
                transparent
              />
            </Box>
            
            {/* Special border/glow for double pieces */}
            {isDouble && (
              <>
                <Box args={[0.9, 0.9, 0.26]} position={[0, 0, -0.01]}>
                  <meshStandardMaterial
                    color="#ffffff"
                    opacity={0.4}
                    transparent
                    emissive="#fbbf24"
                    emissiveIntensity={0.3}
                  />
                </Box>
                {/* Outer glow ring */}
                <Box args={[0.95, 0.95, 0.27]} position={[0, 0, -0.02]}>
                  <meshStandardMaterial
                    color="#fbbf24"
                    opacity={0.2}
                    transparent
                    emissive="#f59e0b"
                    emissiveIntensity={0.5}
                  />
                </Box>
              </>
            )}
            
            {/* Number text with better styling */}
            <Text
              position={[0, 0, 0.14]}
              fontSize={0.6}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#000000"
              fontWeight="bold"
            >
              {number}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

