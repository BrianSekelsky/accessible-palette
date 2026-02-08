/**
 * Color Blindness Simulation
 *
 * Simulates how colors appear to people with various types of color vision deficiency.
 * Uses transformation matrices based on research by Brettel, Viénot and Mollon (1997)
 * and Viénot, Brettel and Mollon (1999).
 */

export type ColorBlindnessType =
  | 'none'
  | 'protanopia'    // red-blind
  | 'deuteranopia'  // green-blind
  | 'tritanopia'    // blue-blind
  | 'achromatopsia'; // complete color blindness

/**
 * Converts hex color to RGB values (0-1 range)
 */
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return [r, g, b];
}

/**
 * Converts RGB values (0-1 range) to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n * 255)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Applies a transformation matrix to RGB values
 */
function applyMatrix(
  r: number,
  g: number,
  b: number,
  matrix: number[][]
): [number, number, number] {
  const newR = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const newG = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const newB = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;
  return [newR, newG, newB];
}

/**
 * Transformation matrices for different types of color blindness
 * Based on established color blindness simulation algorithms
 */
const matrices = {
  // Protanopia (red-blind) - missing L cones
  protanopia: [
    [0.56667, 0.43333, 0.00000],
    [0.55833, 0.44167, 0.00000],
    [0.00000, 0.24167, 0.75833]
  ],

  // Deuteranopia (green-blind) - missing M cones
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.70, 0.30, 0.0],
    [0.0, 0.30, 0.70]
  ],

  // Tritanopia (blue-blind) - missing S cones
  tritanopia: [
    [0.95, 0.05, 0.0],
    [0.0, 0.43333, 0.56667],
    [0.0, 0.475, 0.525]
  ]
};

/**
 * Simulates how a color appears with a specific type of color blindness
 *
 * @param hex - Hex color code (with or without #)
 * @param type - Type of color blindness to simulate
 * @returns Simulated hex color code (without #)
 */
export function simulateColorBlindness(hex: string, type: ColorBlindnessType): string {
  // No simulation needed
  if (type === 'none') {
    return hex.replace('#', '').toUpperCase();
  }

  // Convert to RGB
  const [r, g, b] = hexToRgb(hex);

  // Achromatopsia (complete color blindness) - convert to grayscale
  if (type === 'achromatopsia') {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    return rgbToHex(gray, gray, gray);
  }

  // Apply transformation matrix for other types
  const matrix = matrices[type];
  if (!matrix) {
    return hex.replace('#', '').toUpperCase();
  }

  const [newR, newG, newB] = applyMatrix(r, g, b, matrix);
  return rgbToHex(newR, newG, newB);
}

/**
 * Gets a human-readable label for a color blindness type
 */
export function getColorBlindnessLabel(type: ColorBlindnessType): string {
  switch (type) {
    case 'none':
      return 'Normal Vision';
    case 'protanopia':
      return 'Protanopia (Red-Blind)';
    case 'deuteranopia':
      return 'Deuteranopia (Green-Blind)';
    case 'tritanopia':
      return 'Tritanopia (Blue-Blind)';
    case 'achromatopsia':
      return 'Achromatopsia (Complete Color Blindness)';
  }
}

/**
 * Gets all available color blindness types with labels
 */
export function getColorBlindnessTypes(): Array<{ value: ColorBlindnessType; label: string }> {
  return [
    { value: 'none', label: getColorBlindnessLabel('none') },
    { value: 'protanopia', label: getColorBlindnessLabel('protanopia') },
    { value: 'deuteranopia', label: getColorBlindnessLabel('deuteranopia') },
    { value: 'tritanopia', label: getColorBlindnessLabel('tritanopia') },
    { value: 'achromatopsia', label: getColorBlindnessLabel('achromatopsia') },
  ];
}
