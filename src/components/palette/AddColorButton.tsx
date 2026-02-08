'use client';

/**
 * Add Color Button Component
 *
 * Allows users to add additional colors to their palette with role selection.
 */

import React, { useState } from 'react';
import { usePalette } from '@/hooks/usePalette';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { addColor } from '@/lib/palette/actions';
import { generateSemanticColor, getRoleLabel } from '@/lib/palette/semanticColors';
import type { ColorRole, ColorEntry } from '@/types';

const ADDABLE_ROLES: { value: ColorRole; label: string }[] = [
  { value: 'text-secondary', label: 'Text Secondary' },
  { value: 'secondary', label: 'Secondary Action' },
  { value: 'border', label: 'Border' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'info', label: 'Info' },
  { value: 'custom', label: 'Custom' },
];

/**
 * Add color button component
 */
export function AddColorButton() {
  const { state, dispatch } = usePalette();
  const { announce } = useAnnouncements();
  const [selectedRole, setSelectedRole] = useState<ColorRole>('text-secondary');

  const canAdd = state.colors.length < 12;

  const handleAddColor = () => {
    if (!canAdd) return;

    const roleLabel = getRoleLabel(selectedRole);

    // Get context from existing palette for harmonious colors
    const primary = state.colors.find(c => c.role === 'primary');
    const accent = state.colors.find(c => c.role === 'accent');

    const newColor: ColorEntry = {
      id: crypto.randomUUID(),
      hex: generateSemanticColor(selectedRole, {
        primaryHue: primary ? parseInt(primary.hex, 16) % 360 : undefined,
        accentHue: accent ? parseInt(accent.hex, 16) % 360 : undefined,
      }),
      label: roleLabel,
      role: selectedRole,
      locked: false,
    };

    dispatch(addColor(newColor));
    announce(`${roleLabel} color added. ${state.colors.length + 1} of 12 colors in palette.`);
  };

  if (!canAdd) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value as ColorRole)}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
        aria-label="Select color type to add"
      >
        {ADDABLE_ROLES.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleAddColor}
        className="px-4 py-2 text-sm font-normal border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        aria-label={`Add ${ADDABLE_ROLES.find(r => r.value === selectedRole)?.label} color`}
      >
        Add color
      </button>
    </div>
  );
}
