/**
 * Color Utility Functions
 *
 * Utilities for validating, normalizing, and formatting hex color values.
 * Supports 3-digit and 6-digit hex codes, with or without # prefix.
 */

/**
 * Validates if a string is a valid hex color
 *
 * Accepts:
 * - 3-digit hex: "abc", "#abc"
 * - 6-digit hex: "abc123", "#abc123"
 *
 * @param value - The hex color string to validate
 * @returns True if valid hex color, false otherwise
 *
 * @example
 * isValidHex("#FF0000") // true
 * isValidHex("f00")     // true
 * isValidHex("gggggg")  // false
 */
export function isValidHex(value: string): boolean {
  const hexPattern = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexPattern.test(value);
}

/**
 * Normalizes a hex color to 6-digit uppercase without # prefix
 *
 * Converts:
 * - "abc" → "AABBCC"
 * - "#abc123" → "ABC123"
 * - "f00" → "FF0000"
 *
 * @param value - The hex color string to normalize
 * @returns Normalized 6-digit uppercase hex without #, or null if invalid
 *
 * @example
 * normalizeHex("#abc")    // "AABBCC"
 * normalizeHex("f00")     // "FF0000"
 * normalizeHex("invalid") // null
 */
export function normalizeHex(value: string): string | null {
  if (!isValidHex(value)) {
    return null;
  }

  // Remove # if present
  const hex = value.startsWith('#') ? value.slice(1) : value;

  // Expand 3-digit to 6-digit (e.g., "abc" → "aabbcc")
  if (hex.length === 3) {
    return hex
      .split('')
      .map(char => char + char)
      .join('')
      .toUpperCase();
  }

  // Already 6-digit, just uppercase
  return hex.toUpperCase();
}

/**
 * Formats a hex color for display with # prefix
 *
 * @param value - The hex color string (6-digit without #)
 * @returns Formatted hex with # prefix
 *
 * @example
 * formatHexForDisplay("FF0000") // "#FF0000"
 * formatHexForDisplay("abc123") // "#ABC123"
 */
export function formatHexForDisplay(value: string): string {
  const normalized = value.toUpperCase();
  return normalized.startsWith('#') ? normalized : `#${normalized}`;
}

/**
 * Parses and validates hex input, returning normalized value or null
 *
 * This is a convenience function that combines validation and normalization.
 * Use this when you want to validate user input and get a normalized value
 * in one step.
 *
 * @param value - The hex color string to parse
 * @returns Normalized 6-digit uppercase hex without #, or null if invalid
 *
 * @example
 * parseHexInput("#abc")     // "AABBCC"
 * parseHexInput("FF0000")   // "FF0000"
 * parseHexInput("invalid")  // null
 */
export function parseHexInput(value: string): string | null {
  return normalizeHex(value);
}
