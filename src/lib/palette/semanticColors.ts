/**
 * Semantic Color Generation
 *
 * Generates colors that make semantic sense for their role
 * (e.g., error = red, warning = orange, success = green)
 */

import { formatHex, oklch } from 'culori';
import type { ColorRole } from '@/types';

/**
 * Generates a random value within a range
 */
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Converts OKLCH to hex
 */
function oklchToHex(l: number, c: number, h: number): string {
  const color = oklch({ l, c, h, mode: 'oklch' });
  const hex = formatHex(color);
  return hex.slice(1).toUpperCase();
}

/**
 * Generates a semantically appropriate color for a given role
 *
 * @param role - The color role
 * @param paletteContext - Optional context from existing palette (for harmony)
 * @returns Hex color code (without #)
 */
export function generateSemanticColor(
  role: ColorRole,
  paletteContext?: { primaryHue?: number; accentHue?: number }
): string {
  switch (role) {
    case 'error':
      // Red hues (0-20 or 340-360)
      const errorHue = Math.random() > 0.5
        ? randomInRange(0, 20)
        : randomInRange(340, 360);
      return oklchToHex(
        randomInRange(0.50, 0.60), // Medium lightness
        randomInRange(0.15, 0.22),  // Good saturation
        errorHue
      );

    case 'warning':
      // Orange/yellow hues (30-60)
      return oklchToHex(
        randomInRange(0.65, 0.75), // Lighter for visibility
        randomInRange(0.15, 0.20),
        randomInRange(30, 60)
      );

    case 'success':
      // Green hues (120-160)
      return oklchToHex(
        randomInRange(0.55, 0.65),
        randomInRange(0.12, 0.18),
        randomInRange(120, 160)
      );

    case 'info':
      // Blue hues (200-240)
      return oklchToHex(
        randomInRange(0.55, 0.65),
        randomInRange(0.12, 0.18),
        randomInRange(200, 240)
      );

    case 'border':
      // Neutral gray with very low chroma
      return oklchToHex(
        randomInRange(0.75, 0.85), // Light gray
        randomInRange(0.01, 0.03),  // Very low saturation
        randomInRange(0, 360)       // Any hue (won't be visible)
      );

    case 'text-secondary':
      // Medium gray
      return oklchToHex(
        randomInRange(0.45, 0.55),
        randomInRange(0.02, 0.05),
        randomInRange(0, 360)
      );

    case 'secondary':
      // Complementary or analogous to primary if available
      if (paletteContext?.primaryHue !== undefined) {
        const variation = Math.random() > 0.5 ? 30 : -30; // Analogous
        return oklchToHex(
          randomInRange(0.45, 0.65),
          randomInRange(0.12, 0.20),
          (paletteContext.primaryHue + variation + 360) % 360
        );
      }
      // Otherwise, random vibrant color
      return oklchToHex(
        randomInRange(0.45, 0.65),
        randomInRange(0.12, 0.20),
        randomInRange(0, 360)
      );

    case 'custom':
    default:
      // Random color harmonious with palette
      return oklchToHex(
        randomInRange(0.45, 0.70),
        randomInRange(0.10, 0.20),
        randomInRange(0, 360)
      );
  }
}

/**
 * Gets a human-readable label for a color role
 */
export function getRoleLabel(role: ColorRole): string {
  switch (role) {
    case 'background': return 'Background';
    case 'surface': return 'Surface';
    case 'text-primary': return 'Text';
    case 'text-secondary': return 'Text Secondary';
    case 'primary': return 'Primary';
    case 'secondary': return 'Secondary Action';
    case 'accent': return 'Accent';
    case 'success': return 'Success';
    case 'warning': return 'Warning';
    case 'error': return 'Error';
    case 'info': return 'Info';
    case 'border': return 'Border';
    case 'custom': return 'Custom';
  }
}
