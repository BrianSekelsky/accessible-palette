'use client';

/**
 * Color Blindness Simulation Context
 *
 * Provides global state for the current color blindness simulation mode.
 */

import React, { createContext, useContext, useState } from 'react';
import type { ColorBlindnessType } from '@/lib/color/colorblind';

interface ColorBlindnessContextValue {
  mode: ColorBlindnessType;
  setMode: (mode: ColorBlindnessType) => void;
}

const ColorBlindnessContext = createContext<ColorBlindnessContextValue | null>(null);

export function ColorBlindnessProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ColorBlindnessType>('none');

  return (
    <ColorBlindnessContext.Provider value={{ mode, setMode }}>
      {children}
    </ColorBlindnessContext.Provider>
  );
}

export function useColorBlindness() {
  const context = useContext(ColorBlindnessContext);
  if (!context) {
    throw new Error('useColorBlindness must be used within ColorBlindnessProvider');
  }
  return context;
}
