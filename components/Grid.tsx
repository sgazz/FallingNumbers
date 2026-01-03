'use client';

import { useMemo } from 'react';
import { Box, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface GridProps {
  grid: (number | null)[][];
  width: number;
  height: number;
}

export default function Grid({ grid, width, height }: GridProps) {
  const cells = useMemo(() => {
    const cellsArray: JSX.Element[] = [];
    
    // Main board background - Dark blue-gray as shown in image
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
          emissiveIntensity={0.15}
        />
      </Box>
    );
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const number = grid[y][x];
        const cellX = x - width / 2 + 0.5;
        const cellZ = y - height / 2 + 0.5;
        const isEven = (x + y) % 2 === 0;
        
        // Grid cell background with subtle checkerboard pattern - matching image
        cellsArray.push(
          <Box
            key={`cell-${x}-${y}`}
            position={[cellX, 0, cellZ]}
            args={[0.95, 0.08, 0.95]}
          >
            <meshStandardMaterial
              color={isEven 
                ? '#3a4451' // Lighter blue-gray for even cells
                : '#2e384b' // Darker blue-gray for odd cells
              }
              metalness={0.15}
              roughness={0.5}
              emissive={isEven ? '#2a3441' : '#1a2332'}
              emissiveIntensity={0.15}
            />
          </Box>
        );

        // Number display - Glossy 3D blocks with rounded edges
        if (number !== null) {
          // Color based on number value (green, red/orange, blue)
          const getBlockColor = (num: number) => {
            if (num <= 3) return { main: '#10b981', emissive: '#059669', shadow: '#047857' }; // Green
            if (num <= 6) return { main: '#ef4444', emissive: '#dc2626', shadow: '#b91c1c' }; // Red
            return { main: '#3b82f6', emissive: '#2563eb', shadow: '#1e40af' }; // Blue
          };
          
          const colors = getBlockColor(number);
          
          cellsArray.push(
            <group 
              key={`number-${x}-${y}`} 
              position={[cellX, 0.15, cellZ]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              {/* Main glossy block with rounded edges */}
              <RoundedBox args={[0.85, 0.85, 0.25]} radius={0.08} smoothness={4}>
                <meshStandardMaterial 
                  color={colors.main}
                  metalness={0.8}
                  roughness={0.1}
                  emissive={colors.emissive}
                  emissiveIntensity={0.3}
                />
              </RoundedBox>
              
              {/* Top highlight for glossy effect */}
              <Box 
                args={[0.7, 0.7, 0.01]} 
                position={[0, 0, 0.13]}
              >
                <meshStandardMaterial 
                  color="#ffffff"
                  opacity={0.4}
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
        }
      }
    }
    
    return cellsArray;
  }, [grid, width, height]);

  return <group>{cells}</group>;
}

