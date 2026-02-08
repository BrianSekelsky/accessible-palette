'use client';

/**
 * Color Palette Component
 *
 * Simple horizontal display of colors without drag-and-drop.
 * Minimal design matching Figma mockup.
 */

import React from 'react';
import { usePalette } from '@/hooks/usePalette';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { updateColor, removeColor } from '@/lib/palette/actions';
import { ColorBlock } from './ColorBlock';
import { AddColorButton } from './AddColorButton';
import type { ColorEntry } from '@/types';

/**
 * Core color roles that cannot be removed
 */
const CORE_ROLES = ['background', 'surface', 'text-primary', 'primary', 'accent'];

/**
 * Color palette display component
 */
export function ColorPalette() {
  const { state, dispatch } = usePalette();
  const { announce } = useAnnouncements();

  // Handle update color
  const handleUpdateColor = (
    id: string,
    updates: Partial<Omit<ColorEntry, 'id'>>
  ) => {
    dispatch(updateColor(id, updates));
  };

  // Handle remove color
  const handleRemoveColor = (id: string) => {
    const color = state.colors.find(c => c.id === id);
    dispatch(removeColor(id));
    if (color) {
      announce(`${color.label} removed. ${state.colors.length - 1} of 12 colors in palette.`);
    }
  };

  // Determine if a color can be removed (not a core role)
  const canRemoveColor = (color: ColorEntry) => {
    return !CORE_ROLES.includes(color.role);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-8 items-end">
        {state.colors.map((color) => (
          <ColorBlock
            key={color.id}
            color={color}
            onUpdate={handleUpdateColor}
            onRemove={handleRemoveColor}
            canRemove={canRemoveColor(color)}
          />
        ))}
      </div>

      <AddColorButton />
    </div>
  );
}
