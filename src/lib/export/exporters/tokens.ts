/**
 * Design Tokens JSON Exporter
 *
 * Generates design tokens in W3C format.
 */

import type { ColorEntry } from '@/types';

/**
 * W3C Design Token format
 */
interface DesignToken {
  $value: string;
  $type: 'color';
  $description?: string;
}

/**
 * Exports palette as W3C Design Tokens JSON
 *
 * Generates a JSON file following the W3C Design Tokens format.
 * Each color has $value, $type, and optional $description.
 *
 * @param colors - Array of color entries
 * @param summary - Contrast summary
 * @param targetLevel - Target WCAG level
 * @returns JSON file content as formatted string
 *
 * @example
 * ```json
 * {
 *   "color": {
 *     "primary": {
 *       "$value": "#2563EB",
 *       "$type": "color",
 *       "$description": "Primary brand color (primary)"
 *     }
 *   }
 * }
 * ```
 */
export function exportToTokens(
  colors: ColorEntry[],
  summary: { passing: number; total: number; percentage: number },
  targetLevel: 'AA' | 'AAA'
): string {
  const date = new Date().toISOString().split('T')[0];

  // Build color tokens
  const colorTokens: Record<string, DesignToken> = {};

  colors.forEach(color => {
    // Convert label to camelCase for token names
    const tokenName = color.label
      .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/^(.)/, char => char.toLowerCase())
      .replace(/[^a-zA-Z0-9]/g, '');

    colorTokens[tokenName] = {
      $value: `#${color.hex}`,
      $type: 'color',
      $description: `${color.label} (${color.role})`,
    };
  });

  // Build complete token structure
  const tokens = {
    $metadata: {
      generated: date,
      wcagLevel: targetLevel,
      accessibilitySummary: `${summary.passing}/${summary.total} pairs pass WCAG ${targetLevel} (${summary.percentage}%)`,
    },
    color: colorTokens,
  };

  return JSON.stringify(tokens, null, 2);
}
