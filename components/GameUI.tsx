'use client';

import { useEffect, useRef } from 'react';
import { useGameContext } from '@/contexts/GameContext';

export default function GameUI() {
  const { score, targetSum, gameOver, isPaused, comboCount, comboMultiplier, lastClearedPositions, resetGame, togglePause } = useGameContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevClearedCount = useRef(0);

  // Screen shake effect for large combos
  useEffect(() => {
    if (lastClearedPositions.length === 0) {
      prevClearedCount.current = 0;
      return;
    }

    const clearedCount = lastClearedPositions.length;
    if (clearedCount > prevClearedCount.current && clearedCount >= 5) {
      // Screen shake for large combinations
      if (containerRef.current) {
        containerRef.current.style.animation = 'none';
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.animation = 'shake 0.3s';
          }
        }, 10);
      }
    }
    prevClearedCount.current = clearedCount;
  }, [lastClearedPositions]);
  return (
    <div 
      ref={containerRef}
      className="absolute top-0 left-0 right-0 bottom-0 z-10 pointer-events-none"
      style={{
        animation: 'none',
      }}
    >
      {/* Top HUD */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
        {/* Score and Target */}
        <div className="flex gap-4">
          <div className="bg-gradient-to-br from-purple-600/90 to-blue-600/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/20">
            <div className="text-white/80 text-xs uppercase tracking-wider mb-1">Score</div>
            <div className="text-white text-4xl font-bold drop-shadow-lg">{score.toLocaleString()}</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/90 to-red-500/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/20">
            <div className="text-white/80 text-xs uppercase tracking-wider mb-1">Target Sum</div>
            <div className="text-white text-4xl font-bold drop-shadow-lg">{targetSum}</div>
          </div>
          
          {/* Combo Indicator */}
          {comboCount > 0 && (
            <div className="bg-gradient-to-br from-yellow-500/90 to-orange-500/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/20 animate-pulse">
              <div className="text-white/80 text-xs uppercase tracking-wider mb-1">Combo</div>
              <div className="text-white text-3xl font-bold drop-shadow-lg">
                {comboCount}x
              </div>
              <div className="text-yellow-200 text-xl font-bold drop-shadow-lg">
                {comboMultiplier}x Multiplier
              </div>
            </div>
          )}
        </div>
        
        {/* Pause Modal */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  PAUSED
                </div>
                <div className="text-white/70 text-xl mb-8">Press P or ESC to resume</div>
                <button
                  onClick={togglePause}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Resume
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Game Over!
                </div>
                <div className="text-white/70 text-xl mb-6">Final Score</div>
                <div className="text-white text-4xl font-bold mb-8">{score.toLocaleString()}</div>
                <button
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Play Again (R)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Controls Help - Bottom Left */}
      <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <div className="text-white/90 text-sm">
          <div className="font-semibold mb-2 text-white">Controls</div>
          <div className="space-y-1 text-white/70">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">←</kbd>
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">→</kbd>
              <span>Move</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">↓</kbd>
              <span>Move Down</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Space</kbd>
              <span>Drop</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">P</kbd>
              <span>Pause</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

