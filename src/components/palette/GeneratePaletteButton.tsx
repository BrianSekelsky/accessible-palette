'use client';

/**
 * Generate Palette Button Component
 *
 * Allows users to generate new random color palettes.
 * Supports both button click and spacebar keyboard shortcut.
 */

import React, { useEffect, useCallback } from 'react';
import { usePalette } from '@/hooks/usePalette';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { replaceColors } from '@/lib/palette/actions';
import { generatePalette, regeneratePalette } from '@/lib/palette/generator';
import { Button } from '@/components/ui/Button';

/**
 * Generate palette button component
 *
 * Provides UI and keyboard shortcut (spacebar) to generate new palettes.
 * Preserves locked colors when regenerating.
 */
export function GeneratePaletteButton() {
  const { state, dispatch } = usePalette();
  const { announce } = useAnnouncements();

  // Handle palette generation
  const handleGenerate = useCallback(() => {
    // If there are locked colors, preserve them
    const hasLockedColors = state.colors.some(c => c.locked);

    const newPalette = hasLockedColors
      ? regeneratePalette(state.colors)
      : generatePalette();

    dispatch(replaceColors(newPalette));

    // Announce to screen readers
    const lockedCount = newPalette.filter(c => c.locked).length;
    const message = lockedCount > 0
      ? `New palette generated. ${lockedCount} locked color${lockedCount > 1 ? 's' : ''} preserved.`
      : 'New palette generated.';

    announce(message);
  }, [state.colors, dispatch, announce]);

  // Keyboard shortcut handler (spacebar)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if spacebar is pressed and not focused on an input/textarea/button
      if (
        e.code === 'Space' &&
        !['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(
          (e.target as HTMLElement)?.tagName
        )
      ) {
        e.preventDefault();
        handleGenerate();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleGenerate])

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleGenerate}
        variant="primary"
        size="lg"
        aria-label="Generate new color palette (or press spacebar)"
      >
        <span className="text-lg">🎨</span>
        <span className="ml-2">Generate Palette</span>
        <span className="ml-2 text-sm opacity-75">(Spacebar)</span>
      </Button>
      <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
        Locked colors will be preserved
      </p>
    </div>
  );
}
