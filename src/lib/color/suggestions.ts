/**
 * Color Suggestion Utilities
 *
 * Finds the nearest accessible color by adjusting lightness in OKLCH space.
 * Uses binary search to minimize perceptual difference while meeting contrast targets.
 */

import { oklch, formatHex, wcagContrast, type Oklch } from 'culori';

/**
 * Maximum iterations for binary search to prevent infinite loops
 */
const MAX_ITERATIONS = 50;

/**
 * Precision for lightness adjustments (smaller = more precise but slower)
 */
const LIGHTNESS_PRECISION = 0.001;

/**
 * Finds the nearest accessible color by adjusting lightness
 *
 * Algorithm:
 * 1. Convert foreground to OKLCH (perceptually uniform color space)
 * 2. Determine direction: push lightness away from background
 * 3. Use binary search to find minimum lightness adjustment
 * 4. If primary direction fails, try opposite direction
 * 5. Return normalized hex or null if impossible
 *
 * Why OKLCH?
 * - Perceptually uniform: equal changes = equal visual differences
 * - Lightness adjustments feel more natural than RGB changes
 * - Preserves hue and chroma (colorfulness) while adjusting brightness
 *
 * @param foregroundHex - Foreground color hex (6-digit without #)
 * @param backgroundHex - Background color hex (6-digit without #)
 * @param targetRatio - Target WCAG contrast ratio (e.g., 4.5 for AA, 7 for AAA)
 * @returns Suggested hex (6-digit without #) or null if impossible
 *
 * @example
 * ```ts
 * // Fix a failing blue to meet AA on white
 * const fixed = findNearestAccessible("7C3AED", "FFFFFF", 4.5);
 * // Returns darker purple that passes AA
 * ```
 */
export function findNearestAccessible(
  foregroundHex: string,
  backgroundHex: string,
  targetRatio: number
): string | null {
  // Add # for culori
  const fgColor = `#${foregroundHex}`;
  const bgColor = `#${backgroundHex}`;

  // Parse foreground to OKLCH
  const fg = oklch(fgColor);
  if (!fg || fg.l === undefined) return null;

  // Check if already passes
  const currentRatio = wcagContrast(fgColor, bgColor);
  if (currentRatio >= targetRatio) {
    return foregroundHex; // Already accessible
  }

  // Get background lightness to determine direction
  const bg = oklch(bgColor);
  const bgLightness = bg?.l ?? 0.5;

  // Determine primary direction:
  // If foreground is lighter than background, darken it (decrease lightness)
  // If foreground is darker than background, lighten it (increase lightness)
  // This pushes colors apart to increase contrast
  const shouldDarken = fg.l > bgLightness;

  // Try primary direction first
  let result = searchLightness(fg, bgColor, targetRatio, shouldDarken);

  // If primary direction fails, try opposite direction
  if (!result) {
    result = searchLightness(fg, bgColor, targetRatio, !shouldDarken);
  }

  if (!result) return null;

  // Convert back to hex and normalize (remove #, uppercase)
  const hexResult = formatHex(result);
  return hexResult ? hexResult.replace('#', '').toUpperCase() : null;
}

/**
 * Binary search for the minimum lightness adjustment that meets the target
 *
 * @param fg - Foreground color in OKLCH
 * @param bgColor - Background color hex (with #)
 * @param targetRatio - Target contrast ratio
 * @param shouldDarken - True to darken, false to lighten
 * @returns Adjusted OKLCH color or null if target unreachable
 */
function searchLightness(
  fg: Oklch,
  bgColor: string,
  targetRatio: number,
  shouldDarken: boolean
): Oklch | null {
  let low = shouldDarken ? 0 : fg.l;
  let high = shouldDarken ? fg.l : 1;
  let bestColor: Oklch | null = null;
  let iterations = 0;

  while (iterations < MAX_ITERATIONS && high - low > LIGHTNESS_PRECISION) {
    iterations++;

    const mid = (low + high) / 2;
    const testColor: Oklch = { ...fg, l: mid };
    const testHex = formatHex(testColor);

    if (!testHex) break;

    const ratio = wcagContrast(testHex, bgColor);

    if (ratio >= targetRatio) {
      // Meets target - this is a candidate
      bestColor = testColor;

      // Try to get closer to original (less adjustment)
      if (shouldDarken) {
        low = mid; // Try lighter (closer to original)
      } else {
        high = mid; // Try darker (closer to original)
      }
    } else {
      // Doesn't meet target - need more adjustment
      if (shouldDarken) {
        high = mid; // Go darker
      } else {
        low = mid; // Go lighter
      }
    }
  }

  return bestColor;
}

/**
 * Gets the target contrast ratio for a given WCAG level
 *
 * @param targetLevel - WCAG level (AA or AAA)
 * @param isLarge - Whether this is large text (18pt+ or 14pt+ bold)
 * @returns Required contrast ratio
 */
export function getTargetRatio(
  targetLevel: 'AA' | 'AAA',
  isLarge: boolean = false
): number {
  if (isLarge) {
    return 3; // AA Large / AAA Large both require 3:1
  }
  return targetLevel === 'AA' ? 4.5 : 7;
}

/**
 * Finds accessible suggestions for all failing pairs in a color
 *
 * Given a foreground color and a list of backgrounds, finds suggestions
 * for any backgrounds where the contrast fails the target.
 *
 * @param foregroundHex - Foreground color hex
 * @param backgrounds - Array of background colors with their IDs
 * @param targetLevel - Target WCAG level
 * @returns Map of background ID to suggested hex
 */
export function findSuggestionsForColor(
  foregroundHex: string,
  backgrounds: Array<{ id: string; hex: string }>,
  targetLevel: 'AA' | 'AAA'
): Map<string, string> {
  const suggestions = new Map<string, string>();
  const targetRatio = getTargetRatio(targetLevel);

  for (const bg of backgrounds) {
    // Skip same color
    if (bg.hex === foregroundHex) continue;

    const suggestion = findNearestAccessible(
      foregroundHex,
      bg.hex,
      targetRatio
    );

    if (suggestion && suggestion !== foregroundHex) {
      suggestions.set(bg.id, suggestion);
    }
  }

  return suggestions;
}
