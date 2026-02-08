'use client';

/**
 * ColorList Component
 *
 * Manages the full list of color entries in the palette.
 * Provides add/remove functionality and orchestrates ColorInput instances.
 */

import React from 'react';
import { usePalette } from '@/hooks/usePalette';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { addColor, removeColor, updateColor } from '@/lib/palette/actions';
import type { ColorEntry } from '@/types';
import { ColorInput } from './ColorInput';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

/**
 * Color list container component
 *
 * Consumes palette state and dispatches actions.
 * No props needed - gets everything from context.
 */
export function ColorList() {
  const { state, dispatch } = usePalette();
  const { announce } = useAnnouncements();

  // Calculate constraints
  const canAddMore = state.colors.length < 12;
  const canRemove = state.colors.length > 2;

  // Handle adding a new color
  const handleAddColor = () => {
    const newColor: ColorEntry = {
      id: crypto.randomUUID(),
      hex: '000000',
      label: 'New Color',
      role: 'custom',
      locked: false,
    };
    dispatch(addColor(newColor));
    announce(`Color added. ${state.colors.length + 1} of 12 colors in palette.`);
  };

  // Handle updating a color
  const handleUpdateColor = (
    id: string,
    updates: Partial<Omit<ColorEntry, 'id'>>
  ) => {
    const color = state.colors.find(c => c.id === id);
    dispatch(updateColor(id, updates));

    // Announce the update with specific details
    if (color) {
      if (updates.hex) {
        announce(`${color.label} updated to #${updates.hex}`);
      } else if (updates.label) {
        announce(`Color renamed to ${updates.label}`);
      } else if (updates.role) {
        announce(`${color.label} role changed to ${updates.role}`);
      } else if (updates.locked !== undefined) {
        announce(`${color.label} ${updates.locked ? 'locked' : 'unlocked'}`);
      }
    }
  };

  // Handle removing a color
  const handleRemoveColor = (id: string) => {
    const color = state.colors.find(c => c.id === id);
    dispatch(removeColor(id));
    if (color) {
      announce(`${color.label} removed. ${state.colors.length - 1} of 12 colors in palette.`);
    }
  };

  return (
    <section aria-labelledby="color-list-heading">
      <h2 id="color-list-heading" className="text-xl font-semibold mb-4">
        Color Palette
      </h2>

      {/* Color Entries */}
      <div className="space-y-3 mb-6">
        {state.colors.map((color) => (
          <ColorInput
            key={color.id}
            color={color}
            canRemove={canRemove}
            onUpdate={handleUpdateColor}
            onRemove={handleRemoveColor}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Add Color Button */}
        <Button
          onClick={handleAddColor}
          disabled={!canAddMore}
          variant="primary"
          aria-label={`Add color (${state.colors.length} of 12)`}
        >
          Add Color ({state.colors.length}/12)
        </Button>

        {/* Paste from URL - Stretch Goal Placeholder */}
        <div className="flex-1 max-w-md">
          <Input
            label="Paste from URL"
            type="url"
            placeholder="Coming soon"
            disabled
            visuallyHideLabel
            helperText="Extract colors from a website URL (coming soon)"
          />
        </div>
      </div>
    </section>
  );
}
