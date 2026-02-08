'use client';

/**
 * ColorInput Component
 *
 * Single color entry row with all controls:
 * - Visual swatch preview
 * - Hex color input (with validation)
 * - Label/name input
 * - Role selector
 * - Lock toggle
 * - Remove button
 */

import React, { useState, useEffect } from 'react';
import type { ColorEntry, ColorRole } from '@/types';
import { ColorSwatch } from './ColorSwatch';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { parseHexInput, formatHexForDisplay } from '@/lib/color/utils';

export interface ColorInputProps {
  color: ColorEntry;
  canRemove: boolean;
  onUpdate: (id: string, updates: Partial<Omit<ColorEntry, 'id'>>) => void;
  onRemove: (id: string) => void;
}

/**
 * Role options for the select dropdown
 */
const roleOptions: SelectOption[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'accent', label: 'Accent' },
  { value: 'background', label: 'Background' },
  { value: 'surface', label: 'Surface' },
  { value: 'text-primary', label: 'Text Primary' },
  { value: 'text-secondary', label: 'Text Secondary' },
  { value: 'error', label: 'Error' },
  { value: 'warning', label: 'Warning' },
  { value: 'success', label: 'Success' },
  { value: 'info', label: 'Info' },
  { value: 'custom', label: 'Custom' },
];

/**
 * Single color entry component
 */
export function ColorInput({
  color,
  canRemove,
  onUpdate,
  onRemove,
}: ColorInputProps) {
  // Local state for hex input (enables real-time validation without polluting global state)
  const [hexInput, setHexInput] = useState(formatHexForDisplay(color.hex));
  const [hexError, setHexError] = useState<string>('');

  // Sync local hex state when color.hex changes externally
  // This is a legitimate use case: we maintain local state for real-time validation,
  // but need to sync it when the color is updated externally (e.g., via auto-fix).
  // The pattern avoids cascading renders by only updating when values differ.
  useEffect(() => {
    const formatted = formatHexForDisplay(color.hex);
    // Only update if the value actually changed to avoid unnecessary re-renders
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHexInput((prev) => (prev === formatted ? prev : formatted));
    setHexError('');
  }, [color.hex]);

  // Handle hex input change (real-time validation)
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);

    // Validate in real-time
    const normalized = parseHexInput(value);
    if (!normalized && value.trim() !== '') {
      setHexError('Enter a valid hex color (e.g., #FF0000 or #F00)');
    } else {
      setHexError('');
    }
  };

  // Handle hex input blur (save valid changes)
  const handleHexBlur = () => {
    const normalized = parseHexInput(hexInput);

    if (normalized) {
      // Valid hex - update global state
      onUpdate(color.id, { hex: normalized });
      setHexError('');
    } else if (hexInput.trim() === '') {
      // Empty - revert to original
      setHexInput(formatHexForDisplay(color.hex));
      setHexError('');
    } else {
      // Invalid - keep error showing
      setHexError('Enter a valid hex color (e.g., #FF0000 or #F00)');
    }
  };

  // Handle hex input Enter key (same as blur)
  const handleHexKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  // Handle label change (dispatch on blur for performance)
  const handleLabelBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newLabel = e.target.value.trim();
    if (newLabel && newLabel !== color.label) {
      onUpdate(color.id, { label: newLabel });
    }
  };

  // Handle role change (dispatch immediately)
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(color.id, { role: e.target.value as ColorRole });
  };

  // Handle lock toggle (dispatch immediately)
  const handleLockToggle = () => {
    onUpdate(color.id, { locked: !color.locked });
  };

  // Handle remove button
  const handleRemove = () => {
    onRemove(color.id);
  };

  return (
    <div className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
      {/* Color Swatch */}
      <div className="flex-shrink-0">
        <ColorSwatch hex={color.hex} label={color.label} size="md" />
      </div>

      {/* Input Fields */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Hex Input */}
        <Input
          label="Hex Color"
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          onKeyDown={handleHexKeyDown}
          error={hexError}
          placeholder="#000000"
          className="font-mono"
        />

        {/* Label Input */}
        <Input
          label="Color Name"
          type="text"
          defaultValue={color.label}
          onBlur={handleLabelBlur}
          placeholder="e.g., Primary Blue"
          maxLength={50}
        />

        {/* Role Select */}
        <Select
          label="Role"
          options={roleOptions}
          value={color.role}
          onChange={handleRoleChange}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {/* Lock Toggle */}
        <button
          type="button"
          onClick={handleLockToggle}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={color.locked ? `Unlock ${color.label}` : `Lock ${color.label}`}
          title={color.locked ? 'Locked (won\'t receive auto-fix suggestions)' : 'Unlocked'}
        >
          <span className="text-xl" role="img" aria-hidden="true">
            {color.locked ? '🔒' : '🔓'}
          </span>
        </button>

        {/* Remove Button */}
        <Button
          variant="danger"
          size="sm"
          onClick={handleRemove}
          disabled={!canRemove}
          aria-label={`Remove ${color.label}`}
          title={!canRemove ? 'Cannot remove (minimum 2 colors required)' : undefined}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
