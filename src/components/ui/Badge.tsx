/**
 * Badge Component
 *
 * Displays pass/fail status for WCAG compliance.
 * Used in contrast matrix to show AA/AAA pass/fail status.
 */

import React from 'react';

export interface BadgeProps {
  /** The WCAG level (AA or AAA) */
  level: 'AA' | 'AAA' | 'AA Large' | 'UI';
  /** Whether this level passes */
  passes: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Badge component for pass/fail indicators
 *
 * @example
 * ```tsx
 * <Badge level="AA" passes={true} />  // Shows: ✓ AA
 * <Badge level="AAA" passes={false} /> // Shows: ✗ AAA
 * ```
 */
export function Badge({ level, passes, className = '' }: BadgeProps) {
  // Base styles
  const baseStyles =
    'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded';

  // Color styles based on pass/fail
  const colorStyles = passes
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';

  const classes = `${baseStyles} ${colorStyles} ${className}`;

  // Icon based on pass/fail
  const icon = passes ? '✓' : '✗';

  // Screen reader text
  const srText = passes ? 'Passes' : 'Fails';

  return (
    <span className={classes} role="status">
      <span aria-hidden="true">{icon}</span>
      <span className="visually-hidden">{srText}</span>
      <span>{level}</span>
    </span>
  );
}
