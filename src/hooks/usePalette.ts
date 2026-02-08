'use client';

/**
 * usePalette Hook
 *
 * Custom hook for accessing palette state and dispatch function.
 * Provides a convenient way to interact with the palette context.
 */

import { useContext } from 'react';
import { PaletteContext } from '@/lib/palette/context';

/**
 * Access palette state and dispatch
 *
 * @throws {Error} If used outside of PaletteProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { state, dispatch } = usePalette();
 *
 *   return (
 *     <div>
 *       {state.colors.map(color => (
 *         <ColorSwatch key={color.id} color={color} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePalette() {
  const context = useContext(PaletteContext);

  if (context === undefined) {
    throw new Error('usePalette must be used within a PaletteProvider');
  }

  return context;
}
