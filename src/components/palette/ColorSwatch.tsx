/**
 * ColorSwatch Component
 *
 * Visual color preview with accessible name.
 * Displays a color square with proper accessibility attributes.
 * Will be reused in contrast matrix in later steps.
 */

import React from 'react';

export interface ColorSwatchProps {
  /** 6-digit hex color without # */
  hex: string;
  /** Color name for accessible label */
  label: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Visual color swatch component
 *
 * @example
 * ```tsx
 * <ColorSwatch hex="FF0000" label="Primary Red" size="md" />
 * ```
 */
export function ColorSwatch({
  hex,
  label,
  size = 'md',
  className = '',
}: ColorSwatchProps) {
  // Size styles - ensuring minimum 44×44px touch target
  const sizeStyles = {
    sm: 'w-10 h-10',  // 40px - slightly below minimum for compact contexts
    md: 'w-12 h-12',  // 48px - exceeds 44px minimum
    lg: 'w-16 h-16',  // 64px - large variant
  };

  const classes = `${sizeStyles[size]} rounded border border-gray-300 dark:border-gray-600 ${className}`;

  // Format hex for display and background color
  const backgroundColor = `#${hex}`;

  // Create accessible label with color name and hex value
  const ariaLabel = `${label}, color ${backgroundColor}`;

  return (
    <div
      className={classes}
      style={{ backgroundColor }}
      aria-label={ariaLabel}
      role="img"
    />
  );
}
