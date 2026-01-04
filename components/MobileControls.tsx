'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameContext } from '@/contexts/GameContext';

// Haptic feedback helper
const vibrate = (pattern: number | number[] = 10) => {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Vibration API not supported or failed
    }
  }
};

export default function MobileControls() {
  const { moveLeft, moveRight, moveDown, drop, gameOver, isPaused, currentPiece } = useGameContext();
  const [isMobile, setIsMobile] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  // Detect mobile device (including tablets like iPad)
  useEffect(() => {
    const checkMobile = () => {
      // Check user agent for mobile/tablet devices
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // Check for touch support (tablets have touch)
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check viewport width (iPad is 768px or 1024px)
      const isSmallViewport = window.innerWidth < 1024;
      
      // Consider it mobile if: mobile user agent OR (has touch AND small viewport)
      const isMobileDevice = isMobileUserAgent || (hasTouchSupport && isSmallViewport);
      
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Swipe gesture handlers
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (gameOver || isPaused || !currentPiece) return;
      
      // Prevent default to avoid scrolling and other browser behaviors
      e.preventDefault();
      
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      touchEndRef.current = null;
      isLongPressRef.current = false;

      // Long press detection for drop
      longPressTimerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        drop();
        vibrate([50, 30, 50]); // Strong vibration for drop
      }, 500); // 500ms for long press
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Cancel long press if user moves finger
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (gameOver || isPaused || !currentPiece || !touchStartRef.current) return;

      // Cancel long press if it was triggered
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      // If long press was already triggered, don't process swipe
      if (isLongPressRef.current) {
        isLongPressRef.current = false;
        return;
      }

      const touch = e.changedTouches[0];
      touchEndRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      if (!touchStartRef.current || !touchEndRef.current) return;

      const deltaX = touchEndRef.current.x - touchStartRef.current.x;
      const deltaY = touchEndRef.current.y - touchStartRef.current.y;
      const deltaTime = touchEndRef.current.time - touchStartRef.current.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Minimum swipe distance (30px) and maximum time (300ms)
      if (distance < 30 || deltaTime > 300) {
        return;
      }

      // Determine swipe direction
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) {
          // Swipe right
          moveRight();
          vibrate(10);
        } else {
          // Swipe left
          moveLeft();
          vibrate(10);
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          // Swipe down
          moveDown();
          vibrate(10);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [isMobile, moveLeft, moveRight, moveDown, drop, gameOver, isPaused, currentPiece]);

  // Don't render on desktop
  if (!isMobile) return null;

  // Don't show controls when game is over or paused (modals handle this)
  if (gameOver || isPaused || !currentPiece) return null;

  const handleButtonPress = (action: () => void, vibration: number | number[] = 10) => {
    action();
    vibrate(vibration);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto lg:hidden" style={{ marginBottom: 'env(safe-area-inset-bottom, 0)' }}>
      {/* On-screen controls - Compact horizontal layout */}
      <div className="flex items-center justify-center gap-2 p-3 pb-4">
        {/* Left button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleButtonPress(moveLeft);
          }}
          className="w-12 h-12 bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 active:scale-95 transition-transform duration-100 flex items-center justify-center"
          style={{ boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Down button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleButtonPress(moveDown);
          }}
          className="w-12 h-12 bg-gradient-to-br from-green-600/90 via-emerald-600/90 to-teal-600/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 active:scale-95 transition-transform duration-100 flex items-center justify-center"
          style={{ boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Drop button - Slightly larger */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleButtonPress(drop, [30, 20, 30]);
          }}
          className="w-14 h-14 bg-gradient-to-br from-red-600/90 via-rose-600/90 to-pink-600/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 active:scale-95 transition-transform duration-100 flex items-center justify-center"
          style={{ boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' }}
        >
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        {/* Right button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleButtonPress(moveRight);
          }}
          className="w-12 h-12 bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 active:scale-95 transition-transform duration-100 flex items-center justify-center"
          style={{ boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </div>
  );
}

