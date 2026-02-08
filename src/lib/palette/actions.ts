/**
 * Palette Action Creators
 *
 * Helper functions to create type-safe palette actions.
 * These make it easier to dispatch actions without having to manually
 * construct action objects.
 */

import type { PaletteAction, ColorEntry } from '@/types';

/**
 * Add a new color to the palette
 */
export function addColor(color: ColorEntry): PaletteAction {
  return {
    type: 'ADD_COLOR',
    payload: color,
  };
}

/**
 * Remove a color from the palette by ID
 */
export function removeColor(id: string): PaletteAction {
  return {
    type: 'REMOVE_COLOR',
    payload: { id },
  };
}

/**
 * Update a color's properties
 */
export function updateColor(
  id: string,
  updates: Partial<Omit<ColorEntry, 'id'>>
): PaletteAction {
  return {
    type: 'UPDATE_COLOR',
    payload: { id, updates },
  };
}

/**
 * Set the contrast calculation standard (WCAG2 or APCA)
 */
export function setContrastStandard(
  standard: 'WCAG2' | 'APCA'
): PaletteAction {
  return {
    type: 'SET_CONTRAST_STANDARD',
    payload: standard,
  };
}

/**
 * Set the WCAG target level (AA or AAA)
 */
export function setTargetLevel(level: 'AA' | 'AAA'): PaletteAction {
  return {
    type: 'SET_TARGET_LEVEL',
    payload: level,
  };
}

/**
 * Set the palette mode (light, dark, or both)
 */
export function setMode(mode: 'light' | 'dark' | 'both'): PaletteAction {
  return {
    type: 'SET_MODE',
    payload: mode,
  };
}

/**
 * Reset the palette to default state
 */
export function resetPalette(): PaletteAction {
  return {
    type: 'RESET_PALETTE',
  };
}
