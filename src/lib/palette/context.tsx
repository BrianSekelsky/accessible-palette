'use client';

/**
 * Palette Context Provider
 *
 * Provides palette state and dispatch function to the entire application.
 * Uses React's Context API with useReducer for state management.
 */

import React, { createContext, useReducer, type Dispatch } from 'react';
import type { PaletteState, PaletteAction } from '@/types';
import { paletteReducer, initialPaletteState } from './reducer';

/**
 * Context value type
 */
interface PaletteContextValue {
  state: PaletteState;
  dispatch: Dispatch<PaletteAction>;
}

/**
 * Palette Context
 * Provides access to palette state and dispatch function
 */
export const PaletteContext = createContext<PaletteContextValue | undefined>(
  undefined
);

/**
 * Palette Provider Props
 */
interface PaletteProviderProps {
  children: React.ReactNode;
}

/**
 * Palette Provider Component
 * Wraps the application to provide palette state management
 *
 * @example
 * ```tsx
 * <PaletteProvider>
 *   <App />
 * </PaletteProvider>
 * ```
 */
export function PaletteProvider({ children }: PaletteProviderProps) {
  const [state, dispatch] = useReducer(paletteReducer, initialPaletteState);

  const value: PaletteContextValue = {
    state,
    dispatch,
  };

  return (
    <PaletteContext.Provider value={value}>
      {children}
    </PaletteContext.Provider>
  );
}
