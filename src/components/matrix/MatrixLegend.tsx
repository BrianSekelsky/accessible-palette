/**
 * MatrixLegend Component
 *
 * Explains how to read the contrast matrix and WCAG requirements.
 */

import React from 'react';
import { Badge } from '@/components/ui/Badge';

export function MatrixLegend() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
        How to Read This Matrix
      </h3>

      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        {/* Matrix structure */}
        <p>
          <strong>Rows</strong> represent text (foreground) colors.{' '}
          <strong>Columns</strong> represent background colors.{' '}
          Each cell shows the contrast ratio for that combination.
        </p>

        {/* WCAG Requirements */}
        <div>
          <p className="font-semibold mb-1">WCAG 2.2 Contrast Requirements:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <Badge level="AA" passes={true} className="mr-1" />
              Normal text: 4.5:1 or higher
            </li>
            <li>
              <Badge level="AAA" passes={true} className="mr-1" />
              Normal text: 7:1 or higher
            </li>
            <li>
              <Badge level="AA Large" passes={true} className="mr-1" />
              Large text (18pt+ or 14pt+ bold): 3:1 or higher
            </li>
          </ul>
        </div>

        {/* Badge meanings */}
        <div>
          <p className="font-semibold mb-1">Badge Meanings:</p>
          <div className="flex flex-wrap gap-2">
            <Badge level="AA" passes={true} />
            <span className="self-center">Passes WCAG AA</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge level="AA" passes={false} />
            <span className="self-center">Fails WCAG AA</span>
          </div>
        </div>

        {/* N/A cells */}
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Diagonal cells (N/A) show the same color on itself and are not applicable for contrast checking.
        </p>
      </div>
    </div>
  );
}
