'use client';

/**
 * Simple Generate Button Component
 *
 * Minimal button to generate new random color palettes.
 * No keyboard shortcuts, just a clean button.
 */

import React from 'react';
import { usePalette } from '@/hooks/usePalette';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { replaceColors } from '@/lib/palette/actions';
import { regeneratePalette } from '@/lib/palette/generator';

/**
 * Simple generate palette button
 */
export function SimpleGenerateButton() {
  const { state, dispatch } = usePalette();
  const { announce } = useAnnouncements();

  // Handle palette generation
  const handleGenerate = () => {
    // Always use regeneratePalette to preserve structure (added colors + locked colors)
    const newPalette = regeneratePalette(state.colors);

    dispatch(replaceColors(newPalette));

    // Announce to screen readers
    const lockedCount = newPalette.filter(c => c.locked).length;
    const message = lockedCount > 0
      ? `New palette generated. ${lockedCount} locked color${lockedCount > 1 ? 's' : ''} preserved.`
      : 'New palette generated.';

    announce(message);
  };

  return (
    <button
      onClick={handleGenerate}
      className="px-6 py-3 text-sm font-normal border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      aria-label="Generate new color palette"
    >
      Generate palette
    </button>
  );
}
