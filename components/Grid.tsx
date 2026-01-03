'use client';

import { useMemo } from 'react';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

interface GridProps {
  grid: (number | null)[][];
  width: number;
  height: number;
}

export default function Grid({ grid, width, height }: GridProps) {
  const cells = useMemo(() => {
    const cellsArray: JSX.Element[] = [];
    
    // Main board background
    const boardWidth = width;
    const boardHeight = height;
    cellsArray.push(
      <Box
        key="board-background"
        position={[0, -0.05, 0]}
        args={[boardWidth, 0.1, boardHeight]}
      >
        <meshStandardMaterial
          color="#2a3441"
          metalness={0.2}
          roughness={0.6}
          emissive="#1a2332"
          emissiveIntensity={0.2}
        />
      </Box>
    );
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const number = grid[y][x];
        const cellX = x - width / 2 + 0.5;
        const cellZ = y - height / 2 + 0.5;
        const isEven = (x + y) % 2 === 0;
        
        // Grid cell background with checkerboard pattern
        cellsArray.push(
          <Box
            key={`cell-${x}-${y}`}
            position={[cellX, 0, cellZ]}
            args={[0.95, 0.08, 0.95]}
          >
            <meshStandardMaterial
              color={number 
                ? '#3d4758' // Lighter when occupied
                : isEven 
                  ? '#3a4451' // Lighter blue-gray for even cells
                  : '#2e384b' // Lighter for odd cells
              }
              metalness={number ? 0.3 : 0.15}
              roughness={0.5}
              emissive={number ? '#2a3441' : '#1a2332'}
              emissiveIntensity={number ? 0.3 : 0.15}
            />
          </Box>
        );

        // Grid cell border
        cellsArray.push(
          <Box
            key={`border-${x}-${y}`}
            position={[cellX, 0.04, cellZ]}
            args={[1, 0.01, 1]}
          >
            <meshStandardMaterial
              color="#0f172a"
              opacity={0.3}
              transparent
            />
          </Box>
        );

        // Number display
        if (number !== null) {
          cellsArray.push(
            <group 
              key={`number-${x}-${y}`} 
              position={[cellX, 0.1, cellZ]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <Box args={[0.8, 0.8, 0.2]}>
                <meshStandardMaterial 
                  color="#3b82f6"
                  metalness={0.6}
                  roughness={0.3}
                  emissive="#1e40af"
                  emissiveIntensity={0.2}
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
      }
    }
    
    return cellsArray;
  }, [grid, width, height]);

  return <group>{cells}</group>;
}

