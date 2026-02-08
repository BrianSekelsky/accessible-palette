/**
 * CSS Custom Properties Exporter
 *
 * Generates CSS custom properties (CSS variables) from the palette.
 */

import type { ColorEntry } from '@/types';

/**
 * Exports palette as CSS custom properties
 *
 * Generates a CSS file with custom properties in :root selector.
 * Includes a header comment with metadata and accessibility summary.
 *
 * @param colors - Array of color entries
 * @param summary - Contrast summary (passing, total, percentage)
 * @param targetLevel - Target WCAG level
 * @returns CSS file content as string
 *
 * @example
 * ```css
 * :root {
 *   --color-primary: #2563EB;
 *   --color-background: #FFFFFF;
 * }
 * ```
 */
export function exportToCSS(
  colors: ColorEntry[],
  summary: { passing: number; total: number; percentage: number },
  targetLevel: 'AA' | 'AAA'
): string {
  const date = new Date().toISOString().split('T')[0];

  // Header comment
  const header = `/*
 * Accessible Color Palette
 * Generated on ${date}
 *
 * Accessibility Summary:
 * - ${summary.passing} of ${summary.total} color pairs pass WCAG ${targetLevel} (${summary.percentage}%)
 * - Target: WCAG 2.2 ${targetLevel} (${targetLevel === 'AA' ? '4.5:1' : '7:1'} for normal text)
 *
 * Colors:
${colors.map(c => ` * - ${c.label}: #${c.hex} (${c.role})`).join('\n')}
 */\n\n`;

  // CSS custom properties
  const cssVars = `:root {\n${colors
    .map(color => {
      // Convert label to kebab-case for CSS variable names
      const varName = color.label
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      return `  --color-${varName}: #${color.hex};`;
    })
    .join('\n')}\n}\n`;

  return header + cssVars;
}
