/**
 * Type Definitions for Accessible Color Palette Generator
 *
 * Core types for the palette state, color entries, and contrast calculations.
 */

/**
 * Color Role
 * Semantic role that describes how a color is intended to be used
 */
export type ColorRole =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'background'
  | 'surface'
  | 'text-primary'
  | 'text-secondary'
  | 'error'
  | 'warning'
  | 'success'
  | 'info'
  | 'border'
  | 'custom';

/**
 * Color Entry
 * Represents a single color in the palette
 */
export interface ColorEntry {
  /** Unique identifier for this color */
  id: string;
  /** Hex color value (6-digit, no #) */
  hex: string;
  /** User-assigned label/name for the color */
  label: string;
  /** Semantic role of the color */
  role: ColorRole;
  /** If true, this color won't receive auto-fix suggestions */
  locked: boolean;
}

/**
 * Palette State
 * The complete state of the palette tool
 */
export interface PaletteState {
  /** Array of colors in the palette (3-12 colors) */
  colors: ColorEntry[];
  /** Which contrast algorithm to use */
  contrastStandard: 'WCAG2' | 'APCA';
  /** WCAG target level (only applies to WCAG2) */
  targetLevel: 'AA' | 'AAA';
  /** Which color mode(s) to generate for */
  mode: 'light' | 'dark' | 'both';
}

/**
 * Contrast Result
 * Results of contrast calculation between two colors
 */
export interface ContrastResult {
  /** ID of the foreground color */
  foregroundId: string;
  /** ID of the background color */
  backgroundId: string;
  /** WCAG 2.x contrast ratio (1-21) */
  ratio: number;
  /** APCA Lc value (-108 to 106), null if not calculated */
  apcaValue: number | null;
  /** Passes WCAG AA for normal text (4.5:1) */
  passesAA: boolean;
  /** Passes WCAG AAA for normal text (7:1) */
  passesAAA: boolean;
  /** Passes WCAG AA for large text (3:1) */
  passesAALarge: boolean;
  /** Passes WCAG requirement for UI components (3:1) */
  passesUIComponent: boolean;
  /** Suggested hex value for foreground that would pass, or null */
  suggestedFix: string | null;
}

/**
 * Palette Actions
 * All possible actions that can modify the palette state
 */
export type PaletteAction =
  | { type: 'ADD_COLOR'; payload: ColorEntry }
  | { type: 'REMOVE_COLOR'; payload: { id: string } }
  | { type: 'UPDATE_COLOR'; payload: { id: string; updates: Partial<Omit<ColorEntry, 'id'>> } }
  | { type: 'SET_CONTRAST_STANDARD'; payload: 'WCAG2' | 'APCA' }
  | { type: 'SET_TARGET_LEVEL'; payload: 'AA' | 'AAA' }
  | { type: 'SET_MODE'; payload: 'light' | 'dark' | 'both' }
  | { type: 'RESET_PALETTE' }
  | { type: 'REPLACE_COLORS'; payload: ColorEntry[] };
