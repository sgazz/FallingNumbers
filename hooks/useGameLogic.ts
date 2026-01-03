import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

export interface Position {
  x: number;
  y: number;
}

export type PieceType = 'single' | 'horizontal' | 'vertical';

export interface Piece {
  type: PieceType;
  numbers: number[]; // [number] for single, [number1, number2] for double
  positions: Position[]; // Relative positions within the piece
}

// Helper to create pieces
const createPiece = (type: PieceType, numbers: number[]): Piece => {
  if (type === 'single') {
    return {
      type: 'single',
      numbers: [numbers[0]],
      positions: [{ x: 0, y: 0 }],
    };
  } else if (type === 'horizontal') {
    return {
      type: 'horizontal',
      numbers: [numbers[0], numbers[1]],
      positions: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
    };
  } else {
    // vertical
    return {
      type: 'vertical',
      numbers: [numbers[0], numbers[1]],
      positions: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
    };
  }
};

export function useGameLogic(gridWidth: number, gridHeight: number) {
  const [grid, setGrid] = useState<(number | null)[][]>(() =>
    Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 0, y: 0 });
  
  // Backward compatibility - get first number from piece
  const currentNumber = currentPiece?.numbers[0] ?? null;
  const [targetSum, setTargetSum] = useState(10); // Default value, will be set in useEffect
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [comboCount, setComboCount] = useState(0); // Current combo streak
  const [comboMultiplier, setComboMultiplier] = useState(1); // Current multiplier (1x, 2x, 3x...)
  const [lastClearedPositions, setLastClearedPositions] = useState<Position[]>([]); // For particle effects
  const [lastClearedCount, setLastClearedCount] = useState(0); // Number of cleared cells for particle color
  const [level, setLevel] = useState(1); // Current level
  const [combinationsCleared, setCombinationsCleared] = useState(0); // Combinations cleared in current level
  const [justLeveledUp, setJustLeveledUp] = useState(false); // Flag for level up animation
  const levelRef = useRef(1); // Ref to track current level for synchronous access
  const combinationsClearedRef = useRef(0); // Ref to track combinations cleared for synchronous access
  const initialized = useRef(false);
  const targetSumInitialized = useRef(false);
  const lastComboTime = useRef<number | null>(null);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Keep refs in sync with state
  useEffect(() => {
    levelRef.current = level;
  }, [level]);
  
  useEffect(() => {
    combinationsClearedRef.current = combinationsCleared;
  }, [combinationsCleared]);

  const checkGameOver = useCallback(
    (currentGrid: (number | null)[][]): boolean => {
      // Check if top row (y=0) is completely filled
      const topRow = currentGrid[0];
      const isTopRowFull = topRow.every((cell) => cell !== null);
      
      if (isTopRowFull) {
        return true;
      }

      // Also check if there's no space for a new number to spawn
      // (check if center position and nearby positions in top row are all occupied)
      const centerX = Math.floor(gridWidth / 2);
      const spawnPositions = [
        centerX,
        centerX - 1 >= 0 ? centerX - 1 : null,
        centerX + 1 < gridWidth ? centerX + 1 : null,
      ].filter((x) => x !== null) as number[];

      const noSpawnSpace = spawnPositions.every((x) => currentGrid[0][x] !== null);
      
      return noSpawnSpace;
    },
    [gridWidth]
  );

  const spawnNewNumber = useCallback(() => {
    // Check if game is over before spawning
    if (checkGameOver(grid)) {
      setGameOver(true);
      setCurrentPiece(null);
      return;
    }

    const startX = Math.floor(gridWidth / 2);
    
    // 5% chance for double piece, 95% for single
    const isDouble = Math.random() < 0.05;
    let piece: Piece;
    let spawnX = startX;

    if (isDouble) {
      // Create double piece (horizontal or vertical, 50/50)
      const isHorizontal = Math.random() < 0.5;
      const num1 = Math.floor(Math.random() * 9) + 1;
      const num2 = Math.floor(Math.random() * 9) + 1;
      
      if (isHorizontal) {
        piece = createPiece('horizontal', [num1, num2]);
        // Check if horizontal piece fits
        if (startX + 1 >= gridWidth || grid[0][startX] !== null || grid[0][startX + 1] !== null) {
          // Try to find space for horizontal piece
          let found = false;
          for (let offset = 1; offset < gridWidth - 1; offset++) {
            if (startX + offset + 1 < gridWidth && 
                grid[0][startX + offset] === null && 
                grid[0][startX + offset + 1] === null) {
              spawnX = startX + offset;
              found = true;
              break;
            }
            if (startX - offset >= 0 && 
                grid[0][startX - offset] === null && 
                grid[0][startX - offset + 1] === null) {
              spawnX = startX - offset;
              found = true;
              break;
            }
          }
          if (!found) {
            // Fallback to single piece if no space for horizontal
            piece = createPiece('single', [num1]);
          }
        }
      } else {
        // Vertical piece - only needs one column, but check top two rows
        piece = createPiece('vertical', [num1, num2]);
        if (grid[0][startX] !== null || (grid[1] && grid[1][startX] !== null)) {
          // Try to find space
          let found = false;
          for (let offset = 1; offset < gridWidth; offset++) {
            if (startX + offset < gridWidth && 
                grid[0][startX + offset] === null && 
                (grid[1] && grid[1][startX + offset] === null)) {
              spawnX = startX + offset;
              found = true;
              break;
            }
            if (startX - offset >= 0 && 
                grid[0][startX - offset] === null && 
                (grid[1] && grid[1][startX - offset] === null)) {
              spawnX = startX - offset;
              found = true;
              break;
            }
          }
          if (!found) {
            // Fallback to single piece
            piece = createPiece('single', [num1]);
          }
        }
      }
    } else {
      // Single piece
      const newNumber = Math.floor(Math.random() * 9) + 1;
      piece = createPiece('single', [newNumber]);
      
      // Find available position in top row
      if (grid[0][spawnX] !== null) {
        let found = false;
        for (let offset = 1; offset < gridWidth; offset++) {
          if (startX + offset < gridWidth && grid[0][startX + offset] === null) {
            spawnX = startX + offset;
            found = true;
            break;
          }
          if (startX - offset >= 0 && grid[0][startX - offset] === null) {
            spawnX = startX - offset;
            found = true;
            break;
          }
        }
        if (!found) {
          setGameOver(true);
          setCurrentPiece(null);
          return;
        }
      }
    }
    
    setCurrentPiece(piece);
    setCurrentPosition({ x: spawnX, y: 0 });
  }, [gridWidth, grid, checkGameOver]);

  // Initialize target sum on client side only
  useEffect(() => {
    if (!targetSumInitialized.current) {
      targetSumInitialized.current = true;
      setTargetSum(Math.floor(Math.random() * 16) + 5); // 5-20
    }
  }, []);

  // Initialize first piece
  useEffect(() => {
    if (!initialized.current && !currentPiece && !gameOver && targetSumInitialized.current) {
      initialized.current = true;
      spawnNewNumber();
    }
  }, [currentPiece, gameOver, spawnNewNumber]);

  const canMovePiece = useCallback(
    (piece: Piece, basePos: Position): boolean => {
      // Check all positions in the piece
      for (let i = 0; i < piece.positions.length; i++) {
        const relPos = piece.positions[i];
        const absPos = {
          x: basePos.x + relPos.x,
          y: basePos.y + relPos.y,
        };
        
        // Check bounds
        if (absPos.x < 0 || absPos.x >= gridWidth || absPos.y >= gridHeight) {
          return false;
        }
        
        // Allow above grid (y < 0)
        if (absPos.y < 0) continue;
        
        // Check if cell is occupied
        if (grid[absPos.y][absPos.x] !== null) {
          return false;
        }
      }
      return true;
    },
    [grid, gridWidth, gridHeight]
  );
  
  // Backward compatibility
  const canMove = useCallback(
    (pos: Position): boolean => {
      if (pos.x < 0 || pos.x >= gridWidth || pos.y >= gridHeight) {
        return false;
      }
      if (pos.y < 0) return true;
      return grid[pos.y][pos.x] === null;
    },
    [grid, gridWidth, gridHeight]
  );

  const placePiece = useCallback(
    (piece: Piece, basePos: Position, currentGrid: (number | null)[][]): (number | null)[][] | null => {
      const newGrid = currentGrid.map((row) => [...row]);
      let hasInvalidPos = false;
      
      // Place all numbers from the piece
      for (let i = 0; i < piece.positions.length; i++) {
        const relPos = piece.positions[i];
        const absPos = {
          x: basePos.x + relPos.x,
          y: basePos.y + relPos.y,
        };
        
        // Check if position is valid
        if (absPos.y < 0 || absPos.y >= gridHeight || absPos.x < 0 || absPos.x >= gridWidth) {
          hasInvalidPos = true;
          continue;
        }
        
        newGrid[absPos.y][absPos.x] = piece.numbers[i];
      }
      
      if (hasInvalidPos) {
        setGameOver(true);
        setCurrentPiece(null);
        return null;
      }
      
      setCurrentPiece(null);
      return newGrid;
    },
    [gridHeight, gridWidth]
  );
  
  // Backward compatibility - for single numbers
  const placeNumber = useCallback(
    (pos: Position, number: number, currentGrid: (number | null)[][]): (number | null)[][] | null => {
      const singlePiece = createPiece('single', [number]);
      return placePiece(singlePiece, pos, currentGrid);
    },
    [placePiece]
  );

  const checkAndClearLines = useCallback(
    (newGrid: (number | null)[][], placedPos: Position) => {
      let clearedCount = 0;
      let updatedGrid = newGrid.map((row) => [...row]);
      const cellsToClear = new Set<string>();

      // Helper function to convert position to string key
      const posKey = (x: number, y: number) => `${x},${y}`;
      const keyToPos = (key: string): Position => {
        const [x, y] = key.split(',').map(Number);
        return { x, y };
      };

      // Get all adjacent positions (horizontal and vertical only)
      const getAdjacent = (pos: Position): Position[] => {
        const adjacent: Position[] = [];
        const { x, y } = pos;
        
        if (x > 0) adjacent.push({ x: x - 1, y });
        if (x < gridWidth - 1) adjacent.push({ x: x + 1, y });
        if (y > 0) adjacent.push({ x, y: y - 1 });
        if (y < gridHeight - 1) adjacent.push({ x, y: y + 1 });
        
        return adjacent;
      };

      // Check if two positions are adjacent
      const isAdjacent = (pos1: Position, pos2: Position): boolean => {
        const dx = Math.abs(pos1.x - pos2.x);
        const dy = Math.abs(pos1.y - pos2.y);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
      };

      // Check if a set of positions forms a connected group (all adjacent to at least one other)
      const isConnected = (positions: Position[]): boolean => {
        if (positions.length <= 1) return true;
        
        const visited = new Set<string>();
        const queue: Position[] = [positions[0]];
        visited.add(posKey(positions[0].x, positions[0].y));
        
        while (queue.length > 0) {
          const current = queue.shift()!;
          const currentKey = posKey(current.x, current.y);
          
          for (const pos of positions) {
            const posKeyStr = posKey(pos.x, pos.y);
            if (!visited.has(posKeyStr) && isAdjacent(current, pos)) {
              visited.add(posKeyStr);
              queue.push(pos);
            }
          }
        }
        
        return visited.size === positions.length;
      };

      // Find all possible combinations of adjacent numbers that sum to target
      const findCombinations = (startPos: Position, visited: Set<string>, currentSum: number, currentPath: Position[]): void => {
        const startKey = posKey(startPos.x, startPos.y);
        
        // If we've already visited this position in this path, skip
        if (visited.has(startKey)) return;
        
        // If cell is empty, skip
        if (updatedGrid[startPos.y][startPos.x] === null) return;
        
        const cellValue = updatedGrid[startPos.y][startPos.x]!;
        const newSum = currentSum + cellValue;
        const newPath = [...currentPath, startPos];
        const newVisited = new Set(visited);
        newVisited.add(startKey);
        
        // If we've exceeded target sum, no need to continue
        if (newSum > targetSum) return;
        
        // If we've reached target sum and path is connected, mark for clearing
        if (newSum === targetSum && isConnected(newPath)) {
          newPath.forEach(pos => cellsToClear.add(posKey(pos.x, pos.y)));
          return;
        }
        
        // Continue searching from adjacent cells
        const adjacent = getAdjacent(startPos);
        for (const adjPos of adjacent) {
          // Only continue if adjacent cell is not in current path and has a value
          const adjKey = posKey(adjPos.x, adjPos.y);
          if (!newVisited.has(adjKey) && updatedGrid[adjPos.y][adjPos.x] !== null) {
            findCombinations(adjPos, newVisited, newSum, newPath);
          }
        }
      };

      // Start searching from placed position
      if (placedPos.y >= 0 && placedPos.y < gridHeight && placedPos.x >= 0 && placedPos.x < gridWidth) {
        if (updatedGrid[placedPos.y][placedPos.x] !== null) {
          findCombinations(placedPos, new Set(), 0, []);
        }
      }

      // Clear all matched cells and track positions for particles
      const clearedPositions: Position[] = [];
      cellsToClear.forEach(key => {
        const [x, y] = key.split(',').map(Number);
        updatedGrid[y][x] = null;
        clearedPositions.push({ x, y });
        clearedCount++;
      });
      
      // Store cleared positions for particle effects
      if (clearedPositions.length > 0) {
        setLastClearedPositions(clearedPositions);
        setLastClearedCount(clearedCount);
      }

      if (clearedCount > 0) {
        // Combo system - check if combo should continue or reset
        const now = Date.now();
        const comboTimeWindow = 6000; // 6 seconds to maintain combo
        
        if (lastComboTime.current === null || now - lastComboTime.current > comboTimeWindow) {
          // Reset combo - too much time passed
          setComboCount(1);
          setComboMultiplier(1);
        } else {
          // Continue combo
          setComboCount((prev) => {
            const newCount = prev + 1;
            // Calculate multiplier: 1x for 1 combo, 2x for 2-3, 3x for 4-5, 4x for 6-7, etc.
            const newMultiplier = Math.min(Math.floor(newCount / 2) + 1, 10); // Max 10x
            setComboMultiplier(newMultiplier);
            return newCount;
          });
        }
        
        lastComboTime.current = now;
        
        // Clear previous timeout
        if (comboTimeoutRef.current) {
          clearTimeout(comboTimeoutRef.current);
        }
        
        // Set timeout to reset combo if no more combos
        comboTimeoutRef.current = setTimeout(() => {
          setComboCount(0);
          setComboMultiplier(1);
          lastComboTime.current = null;
        }, comboTimeWindow);
        
        // Calculate score with combo multiplier
        const baseScore = clearedCount * 10;
        const comboBonus = baseScore * (comboMultiplier - 1);
        const totalScore = baseScore + comboBonus;
        
        setScore((prev) => prev + totalScore);
        
        // Level system - track combinations cleared
        // Use ref to avoid race conditions with multiple rapid calls
        const currentCleared = combinationsClearedRef.current;
        const newCount = currentCleared + 1;
        const combinationsPerLevel = 10;
        let leveledUp = false;
        
        if (newCount >= combinationsPerLevel) {
          // Level up!
          const currentLevel = levelRef.current;
          const newLevel = currentLevel + 1;
          levelRef.current = newLevel; // Update ref immediately
          combinationsClearedRef.current = 0; // Reset ref
          leveledUp = true;
          
          setLevel(newLevel);
          setCombinationsCleared(0); // Reset for next level
          // Bonus points for level completion
          const levelBonus = newLevel * 50;
          setScore((prevScore) => prevScore + levelBonus);
          setJustLeveledUp(true);
          // Reset after animation
          setTimeout(() => setJustLeveledUp(false), 2000);
        } else {
          combinationsClearedRef.current = newCount; // Update ref
          setCombinationsCleared(newCount);
        }
        
        // Generate new target sum based on current level
        const currentLevel = leveledUp ? levelRef.current : level;
        const minTarget = currentLevel <= 3 ? 5 : currentLevel <= 6 ? 8 : currentLevel <= 10 ? 10 : 12;
        const maxTarget = currentLevel <= 3 ? 15 : currentLevel <= 6 ? 18 : currentLevel <= 10 ? 20 : 22;
        setTargetSum(Math.floor(Math.random() * (maxTarget - minTarget + 1)) + minTarget);
      }

      return updatedGrid;
    },
    [gridWidth, gridHeight, targetSum]
  );

  const togglePause = useCallback(() => {
    if (gameOver) return;
    setIsPaused((prev) => !prev);
  }, [gameOver]);

  const moveLeft = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const newPos = { ...currentPosition, x: currentPosition.x - 1 };
    if (canMovePiece(currentPiece, newPos)) {
      setCurrentPosition(newPos);
    }
  }, [currentPiece, currentPosition, canMovePiece, gameOver, isPaused]);

  const moveRight = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const newPos = { ...currentPosition, x: currentPosition.x + 1 };
    if (canMovePiece(currentPiece, newPos)) {
      setCurrentPosition(newPos);
    }
  }, [currentPiece, currentPosition, canMovePiece, gameOver, isPaused]);

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const newPos = { ...currentPosition, y: currentPosition.y + 1 };
    if (canMovePiece(currentPiece, newPos)) {
      setCurrentPosition(newPos);
    } else {
      // Place the piece
      const newGrid = placePiece(currentPiece, currentPosition, grid);
      if (newGrid) {
        // Check clearing - only call once with the first valid position
        // checkAndClearLines already searches all adjacent cells, so we don't need to call it multiple times
        const firstPosition = {
          x: currentPosition.x + currentPiece.positions[0].x,
          y: currentPosition.y + currentPiece.positions[0].y,
        };
        
        let clearedGrid = newGrid;
        if (firstPosition.y >= 0 && firstPosition.y < gridHeight && firstPosition.x >= 0 && firstPosition.x < gridWidth) {
          clearedGrid = checkAndClearLines(clearedGrid, firstPosition);
        }
        
        setGrid(clearedGrid);
        
        // Check if game is over after clearing (option 2 + 6)
        if (checkGameOver(clearedGrid)) {
          setGameOver(true);
          setCurrentPiece(null);
        } else {
          spawnNewNumber();
        }
      }
    }
  }, [currentPiece, currentPosition, canMovePiece, gameOver, isPaused, placePiece, grid, checkAndClearLines, spawnNewNumber, checkGameOver, gridHeight, gridWidth]);

  const drop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    let newPos = { ...currentPosition };
    while (canMovePiece(currentPiece, { ...newPos, y: newPos.y + 1 })) {
      newPos.y++;
    }
    setCurrentPosition(newPos);
    
    // Place the piece
    const newGrid = placePiece(currentPiece, newPos, grid);
    if (newGrid) {
      // Check clearing - only call once with the first valid position
      // checkAndClearLines already searches all adjacent cells, so we don't need to call it multiple times
      const firstPosition = {
        x: newPos.x + currentPiece.positions[0].x,
        y: newPos.y + currentPiece.positions[0].y,
      };
      
      let clearedGrid = newGrid;
      if (firstPosition.y >= 0 && firstPosition.y < gridHeight && firstPosition.x >= 0 && firstPosition.x < gridWidth) {
        clearedGrid = checkAndClearLines(clearedGrid, firstPosition);
      }
      
      setGrid(clearedGrid);
      
      // Check if game is over after clearing (option 2 + 6)
      if (checkGameOver(clearedGrid)) {
        setGameOver(true);
        setCurrentPiece(null);
      } else {
        spawnNewNumber();
      }
    }
  }, [currentPiece, currentPosition, canMovePiece, gameOver, isPaused, placePiece, grid, checkAndClearLines, spawnNewNumber, checkGameOver, gridHeight, gridWidth]);

  // Calculate fall speed based on level (0.8s at level 1, decreasing by 0.05s per level, min 0.1s)
  const fallSpeed = useMemo(() => {
    return Math.max(0.1, 0.8 - (level - 1) * 0.05);
  }, [level]);

  const resetGame = useCallback(() => {
    setGrid(Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(null)));
    setCurrentPiece(null);
    setCurrentPosition({ x: 0, y: 0 });
    setTargetSum(Math.floor(Math.random() * 16) + 5);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setComboCount(0);
    setComboMultiplier(1);
    setLastClearedPositions([]);
    setLastClearedCount(0);
    setLevel(1);
    levelRef.current = 1; // Reset ref as well
    setCombinationsCleared(0);
    combinationsClearedRef.current = 0; // Reset ref as well
    setJustLeveledUp(false);
    lastComboTime.current = null;
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
      comboTimeoutRef.current = null;
    }
    initialized.current = false;
  }, [gridWidth, gridHeight]);

  return {
    grid,
    currentNumber, // Backward compatibility
    currentPiece, // New
    currentPosition,
    targetSum,
    score,
    gameOver,
    isPaused,
    comboCount,
    comboMultiplier,
    lastClearedPositions, // For particle effects
    lastClearedCount, // For particle color
    level,
    combinationsCleared,
    justLeveledUp,
    fallSpeed,
    moveLeft,
    moveRight,
    moveDown,
    drop,
    resetGame,
    togglePause,
  };
}

