'use client';

/**
 * Design Preview Component
 *
 * Shows a live preview of how the color palette looks in a generic app/website design.
 * Displays background, surfaces, text, buttons, and alert states.
 */

import React from 'react';
import { usePalette } from '@/hooks/usePalette';
import { useColorBlindness } from '@/contexts/ColorBlindnessContext';
import { simulateColorBlindness } from '@/lib/color/colorblind';
import type { ColorEntry } from '@/types';

/**
 * Helper to find a color by role in the palette
 */
function findColorByRole(colors: ColorEntry[], role: string): ColorEntry | undefined {
  return colors.find(c => c.role === role);
}

/**
 * Design preview component
 *
 * Renders a mock app interface using the current color palette.
 */
export function DesignPreview() {
  const { state } = usePalette();
  const { mode } = useColorBlindness();

  // Find colors by role
  const background = findColorByRole(state.colors, 'background');
  const surface = findColorByRole(state.colors, 'surface');
  const textPrimary = findColorByRole(state.colors, 'text-primary');
  const textSecondary = findColorByRole(state.colors, 'text-secondary');
  const primary = findColorByRole(state.colors, 'primary');
  const accent = findColorByRole(state.colors, 'accent');
  const success = findColorByRole(state.colors, 'success');
  const warning = findColorByRole(state.colors, 'warning');
  const error = findColorByRole(state.colors, 'error');
  const border = findColorByRole(state.colors, 'border');

  // Apply color blindness simulation
  const bgColor = background ? `#${simulateColorBlindness(background.hex, mode)}` : '#FFFFFF';
  const surfaceColor = surface ? `#${simulateColorBlindness(surface.hex, mode)}` : '#F3F4F6';
  const textColor = textPrimary ? `#${simulateColorBlindness(textPrimary.hex, mode)}` : '#111827';
  const textSecColor = textSecondary ? `#${simulateColorBlindness(textSecondary.hex, mode)}` : '#6B7280';
  const primaryColor = primary ? `#${simulateColorBlindness(primary.hex, mode)}` : '#2563EB';
  const accentColor = accent ? `#${simulateColorBlindness(accent.hex, mode)}` : '#7C3AED';
  const successColor = success ? `#${simulateColorBlindness(success.hex, mode)}` : '#10B981';
  const warningColor = warning ? `#${simulateColorBlindness(warning.hex, mode)}` : '#F59E0B';
  const errorColor = error ? `#${simulateColorBlindness(error.hex, mode)}` : '#EF4444';
  const borderColor = border ? `#${simulateColorBlindness(border.hex, mode)}` : undefined;

  return (
    <div
      className="w-full min-h-96 rounded-sm p-12"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      role="region"
      aria-label="Design preview showing your color palette in use"
    >
        {/* App Header */}
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: textColor }}
          >
            Welcome to Your App
          </h1>
          <p
            className="text-base"
            style={{ color: textSecColor }}
          >
            This is a preview of your color palette in action
          </p>
        </div>

        {/* Surface Card */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{
            backgroundColor: surfaceColor,
            ...(borderColor && {
              border: `1px solid ${borderColor}`,
            }),
          }}
        >
          <h2
            className="text-xl font-semibold mb-3"
            style={{ color: textColor }}
          >
            Card Title
          </h2>
          <p
            className="mb-4 leading-relaxed"
            style={{ color: textColor }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            {primary && (
              <button
                className="px-4 py-2 rounded font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: primaryColor,
                  color: bgColor,
                }}
                aria-label="Primary action button"
              >
                Primary Action
              </button>
            )}

            {accent && (
              <button
                className="px-4 py-2 rounded font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: accentColor,
                  color: bgColor,
                }}
                aria-label="Secondary action button"
              >
                Secondary Action
              </button>
            )}
          </div>
        </div>

        {/* Alert States */}
        {(success || warning || error) && (
          <div className="space-y-3">
            {success && (
              <div
                className="p-4 rounded border-l-4"
                style={{
                  backgroundColor: surfaceColor,
                  borderLeftColor: successColor,
                }}
              >
                <p
                  className="font-medium"
                  style={{ color: successColor }}
                >
                  ✓ Success
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: textSecColor }}
                >
                  This is a success message
                </p>
              </div>
            )}

            {warning && (
              <div
                className="p-4 rounded border-l-4"
                style={{
                  backgroundColor: surfaceColor,
                  borderLeftColor: warningColor,
                }}
              >
                <p
                  className="font-medium"
                  style={{ color: warningColor }}
                >
                  ⚠ Warning
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: textSecColor }}
                >
                  This is a warning message
                </p>
              </div>
            )}

            {error && (
              <div
                className="p-4 rounded border-l-4"
                style={{
                  backgroundColor: surfaceColor,
                  borderLeftColor: errorColor,
                }}
              >
                <p
                  className="font-medium"
                  style={{ color: errorColor }}
                >
                  ✗ Error
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: textSecColor }}
                >
                  This is an error message
                </p>
              </div>
            )}
          </div>
        )}
      </div>
  );
}
