/**
 * Contrast Calculation Utilities
 *
 * Uses culori for WCAG 2.x contrast ratio calculations.
 * Determines pass/fail status for various WCAG levels.
 */

import { wcagContrast } from 'culori';
import type { ContrastResult } from '@/types';
import { findNearestAccessible, getTargetRatio } from './suggestions';

/**
 * WCAG 2.x Contrast Ratio Thresholds
 *
 * Based on WCAG 2.2 guidelines:
 * - Normal text AA: 4.5:1
 * - Normal text AAA: 7:1
 * - Large text AA: 3:1 (large = 18pt+ or 14pt+ bold)
 * - UI components: 3:1 (graphical objects and UI component visual boundaries)
 */
const CONTRAST_THRESHOLDS = {
  AA_NORMAL: 4.5,
  AAA_NORMAL: 7,
  AA_LARGE: 3,
  UI_COMPONENT: 3,
} as const;

/**
 * Calculates WCAG 2.x contrast ratio between two colors
 *
 * Uses culori's wcagContrast function which implements the WCAG 2.x
 * relative luminance formula. Returns a ratio between 1:1 and 21:1.
 *
 * @param foreground - Foreground color hex (6-digit without #)
 * @param background - Background color hex (6-digit without #)
 * @returns Contrast ratio between 1 and 21
 *
 * @example
 * calculateContrast("000000", "FFFFFF") // 21 (black on white)
 * calculateContrast("767676", "FFFFFF") // ~4.54 (AA boundary gray)
 */
export function calculateContrast(
  foreground: string,
  background: string
): number {
  // Add # prefix for culori
  const fgColor = `#${foreground}`;
  const bgColor = `#${background}`;

  // Calculate contrast ratio using culori
  const ratio = wcagContrast(fgColor, bgColor);

  // Round to 2 decimal places for display
  return Math.round(ratio * 100) / 100;
}

/**
 * Determines if a contrast ratio passes various WCAG levels
 *
 * @param ratio - The contrast ratio to evaluate
 * @returns Object with pass/fail status for each level
 */
export function evaluateContrastRatio(ratio: number) {
  return {
    passesAA: ratio >= CONTRAST_THRESHOLDS.AA_NORMAL,
    passesAAA: ratio >= CONTRAST_THRESHOLDS.AAA_NORMAL,
    passesAALarge: ratio >= CONTRAST_THRESHOLDS.AA_LARGE,
    passesUIComponent: ratio >= CONTRAST_THRESHOLDS.UI_COMPONENT,
  };
}

/**
 * Calculates complete contrast result between two colors
 *
 * This is the main function to use for generating contrast information.
 * It calculates the ratio and evaluates pass/fail for all WCAG levels.
 * For failing pairs, calculates a suggested fix.
 *
 * @param foregroundId - ID of the foreground color
 * @param foregroundHex - Foreground color hex (6-digit without #)
 * @param backgroundId - ID of the background color
 * @param backgroundHex - Background color hex (6-digit without #)
 * @param targetLevel - Target WCAG level for suggestions (AA or AAA)
 * @returns Complete ContrastResult object
 *
 * @example
 * ```ts
 * const result = calculateContrastResult(
 *   "color-1",
 *   "000000",
 *   "color-2",
 *   "FFFFFF",
 *   "AA"
 * );
 * // result.ratio === 21
 * // result.passesAA === true
 * // result.passesAAA === true
 * ```
 */
export function calculateContrastResult(
  foregroundId: string,
  foregroundHex: string,
  backgroundId: string,
  backgroundHex: string,
  targetLevel: 'AA' | 'AAA' = 'AA'
): ContrastResult {
  // Calculate the contrast ratio
  const ratio = calculateContrast(foregroundHex, backgroundHex);

  // Evaluate pass/fail for each level
  const evaluation = evaluateContrastRatio(ratio);

  // Calculate suggested fix if it fails the target level
  const passes = targetLevel === 'AA' ? evaluation.passesAA : evaluation.passesAAA;
  let suggestedFix: string | null = null;

  if (!passes && foregroundId !== backgroundId) {
    // Only suggest fixes for different colors (not diagonal cells)
    const targetRatio = getTargetRatio(targetLevel);
    suggestedFix = findNearestAccessible(
      foregroundHex,
      backgroundHex,
      targetRatio
    );
  }

  return {
    foregroundId,
    backgroundId,
    ratio,
    apcaValue: null, // APCA is a stretch goal, not in MVP
    ...evaluation,
    suggestedFix,
  };
}

/**
 * Generates a complete N×N contrast matrix for a palette
 *
 * For a palette with N colors, this generates N×N contrast results,
 * testing every foreground-background combination.
 *
 * @param colors - Array of color entries with id and hex
 * @param targetLevel - Target WCAG level for suggestions (AA or AAA)
 * @returns Array of ContrastResult objects (length = colors.length²)
 *
 * @example
 * ```ts
 * const colors = [
 *   { id: "1", hex: "000000", ... },
 *   { id: "2", hex: "FFFFFF", ... }
 * ];
 * const matrix = generateContrastMatrix(colors, 'AA');
 * // Returns 4 results: [1 on 1, 1 on 2, 2 on 1, 2 on 2]
 * ```
 */
export function generateContrastMatrix(
  colors: Array<{ id: string; hex: string }>,
  targetLevel: 'AA' | 'AAA' = 'AA'
): ContrastResult[] {
  const results: ContrastResult[] = [];

  // Generate all N×N combinations
  for (const foreground of colors) {
    for (const background of colors) {
      const result = calculateContrastResult(
        foreground.id,
        foreground.hex,
        background.id,
        background.hex,
        targetLevel
      );
      results.push(result);
    }
  }

  return results;
}

/**
 * Finds a contrast result for a specific foreground-background pair
 *
 * Helper function to retrieve a specific result from a matrix.
 *
 * @param matrix - Array of contrast results
 * @param foregroundId - ID of foreground color
 * @param backgroundId - ID of background color
 * @returns The matching ContrastResult, or undefined if not found
 */
export function findContrastResult(
  matrix: ContrastResult[],
  foregroundId: string,
  backgroundId: string
): ContrastResult | undefined {
  return matrix.find(
    (result) =>
      result.foregroundId === foregroundId &&
      result.backgroundId === backgroundId
  );
}

/**
 * Gets a summary of passing and failing color pairs
 *
 * @param matrix - Array of contrast results
 * @param targetLevel - The WCAG level to evaluate ('AA' or 'AAA')
 * @returns Object with counts and percentages
 */
export function getContrastSummary(
  matrix: ContrastResult[],
  targetLevel: 'AA' | 'AAA'
) {
  // Filter out same-color pairs (diagonal of the matrix)
  const validPairs = matrix.filter(
    (result) => result.foregroundId !== result.backgroundId
  );

  const passingPairs = validPairs.filter((result) =>
    targetLevel === 'AA' ? result.passesAA : result.passesAAA
  );

  const total = validPairs.length;
  const passing = passingPairs.length;
  const failing = total - passing;
  const percentage = total > 0 ? Math.round((passing / total) * 100) : 0;

  return {
    total,
    passing,
    failing,
    percentage,
  };
}
