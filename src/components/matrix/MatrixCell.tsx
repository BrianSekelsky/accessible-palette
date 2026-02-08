/**
 * MatrixCell Component
 *
 * Individual cell in the contrast matrix showing:
 * - Contrast ratio
 * - Pass/fail status
 * - Visual preview of text on background
 */

import React from 'react';
import type { ContrastResult, ColorEntry } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface MatrixCellProps {
  /** The contrast result for this cell */
  result: ContrastResult;
  /** Foreground color entry (for label) */
  foregroundColor: ColorEntry;
  /** Background color entry (for label and styling) */
  backgroundColor: ColorEntry;
  /** Target level (AA or AAA) for primary badge display */
  targetLevel: 'AA' | 'AAA';
  /** Callback to apply suggested fix */
  onApplyFix?: (colorId: string, newHex: string) => void;
}

/**
 * Matrix cell component
 *
 * Shows contrast information for a foreground-background pair.
 * Handles both regular cells and diagonal cells (same color).
 */
export function MatrixCell({
  result,
  foregroundColor,
  backgroundColor,
  targetLevel,
  onApplyFix,
}: MatrixCellProps) {
  // Check if this is a diagonal cell (same color on itself)
  const isDiagonal = result.foregroundId === result.backgroundId;

  // Build accessible label for screen readers
  const buildAriaLabel = () => {
    if (isDiagonal) {
      return `${foregroundColor.label} on itself: not applicable`;
    }

    const passStatus = targetLevel === 'AA'
      ? (result.passesAA ? 'passes' : 'fails')
      : (result.passesAAA ? 'passes' : 'fails');

    return `${foregroundColor.label} on ${backgroundColor.label}: contrast ratio ${result.ratio}:1, ${passStatus} WCAG ${targetLevel}`;
  };

  // Diagonal cells show N/A
  if (isDiagonal) {
    return (
      <td
        className="border border-gray-300 dark:border-gray-600 p-2 text-center bg-gray-50 dark:bg-gray-800"
        aria-label={buildAriaLabel()}
      >
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          N/A
        </span>
      </td>
    );
  }

  // Regular cells show contrast info
  // Determine primary pass/fail status based on target level
  const primaryPasses = targetLevel === 'AA' ? result.passesAA : result.passesAAA;

  return (
    <td
      className="border border-gray-300 dark:border-gray-600 p-2"
      aria-label={buildAriaLabel()}
    >
      <div className="flex flex-col gap-2 items-center min-w-[120px]">
        {/* Text Preview - "Aa" in foreground on background */}
        <div
          className="w-full px-3 py-2 rounded text-center font-semibold text-lg border border-gray-200 dark:border-gray-700"
          style={{
            backgroundColor: `#${backgroundColor.hex}`,
            color: `#${foregroundColor.hex}`,
          }}
          aria-hidden="true"
        >
          Aa
        </div>

        {/* Contrast Ratio */}
        <div className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100">
          {result.ratio.toFixed(2)}:1
        </div>

        {/* Pass/Fail Badge */}
        <Badge level={targetLevel} passes={primaryPasses} />

        {/* Additional info for AAA if target is AA */}
        {targetLevel === 'AA' && result.passesAAA && (
          <Badge level="AAA" passes={true} />
        )}

        {/* Auto-fix suggestion */}
        {!primaryPasses && result.suggestedFix && !foregroundColor.locked && onApplyFix && (
          <div className="w-full mt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onApplyFix(foregroundColor.id, result.suggestedFix!)}
              className="w-full text-xs"
              title={`Fix ${foregroundColor.label} to #${result.suggestedFix} for accessibility`}
            >
              Fix →
            </Button>
          </div>
        )}

        {/* Locked color notice */}
        {!primaryPasses && foregroundColor.locked && (
          <div className="w-full mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              🔒 Locked
            </p>
          </div>
        )}
      </div>
    </td>
  );
}
