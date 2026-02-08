'use client';

/**
 * useContrastMatrix Hook
 *
 * Computes the full N×N contrast matrix for the current palette.
 * Automatically recalculates when colors change.
 */

import { useMemo } from 'react';
import { usePalette } from './usePalette';
import {
  generateContrastMatrix,
  getContrastSummary,
  findContrastResult,
} from '@/lib/color/contrast';
import type { ContrastResult } from '@/types';

/**
 * Return type for useContrastMatrix hook
 */
interface UseContrastMatrixReturn {
  /** Full N×N matrix of contrast results */
  matrix: ContrastResult[];
  /** Find a specific contrast result by color IDs */
  getResult: (foregroundId: string, backgroundId: string) => ContrastResult | undefined;
  /** Summary statistics for the current target level */
  summary: {
    total: number;
    passing: number;
    failing: number;
    percentage: number;
  };
}

/**
 * Hook to compute and access the contrast matrix
 *
 * Generates an N×N matrix where N is the number of colors in the palette.
 * Each cell represents the contrast ratio between a foreground and background color.
 *
 * The matrix is memoized and only recalculates when the palette colors change,
 * making it efficient to use in multiple components.
 *
 * @returns Object with matrix, getResult function, and summary statistics
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { matrix, getResult, summary } = useContrastMatrix();
 *
 *   const result = getResult(color1.id, color2.id);
 *   console.log(result?.ratio); // e.g., 4.54
 *   console.log(result?.passesAA); // true/false
 *
 *   console.log(summary.percentage); // % of pairs passing
 * }
 * ```
 */
export function useContrastMatrix(): UseContrastMatrixReturn {
  const { state } = usePalette();

  // Generate the full N×N contrast matrix
  // Memoized - only recalculates when colors or target level changes
  const matrix = useMemo(() => {
    return generateContrastMatrix(state.colors, state.targetLevel);
  }, [state.colors, state.targetLevel]);

  // Helper function to find a specific result in the matrix
  const getResult = useMemo(() => {
    return (foregroundId: string, backgroundId: string) => {
      return findContrastResult(matrix, foregroundId, backgroundId);
    };
  }, [matrix]);

  // Calculate summary statistics based on current target level
  const summary = useMemo(() => {
    return getContrastSummary(matrix, state.targetLevel);
  }, [matrix, state.targetLevel]);

  return {
    matrix,
    getResult,
    summary,
  };
}
