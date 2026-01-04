'use client';

import { useEffect, useRef } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import MobileControls from './MobileControls';

export default function GameUI() {
  const { score, targetSum, gameOver, isPaused, comboCount, comboMultiplier, lastClearedPositions, level, combinationsCleared, justLeveledUp, currentPiece, resetGame, togglePause } = useGameContext();
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
      className="absolute top-0 left-0 right-0 bottom-0 z-10 pointer-events-none overflow-hidden"
      style={{
        animation: 'none',
      }}
    >
      {/* Animated Background Light Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left side blue light streaks */}
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-30">
          <div className="absolute w-2 h-64 bg-gradient-to-t from-blue-500 to-transparent rounded-full blur-sm animate-light-streak-left" style={{ animation: 'light-streak-left 4s ease-in-out infinite' }}></div>
          <div className="absolute w-2 h-64 bg-gradient-to-t from-blue-400 to-transparent rounded-full blur-sm animate-light-streak-left" style={{ animation: 'light-streak-left 5s ease-in-out infinite 1s' }}></div>
          <div className="absolute w-1 h-48 bg-gradient-to-t from-cyan-400 to-transparent rounded-full blur-sm animate-light-streak-left" style={{ animation: 'light-streak-left 6s ease-in-out infinite 2s' }}></div>
        </div>
        
        {/* Right side orange/yellow light streaks */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-30">
          <div className="absolute w-2 h-64 bg-gradient-to-t from-orange-500 to-transparent rounded-full blur-sm animate-light-streak-right" style={{ animation: 'light-streak-right 4s ease-in-out infinite' }}></div>
          <div className="absolute w-2 h-64 bg-gradient-to-t from-yellow-400 to-transparent rounded-full blur-sm animate-light-streak-right" style={{ animation: 'light-streak-right 5s ease-in-out infinite 1s' }}></div>
          <div className="absolute w-1 h-48 bg-gradient-to-t from-amber-400 to-transparent rounded-full blur-sm animate-light-streak-right" style={{ animation: 'light-streak-right 6s ease-in-out infinite 2s' }}></div>
        </div>
      </div>

      {/* Central Game Emblem - Only show when game hasn't started or is paused - Responsive */}
      {(!currentPiece && !gameOver && !isPaused) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 w-full h-full border-2 sm:border-4 border-amber-600/30 rounded-full animate-rotate-slow" style={{ animation: 'rotate-slow 20s linear infinite' }}></div>
            
            {/* Central emblem */}
            <div className="relative w-full h-full bg-gradient-to-br from-amber-900/90 via-amber-800/90 to-amber-900/90 rounded-full flex items-center justify-center shadow-2xl border-2 sm:border-4 border-amber-700/50" style={{ boxShadow: '0 0 60px rgba(217, 119, 6, 0.5), inset 0 0 40px rgba(0, 0, 0, 0.5)' }}>
              {/* Inner texture pattern */}
              <div className="absolute inset-2 sm:inset-4 rounded-full border border-amber-600/20"></div>
              <div className="absolute inset-4 sm:inset-8 rounded-full border border-amber-500/10"></div>
              
              {/* Text content */}
              <div className="relative z-10 text-center px-4 sm:px-8">
                <div className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}>
                  FALL,
                </div>
                <div className="text-3xl sm:text-5xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}>
                  NUMBER..
                </div>
                <div className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl animate-pulse-glow" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}>
                  FALL!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Top HUD - Modern Glassmorphism Design - Responsive */}
      <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 flex flex-wrap gap-2 sm:gap-3 items-start">
        {/* Score Card */}
        <div className="bg-gradient-to-br from-purple-600/80 via-blue-600/80 to-indigo-600/80 backdrop-blur-xl p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-purple-400/30 hover:border-purple-300/50 transition-all duration-300 hover:scale-105" style={{ boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
          <div className="text-white/70 text-[8px] sm:text-[10px] uppercase tracking-widest mb-1 sm:mb-1.5 font-semibold">Score</div>
          <div className="text-white text-xl sm:text-3xl font-black drop-shadow-2xl tracking-tight">{score.toLocaleString()}</div>
        </div>
        
        {/* Target Sum Card */}
        <div className="bg-gradient-to-br from-orange-500/80 via-red-500/80 to-rose-500/80 backdrop-blur-xl p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300 hover:scale-105" style={{ boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
          <div className="text-white/70 text-[8px] sm:text-[10px] uppercase tracking-widest mb-1 sm:mb-1.5 font-semibold">Target Sum</div>
          <div className="text-white text-xl sm:text-3xl font-black drop-shadow-2xl tracking-tight">{targetSum}</div>
        </div>
        
        {/* Level Indicator Card */}
        <div className="bg-gradient-to-br from-emerald-600/80 via-green-600/80 to-teal-600/80 backdrop-blur-xl p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-300 hover:scale-105" style={{ boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
          <div className="text-white/70 text-[8px] sm:text-[10px] uppercase tracking-widest mb-1 sm:mb-1.5 font-semibold">Level</div>
          <div className="text-white text-xl sm:text-3xl font-black drop-shadow-2xl mb-1.5 sm:mb-2 tracking-tight">{level}</div>
          <div className="w-full bg-black/40 rounded-full h-1 sm:h-1.5 mb-0.5 sm:mb-1 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 h-full rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ 
                width: `${(combinationsCleared / 10) * 100}%`,
                boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)'
              }}
            />
          </div>
          <div className="text-white/60 text-[8px] sm:text-[9px] uppercase tracking-wider">
            {combinationsCleared}/10
          </div>
        </div>
        
        {/* Combo Indicator Card */}
        {comboCount > 0 && (
          <div className="bg-gradient-to-br from-yellow-500/90 via-amber-500/90 to-orange-500/90 backdrop-blur-xl p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-yellow-400/40 animate-pulse-glow transition-all duration-300 hover:scale-105" style={{ boxShadow: '0 8px 32px rgba(251, 191, 36, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 30px rgba(251, 191, 36, 0.4)' }}>
            <div className="text-white/80 text-[8px] sm:text-[10px] uppercase tracking-widest mb-1 sm:mb-1.5 font-semibold">Combo</div>
            <div className="text-white text-lg sm:text-2xl font-black drop-shadow-2xl tracking-tight">
              {comboCount}x
            </div>
            <div className="text-yellow-100 text-xs sm:text-sm font-bold drop-shadow-lg">
              {comboMultiplier}x Multiplier
            </div>
          </div>
        )}
      </div>
        
      {/* Level Up Notification - Responsive */}
      {justLeveledUp && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 px-4">
          <div className="relative w-full max-w-md">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-br from-yellow-400/95 via-amber-500/95 to-orange-500/95 backdrop-blur-xl p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-yellow-300/50 animate-bounce" style={{ boxShadow: '0 0 60px rgba(251, 191, 36, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.3)' }}>
              <div className="text-center">
                <div className="text-4xl sm:text-7xl font-black mb-2 sm:mb-3 text-white drop-shadow-2xl tracking-tight" style={{ textShadow: '0 0 30px rgba(0, 0, 0, 0.8)' }}>
                  LEVEL UP!
                </div>
                <div className="text-white text-2xl sm:text-4xl font-black drop-shadow-xl">
                  Level {level}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Pause Modal - Responsive */}
      {isPaused && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-50 px-4">
          <div className="bg-gradient-to-br from-gray-900/98 via-black/98 to-gray-900/98 backdrop-blur-2xl p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 max-w-md w-full" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
            <div className="text-center">
              <div className="text-4xl sm:text-6xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
                PAUSED
              </div>
              <div className="text-white/60 text-sm sm:text-lg mb-6 sm:mb-8 font-medium">Press P or ESC to resume</div>
              <button
                onClick={togglePause}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-white/10 text-sm sm:text-base"
                style={{ boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' }}
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal - Responsive */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-50 px-4">
          <div className="bg-gradient-to-br from-gray-900/98 via-black/98 to-gray-900/98 backdrop-blur-2xl p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 max-w-md w-full" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
            <div className="text-center">
              <div className="text-4xl sm:text-6xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-red-500 via-orange-500 to-rose-500 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
                Game Over!
              </div>
              <div className="text-white/60 text-sm sm:text-lg mb-3 sm:mb-4 font-medium">Final Score</div>
              <div className="text-white text-3xl sm:text-5xl font-black mb-6 sm:mb-8 drop-shadow-xl tracking-tight">{score.toLocaleString()}</div>
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-white/10 text-sm sm:text-base"
                style={{ boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' }}
              >
                Play Again (R)
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls Help - Modern Glassmorphism Card - Responsive (Desktop only) */}
      <div className="hidden md:block absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
        <div className="text-white/90">
          <div className="font-bold mb-2 sm:mb-3 text-white text-xs sm:text-sm uppercase tracking-wider">Controls</div>
          <div className="space-y-1.5 sm:space-y-2 text-white/80 text-[10px] sm:text-xs">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="flex gap-0.5 sm:gap-1">
                <kbd className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 bg-white/15 hover:bg-white/25 rounded text-[10px] sm:text-xs font-semibold border border-white/20 transition-colors">←</kbd>
                <kbd className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 bg-white/15 hover:bg-white/25 rounded text-[10px] sm:text-xs font-semibold border border-white/20 transition-colors">→</kbd>
              </div>
              <span className="text-white/70">Move</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5">
              <kbd className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 bg-white/15 hover:bg-white/25 rounded text-[10px] sm:text-xs font-semibold border border-white/20 transition-colors">↓</kbd>
              <span className="text-white/70">Move Down</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5">
              <kbd className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 bg-white/15 hover:bg-white/25 rounded text-[10px] sm:text-xs font-semibold border border-white/20 transition-colors">Space</kbd>
              <span className="text-white/70">Drop</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5">
              <kbd className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 bg-white/15 hover:bg-white/25 rounded text-[10px] sm:text-xs font-semibold border border-white/20 transition-colors">P</kbd>
              <span className="text-white/70">Pause</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Controls */}
      <MobileControls />
    </div>
  );
}

