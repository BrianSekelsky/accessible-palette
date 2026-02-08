'use client';

/**
 * ExportPanel Component
 *
 * Provides export functionality for the color palette.
 * Allows users to download their palette in various formats.
 */

import React from 'react';
import { usePalette } from '@/hooks/usePalette';
import { useContrastMatrix } from '@/hooks/useContrastMatrix';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Button } from '@/components/ui/Button';
import { downloadFile } from '@/lib/export/download';
import { exportToCSS } from '@/lib/export/exporters/css';
import { exportToTokens } from '@/lib/export/exporters/tokens';
import { exportToTailwind } from '@/lib/export/exporters/tailwind';
import { exportToSCSS } from '@/lib/export/exporters/scss';

/**
 * Export format type
 */
type ExportFormat = 'css' | 'json' | 'tailwind' | 'scss';

/**
 * Export panel component
 */
export function ExportPanel() {
  const { state } = usePalette();
  const { summary } = useContrastMatrix();
  const { announce } = useAnnouncements();

  /**
   * Handles export in the specified format
   */
  const handleExport = (format: ExportFormat) => {
    let content: string;
    let filename: string;
    let mimeType: string;
    let formatName: string;

    switch (format) {
      case 'css':
        content = exportToCSS(state.colors, summary, state.targetLevel);
        filename = 'palette.css';
        mimeType = 'text/css';
        formatName = 'CSS Variables';
        break;

      case 'json':
        content = exportToTokens(state.colors, summary, state.targetLevel);
        filename = 'design-tokens.json';
        mimeType = 'application/json';
        formatName = 'Design Tokens JSON';
        break;

      case 'tailwind':
        content = exportToTailwind(state.colors, summary, state.targetLevel);
        filename = 'tailwind.config.js';
        mimeType = 'text/javascript';
        formatName = 'Tailwind Config';
        break;

      case 'scss':
        content = exportToSCSS(state.colors, summary, state.targetLevel);
        filename = 'palette.scss';
        mimeType = 'text/x-scss';
        formatName = 'SCSS Variables';
        break;
    }

    downloadFile(content, filename, mimeType);
    announce(`Palette exported as ${formatName}. File ${filename} downloaded.`);
  };

  return (
    <section aria-labelledby="export-heading" className="mt-12">
      <div className="mb-4">
        <h2 id="export-heading" className="text-xl font-semibold mb-2">
          Export Palette
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Download your accessible color palette in various formats for use in your projects.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CSS Custom Properties */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
              CSS Variables
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex-1">
              CSS custom properties for use in any project
            </p>
            <Button
              variant="primary"
              onClick={() => handleExport('css')}
              aria-label="Export as CSS custom properties"
            >
              Export CSS
            </Button>
          </div>

          {/* Design Tokens JSON */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Design Tokens
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex-1">
              W3C Design Tokens format (JSON)
            </p>
            <Button
              variant="primary"
              onClick={() => handleExport('json')}
              aria-label="Export as design tokens JSON"
            >
              Export JSON
            </Button>
          </div>

          {/* Tailwind Config */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Tailwind CSS
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex-1">
              Tailwind config extension (JavaScript)
            </p>
            <Button
              variant="primary"
              onClick={() => handleExport('tailwind')}
              aria-label="Export as Tailwind config"
            >
              Export Tailwind
            </Button>
          </div>

          {/* SCSS Variables */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
              SCSS Variables
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex-1">
              Sass/SCSS variables for stylesheet projects
            </p>
            <Button
              variant="primary"
              onClick={() => handleExport('scss')}
              aria-label="Export as SCSS variables"
            >
              Export SCSS
            </Button>
          </div>
        </div>

        {/* Export Info */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            All exports include accessibility metadata with your WCAG {state.targetLevel} compliance summary.
            <br />
            {summary.passing} of {summary.total} color pairs currently pass WCAG {state.targetLevel} ({summary.percentage}%).
          </p>
        </div>
      </div>
    </section>
  );
}
