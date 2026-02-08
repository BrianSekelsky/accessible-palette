'use client';

/**
 * Palette Debug Component
 *
 * Temporary component to test palette state management.
 * Displays the current palette and allows testing basic operations.
 * This will be removed once the actual UI components are built.
 */

import { usePalette } from '@/hooks/usePalette';
import { addColor, removeColor, updateColor } from '@/lib/palette/actions';
import type { ColorEntry } from '@/types';

export function PaletteDebug() {
  const { state, dispatch } = usePalette();

  const handleAddColor = () => {
    const newColor: ColorEntry = {
      id: crypto.randomUUID(),
      hex: '000000',
      label: 'New Color',
      role: 'custom',
      locked: false,
    };
    dispatch(addColor(newColor));
  };

  const handleRemoveColor = (id: string) => {
    dispatch(removeColor(id));
  };

  const handleUpdateLabel = (id: string, newLabel: string) => {
    dispatch(updateColor(id, { label: newLabel }));
  };

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Palette State Debug</h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Standard:</strong> {state.contrastStandard} |
          <strong> Target:</strong> {state.targetLevel} |
          <strong> Mode:</strong> {state.mode}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Colors:</strong> {state.colors.length} / 12
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {state.colors.map((color) => (
          <div
            key={color.id}
            className="flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-700 rounded"
          >
            <div
              className="w-12 h-12 rounded border border-gray-300"
              style={{ backgroundColor: `#${color.hex}` }}
              aria-label={`Color swatch for ${color.label}`}
            />
            <div className="flex-1">
              <input
                type="text"
                value={color.label}
                onChange={(e) => handleUpdateLabel(color.id, e.target.value)}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                aria-label="Color label"
              />
              <p className="text-xs text-gray-500 mt-1">
                #{color.hex} · {color.role} · {color.locked ? '🔒' : '🔓'}
              </p>
            </div>
            <button
              onClick={() => handleRemoveColor(color.id)}
              disabled={state.colors.length <= 2}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Remove ${color.label}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddColor}
        disabled={state.colors.length >= 12}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Color ({state.colors.length}/12)
      </button>
    </div>
  );
}
