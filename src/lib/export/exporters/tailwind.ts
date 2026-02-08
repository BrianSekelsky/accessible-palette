/**
 * Tailwind Config Exporter
 *
 * Generates Tailwind CSS configuration (partial) from the palette.
 */

import type { ColorEntry } from '@/types';

/**
 * Exports palette as Tailwind config (partial)
 *
 * Generates a JavaScript file with color extensions for Tailwind CSS.
 * This is a partial config that can be merged into an existing tailwind.config.js.
 *
 * @param colors - Array of color entries
 * @param summary - Contrast summary
 * @param targetLevel - Target WCAG level
 * @returns JavaScript config file content as string
 *
 * @example
 * ```js
 * module.exports = {
 *   theme: {
 *     extend: {
 *       colors: {
 *         primary: '#2563EB',
 *         background: '#FFFFFF',
 *       }
 *     }
 *   }
 * }
 * ```
 */
export function exportToTailwind(
  colors: ColorEntry[],
  summary: { passing: number; total: number; percentage: number },
  targetLevel: 'AA' | 'AAA'
): string {
  const date = new Date().toISOString().split('T')[0];

  // Header comment
  const header = `/**
 * Tailwind CSS Color Configuration
 * Generated on ${date}
 *
 * Accessibility Summary:
 * - ${summary.passing} of ${summary.total} color pairs pass WCAG ${targetLevel} (${summary.percentage}%)
 * - Target: WCAG 2.2 ${targetLevel}
 *
 * Usage:
 * Add these colors to your existing tailwind.config.js by merging
 * them into theme.extend.colors
 */\n\n`;

  // Build colors object
  const colorsObject = colors
    .map(color => {
      // Convert label to kebab-case for Tailwind color names
      const colorName = color.label
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      return `    '${colorName}': '#${color.hex}', // ${color.role}`;
    })
    .join('\n');

  // Tailwind config structure
  const config = `module.exports = {
  theme: {
    extend: {
      colors: {
${colorsObject}
      }
    }
  }
};\n`;

  return header + config;
}
