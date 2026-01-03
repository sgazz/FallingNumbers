'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Grid from './Grid';
import FallingPiece from './FallingPiece';
import ParticleSystem from './ParticleSystem';
import { useGameContext } from '@/contexts/GameContext';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

export default function Game() {
  const {
    grid,
    currentNumber,
    currentPiece,
    currentPosition,
    gameOver,
    isPaused,
    lastClearedPositions,
    lastClearedCount,
    comboMultiplier,
    moveLeft,
    moveRight,
    moveDown,
    drop,
    resetGame,
    togglePause,
  } = useGameContext();

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Pause/unpause (works even when game is over)
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        togglePause();
        return;
      }

      if (gameOver && e.key !== 'r' && e.key !== 'R') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
        case ' ':
          e.preventDefault();
          drop();
          break;
        case 'r':
        case 'R':
          if (gameOver) {
            resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveLeft, moveRight, moveDown, drop, gameOver, resetGame, togglePause]);

  // Auto fall
  const fallTimerRef = useRef(0);
  useFrame((state, delta) => {
    if (gameOver || !currentPiece || isPaused) return;

    fallTimerRef.current += delta;
    if (fallTimerRef.current >= 0.8) {
      moveDown();
      fallTimerRef.current = 0;
    }
  });

  return (
    <>
      <Grid grid={grid} width={GRID_WIDTH} height={GRID_HEIGHT} />
      {currentPiece && (
        <FallingPiece
          piece={currentPiece}
          basePosition={currentPosition}
        />
      )}
      <ParticleSystem
        clearedPositions={lastClearedPositions}
        clearedCount={lastClearedCount}
        comboMultiplier={comboMultiplier}
        gridWidth={GRID_WIDTH}
        gridHeight={GRID_HEIGHT}
      />
    </>
  );
}

