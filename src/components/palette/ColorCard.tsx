'use client';

/**
 * Color Card Component
 *
 * Displays a color with a visual representation based on its role.
 * Shows different icons/previews for text, background, buttons, etc.
 */

import React from 'react';
import type { ColorEntry, ColorRole } from '@/types';

export interface ColorCardProps {
  color: ColorEntry;
  onUpdate: (id: string, updates: Partial<Omit<ColorEntry, 'id'>>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

/**
 * Get visual representation component based on color role
 */
function getColorPreview(role: ColorRole, hex: string): React.ReactNode {
  const color = `#${hex}`;

  switch (role) {
    case 'text-primary':
    case 'text-secondary':
      // Large serif T for text colors
      return (
        <div
          className="text-8xl font-serif font-bold flex items-center justify-center h-full"
          style={{ color }}
          aria-hidden="true"
        >
          T
        </div>
      );

    case 'background':
      // Large square for background
      return (
        <div
          className="w-full h-full rounded-lg border-4 border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      );

    case 'surface':
      // Layered rectangles for surface
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            className="absolute inset-2 rounded-lg border-2 border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-4 rounded-lg border-2 border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: color, opacity: 0.7 }}
            aria-hidden="true"
          />
        </div>
      );

    case 'primary':
    case 'secondary':
    case 'accent':
      // Button-like shape for action colors
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div
            className="rounded-lg px-8 py-4 font-bold text-white text-center shadow-lg"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          >
            Button
          </div>
        </div>
      );

    case 'error':
      // X symbol for error
      return (
        <div
          className="text-8xl font-bold flex items-center justify-center h-full"
          style={{ color }}
          aria-hidden="true"
        >
          ✗
        </div>
      );

    case 'warning':
      // Warning triangle
      return (
        <div
          className="text-8xl font-bold flex items-center justify-center h-full"
          style={{ color }}
          aria-hidden="true"
        >
          ⚠
        </div>
      );

    case 'success':
      // Check mark for success
      return (
        <div
          className="text-8xl font-bold flex items-center justify-center h-full"
          style={{ color }}
          aria-hidden="true"
        >
          ✓
        </div>
      );

    case 'info':
      // Info symbol
      return (
        <div
          className="text-8xl font-bold flex items-center justify-center h-full"
          style={{ color }}
          aria-hidden="true"
        >
          i
        </div>
      );

    case 'custom':
    default:
      // Generic color swatch
      return (
        <div
          className="w-full h-full rounded-lg border-4 border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      );
  }
}

/**
 * Color card component
 *
 * Displays a color with visual preview, name, hex value, and controls.
 */
export function ColorCard({ color, onUpdate, onRemove, canRemove }: ColorCardProps) {
  const handleLockToggle = () => {
    onUpdate(color.id, { locked: !color.locked });
  };

  const handleRemove = () => {
    if (canRemove) {
      onRemove(color.id);
    }
  };

  return (
    <div
      className="group relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg"
      role="article"
      aria-label={`${color.label} color: #${color.hex}`}
    >
      {/* Visual Preview */}
      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        {getColorPreview(color.role, color.hex)}
      </div>

      {/* Color Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{color.label}</h3>
        <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
          #{color.hex}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">
          {color.role.replace('-', ' ')}
        </p>
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleLockToggle}
          className="flex-1 px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={color.locked ? `Unlock ${color.label}` : `Lock ${color.label}`}
          title={color.locked ? 'Unlock color' : 'Lock color'}
        >
          {color.locked ? '🔒 Locked' : '🔓 Lock'}
        </button>

        {canRemove && (
          <button
            onClick={handleRemove}
            className="px-3 py-2 text-sm rounded border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label={`Remove ${color.label}`}
            title="Remove color"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
