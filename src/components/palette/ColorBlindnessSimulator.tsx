'use client';

/**
 * Color Blindness Simulator Component
 *
 * Allows users to simulate how their palette appears with different types
 * of color vision deficiency.
 */

import React from 'react';
import { useColorBlindness } from '@/contexts/ColorBlindnessContext';
import { getColorBlindnessTypes } from '@/lib/color/colorblind';

export function ColorBlindnessSimulator() {
  const { mode, setMode } = useColorBlindness();
  const types = getColorBlindnessTypes();

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="colorblind-mode"
        className="text-sm text-gray-700 dark:text-gray-300"
      >
        Simulate:
      </label>
      <select
        id="colorblind-mode"
        value={mode}
        onChange={(e) => setMode(e.target.value as typeof mode)}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
        aria-label="Color blindness simulation mode"
      >
        {types.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}
