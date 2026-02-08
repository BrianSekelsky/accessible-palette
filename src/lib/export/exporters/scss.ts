/**
 * SCSS Variables Exporter
 *
 * Generates SCSS/Sass variables from the palette.
 */

import type { ColorEntry } from '@/types';

/**
 * Exports palette as SCSS variables
 *
 * Generates an SCSS file with Sass variables.
 * Includes a header comment with metadata and accessibility summary.
 *
 * @param colors - Array of color entries
 * @param summary - Contrast summary
 * @param targetLevel - Target WCAG level
 * @returns SCSS file content as string
 *
 * @example
 * ```scss
 * $color-primary: #2563EB;
 * $color-background: #FFFFFF;
 * ```
 */
export function exportToSCSS(
  colors: ColorEntry[],
  summary: { passing: number; total: number; percentage: number },
  targetLevel: 'AA' | 'AAA'
): string {
  const date = new Date().toISOString().split('T')[0];

  // Header comment
  const header = `//
// Accessible Color Palette
// Generated on ${date}
//
// Accessibility Summary:
// - ${summary.passing} of ${summary.total} color pairs pass WCAG ${targetLevel} (${summary.percentage}%)
// - Target: WCAG 2.2 ${targetLevel} (${targetLevel === 'AA' ? '4.5:1' : '7:1'} for normal text)
//
// Colors:
${colors.map(c => `// - ${c.label}: #${c.hex} (${c.role})`).join('\n')}
//\n\n`;

  // SCSS variables
  const scssVars = colors
    .map(color => {
      // Convert label to kebab-case for SCSS variable names
      const varName = color.label
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      return `$color-${varName}: #${color.hex};`;
    })
    .join('\n');

  return header + scssVars + '\n';
}
