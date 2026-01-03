'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useGameLogic, Piece } from '@/hooks/useGameLogic';

interface GameContextType {
  grid: (number | null)[][];
  currentNumber: number | null; // Backward compatibility
  currentPiece: Piece | null; // New
  currentPosition: { x: number; y: number };
  targetSum: number;
  score: number;
  gameOver: boolean;
  isPaused: boolean;
  comboCount: number;
  comboMultiplier: number;
  lastClearedPositions: { x: number; y: number }[];
  lastClearedCount: number;
  level: number;
  combinationsCleared: number;
  justLeveledUp: boolean;
  fallSpeed: number;
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  drop: () => void;
  resetGame: () => void;
  togglePause: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const gameLogic = useGameLogic(10, 20);

  return <GameContext.Provider value={gameLogic}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}

