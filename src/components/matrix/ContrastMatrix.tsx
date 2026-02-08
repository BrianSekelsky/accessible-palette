'use client';

/**
 * ContrastMatrix Component
 *
 * The main N×N contrast matrix table showing all color combinations.
 * This is the heart of the accessibility checker.
 */

import React from 'react';
import { usePalette } from '@/hooks/usePalette';
import { useContrastMatrix } from '@/hooks/useContrastMatrix';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { updateColor } from '@/lib/palette/actions';
import { MatrixCell } from './MatrixCell';
import { MatrixLegend } from './MatrixLegend';
import { ColorSwatch } from '@/components/palette/ColorSwatch';

/**
 * Contrast matrix component
 *
 * Displays an N×N table where:
 * - Rows = foreground (text) colors
 * - Columns = background colors
 * - Each cell shows contrast ratio and pass/fail status
 */
export function ContrastMatrix() {
  const { state, dispatch } = usePalette();
  const { getResult, summary } = useContrastMatrix();
  const { announce } = useAnnouncements();

  // Handle applying a suggested fix
  const handleApplyFix = (colorId: string, newHex: string) => {
    const color = state.colors.find(c => c.id === colorId);
    dispatch(updateColor(colorId, { hex: newHex }));

    if (color) {
      announce(
        `Auto-fix applied: ${color.label} changed to #${newHex} to meet WCAG ${state.targetLevel} requirements. Contrast matrix updated.`
      );
    }
  };

  return (
    <section aria-labelledby="contrast-matrix-heading">
      {/* Heading and Summary */}
      <div className="mb-4">
        <h2 id="contrast-matrix-heading" className="text-xl font-semibold mb-2">
          Contrast Matrix
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>{summary.passing}</strong> of <strong>{summary.total}</strong> color
          pairs pass WCAG {state.targetLevel} ({summary.percentage}%)
        </p>
      </div>

      {/* Legend */}
      <div className="mb-6">
        <MatrixLegend />
      </div>

      {/* Matrix Table - Scrollable container for many colors */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full border-collapse">
          {/* Table Header */}
          <thead>
            <tr>
              {/* Top-left corner cell */}
              <th
                scope="col"
                className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-2 min-w-[120px]"
              >
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Text on →<br />Background ↓
                </span>
              </th>

              {/* Column headers - Background colors */}
              {state.colors.map((bgColor) => (
                <th
                  key={`bg-${bgColor.id}`}
                  scope="col"
                  className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-2 min-w-[140px]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ColorSwatch hex={bgColor.hex} label={bgColor.label} size="sm" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">
                      {bgColor.label}
                    </span>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      #{bgColor.hex}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {state.colors.map((fgColor) => (
              <tr key={`row-${fgColor.id}`}>
                {/* Row header - Foreground color */}
                <th
                  scope="row"
                  className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-2"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ColorSwatch hex={fgColor.hex} label={fgColor.label} size="sm" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">
                      {fgColor.label}
                    </span>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      #{fgColor.hex}
                    </span>
                  </div>
                </th>

                {/* Data cells - Contrast results */}
                {state.colors.map((bgColor) => {
                  const result = getResult(fgColor.id, bgColor.id);

                  if (!result) {
                    // Shouldn't happen, but handle gracefully
                    return (
                      <td
                        key={`cell-${fgColor.id}-${bgColor.id}`}
                        className="border border-gray-300 dark:border-gray-600 p-2"
                      >
                        <span className="text-xs text-gray-500">Error</span>
                      </td>
                    );
                  }

                  return (
                    <MatrixCell
                      key={`cell-${fgColor.id}-${bgColor.id}`}
                      result={result}
                      foregroundColor={fgColor}
                      backgroundColor={bgColor}
                      targetLevel={state.targetLevel}
                      onApplyFix={handleApplyFix}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Info */}
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Contrast ratios calculated using WCAG 2.2 relative luminance formula.
        Higher ratios indicate better contrast and improved readability.
      </p>
    </section>
  );
}
