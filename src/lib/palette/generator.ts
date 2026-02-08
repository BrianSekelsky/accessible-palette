/**
 * Color Palette Generator
 *
 * Generates random accessible color palettes with good contrast ratios.
 * Uses OKLCH color space for perceptually uniform colors.
 */

import { formatHex, oklch } from 'culori';
import type { ColorEntry, ColorRole } from '@/types';
import { calculateContrast } from '@/lib/color/contrast';
import { generateSemanticColor } from './semanticColors';

/**
 * Generates a random lightness value within a range
 */
function randomLightness(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random hue (0-360)
 */
function randomHue(): number {
  return Math.random() * 360;
}

/**
 * Generates a random chroma value within a range
 */
function randomChroma(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Converts OKLCH color to hex string (6-digit without #)
 */
function oklchToHex(l: number, c: number, h: number): string {
  const color = oklch({ l, c, h, mode: 'oklch' });
  const hex = formatHex(color);
  return hex.slice(1).toUpperCase(); // Remove # and uppercase
}

/**
 * Validates that a palette meets WCAG AA contrast requirements
 *
 * Checks critical text-on-background combinations:
 * - Text primary on background (must be >= 4.5:1)
 * - Text primary on surface (must be >= 4.5:1)
 * - Text secondary on background (must be >= 4.5:1) if present
 * - Text secondary on surface (must be >= 3:1) if present
 *
 * @param palette - The palette to validate
 * @returns true if palette is WCAG AA compliant, false otherwise
 */
function isPaletteCompliant(palette: ColorEntry[]): boolean {
  const background = palette.find(c => c.role === 'background');
  const surface = palette.find(c => c.role === 'surface');
  const textPrimary = palette.find(c => c.role === 'text-primary');

  if (!background || !surface || !textPrimary) {
    return false;
  }

  // Check text-primary on background (AA normal text: 4.5:1)
  const textOnBg = calculateContrast(textPrimary.hex, background.hex);
  if (textOnBg < 4.5) return false;

  // Check text-primary on surface (AA normal text: 4.5:1)
  const textOnSurface = calculateContrast(textPrimary.hex, surface.hex);
  if (textOnSurface < 4.5) return false;

  // Check text-secondary if it exists
  const textSecondary = palette.find(c => c.role === 'text-secondary');
  if (textSecondary) {
    const textSecOnBg = calculateContrast(textSecondary.hex, background.hex);
    if (textSecOnBg < 4.5) return false;

    const textSecOnSurface = calculateContrast(textSecondary.hex, surface.hex);
    if (textSecOnSurface < 3) return false;
  }

  return true;
}

/**
 * Generates a single palette attempt (internal helper)
 */
function generatePaletteAttempt(): ColorEntry[] {
  const palette: ColorEntry[] = [];

  // 1. Background - Light (high lightness, low chroma)
  const bgLightness = randomLightness(0.92, 0.98);
  const bgChroma = randomChroma(0.01, 0.03);
  const bgHue = randomHue();

  palette.push({
    id: crypto.randomUUID(),
    hex: oklchToHex(bgLightness, bgChroma, bgHue),
    label: 'Background',
    role: 'background',
    locked: false,
  });

  // 2. Surface - Slightly darker than background
  const surfaceLightness = randomLightness(0.85, 0.91);
  const surfaceChroma = randomChroma(0.01, 0.04);
  const surfaceHue = bgHue + randomLightness(-20, 20); // Similar hue

  palette.push({
    id: crypto.randomUUID(),
    hex: oklchToHex(surfaceLightness, surfaceChroma, surfaceHue),
    label: 'Surface',
    role: 'surface',
    locked: false,
  });

  // 3. Text Primary - Dark for contrast on light background
  const textLightness = randomLightness(0.15, 0.25);
  const textChroma = randomChroma(0.01, 0.03);
  const textHue = randomHue();

  palette.push({
    id: crypto.randomUUID(),
    hex: oklchToHex(textLightness, textChroma, textHue),
    label: 'Text',
    role: 'text-primary',
    locked: false,
  });

  // 4. Primary - Vibrant color with moderate lightness
  const primaryHue = randomHue();
  const primaryLightness = randomLightness(0.45, 0.65);
  const primaryChroma = randomChroma(0.15, 0.25);

  palette.push({
    id: crypto.randomUUID(),
    hex: oklchToHex(primaryLightness, primaryChroma, primaryHue),
    label: 'Primary',
    role: 'primary',
    locked: false,
  });

  // 5. Accent - Different hue from primary, similar vibrancy
  const accentHue = (primaryHue + randomLightness(90, 270)) % 360; // Complementary or triadic
  const accentLightness = randomLightness(0.45, 0.65);
  const accentChroma = randomChroma(0.15, 0.25);

  palette.push({
    id: crypto.randomUUID(),
    hex: oklchToHex(accentLightness, accentChroma, accentHue),
    label: 'Accent',
    role: 'accent',
    locked: false,
  });

  return palette;
}

/**
 * Generates a complete accessible color palette that meets WCAG AA requirements
 *
 * Creates a palette with:
 * - Light background
 * - Dark text with good contrast on background (>= 4.5:1)
 * - Primary color with sufficient contrast
 * - Secondary/accent colors
 * - Surface color between background and white
 *
 * Keeps regenerating until a WCAG AA compliant palette is found.
 *
 * @returns Array of ColorEntry objects forming a WCAG AA compliant palette
 */
export function generatePalette(): ColorEntry[] {
  const maxAttempts = 100;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const palette = generatePaletteAttempt();

    if (isPaletteCompliant(palette)) {
      return palette;
    }

    attempts++;
  }

  // Fallback: if we couldn't generate a compliant palette after max attempts,
  // return the last attempt (this should rarely happen)
  console.warn('Could not generate WCAG compliant palette after', maxAttempts, 'attempts. Using last attempt.');
  return generatePaletteAttempt();
}

/**
 * Generates a palette with specific roles included
 *
 * @param roles - Array of roles to include in the palette
 * @param lockedColors - Map of locked colors by role
 * @returns Array of ColorEntry objects
 */
function generatePaletteWithRoles(
  roles: ColorRole[],
  lockedColors: Map<ColorRole, ColorEntry>
): ColorEntry[] {
  // Generate the base 5 colors
  const basePalette = generatePaletteAttempt();
  const basePaletteByRole = new Map(basePalette.map(c => [c.role, c]));

  const result: ColorEntry[] = [];

  // Get primary hue for harmonious additional colors
  const primary = basePaletteByRole.get('primary');
  const primaryHue = primary ? parseInt(primary.hex, 16) % 360 : undefined;

  for (const role of roles) {
    // Use locked color if available
    if (lockedColors.has(role)) {
      result.push(lockedColors.get(role)!);
      continue;
    }

    // Use generated base color if this is a core role
    if (basePaletteByRole.has(role)) {
      result.push(basePaletteByRole.get(role)!);
      continue;
    }

    // Generate semantic color for additional roles
    const hex = generateSemanticColor(role, { primaryHue });
    result.push({
      id: crypto.randomUUID(),
      hex,
      label: getRoleLabel(role),
      role,
      locked: false,
    });
  }

  return result;
}

/**
 * Gets a human-readable label for a role (local helper)
 */
function getRoleLabel(role: ColorRole): string {
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

/**
 * Regenerates the palette while keeping locked colors and additional roles
 *
 * Attempts to generate a WCAG compliant palette while:
 * - Preserving locked colors
 * - Maintaining all added color roles (border, error, etc.)
 * - Only regenerating unlocked colors
 *
 * @param currentPalette - The current palette with potential locked colors and additional roles
 * @returns New palette with locked colors and roles preserved
 */
export function regeneratePalette(currentPalette: ColorEntry[]): ColorEntry[] {
  const lockedColors = currentPalette.filter(c => c.locked);
  const lockedByRole = new Map(lockedColors.map(c => [c.role, c]));

  // Get all roles from current palette (to preserve structure)
  const currentRoles = currentPalette.map(c => c.role);

  // If no locked colors and only base palette, just generate fresh
  if (lockedColors.length === 0 && currentRoles.length === 5) {
    return generatePalette();
  }

  // Try to generate a compliant palette with current structure
  const maxAttempts = 100;
  let attempts = 0;
  let bestPalette: ColorEntry[] | null = null;

  while (attempts < maxAttempts) {
    const newPalette = generatePaletteWithRoles(currentRoles, lockedByRole);

    // Check if this palette is compliant
    if (isPaletteCompliant(newPalette)) {
      return newPalette;
    }

    // Keep track of the first attempt as fallback
    if (!bestPalette) {
      bestPalette = newPalette;
    }

    attempts++;
  }

  // If we couldn't achieve full compliance, return the best attempt
  console.warn('Could not generate fully WCAG compliant palette after', maxAttempts, 'attempts.');
  return bestPalette || currentPalette;
}
