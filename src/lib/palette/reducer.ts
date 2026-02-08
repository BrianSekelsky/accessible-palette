/**
 * Palette Reducer
 *
 * Manages state updates for the color palette.
 * Uses a standard reducer pattern with discriminated union actions.
 */

import type { PaletteState, PaletteAction, ColorEntry } from '@/types';

/**
 * Creates the default palette
 * A basic light theme with 5 colors as specified in the brief:
 * - Background white
 * - Surface light gray
 * - Text dark
 * - Primary blue
 * - Accent/secondary
 */
export function createDefaultPalette(): ColorEntry[] {
  return [
    {
      id: crypto.randomUUID(),
      hex: 'FFFFFF',
      label: 'Background',
      role: 'background',
      locked: false,
    },
    {
      id: crypto.randomUUID(),
      hex: 'F3F4F6',
      label: 'Surface',
      role: 'surface',
      locked: false,
    },
    {
      id: crypto.randomUUID(),
      hex: '111827',
      label: 'Text',
      role: 'text-primary',
      locked: false,
    },
    {
      id: crypto.randomUUID(),
      hex: '2563EB',
      label: 'Primary',
      role: 'primary',
      locked: false,
    },
    {
      id: crypto.randomUUID(),
      hex: '7C3AED',
      label: 'Accent',
      role: 'accent',
      locked: false,
    },
  ];
}

/**
 * Initial palette state
 */
export const initialPaletteState: PaletteState = {
  colors: createDefaultPalette(),
  contrastStandard: 'WCAG2',
  targetLevel: 'AA',
  mode: 'light',
};

/**
 * Palette reducer
 * Handles all state updates for the palette
 */
export function paletteReducer(
  state: PaletteState,
  action: PaletteAction
): PaletteState {
  switch (action.type) {
    case 'ADD_COLOR': {
      // Don't allow more than 12 colors
      if (state.colors.length >= 12) {
        return state;
      }
      return {
        ...state,
        colors: [...state.colors, action.payload],
      };
    }

    case 'REMOVE_COLOR': {
      // Don't allow fewer than 2 colors
      if (state.colors.length <= 2) {
        return state;
      }
      return {
        ...state,
        colors: state.colors.filter(color => color.id !== action.payload.id),
      };
    }

    case 'UPDATE_COLOR': {
      return {
        ...state,
        colors: state.colors.map(color =>
          color.id === action.payload.id
            ? { ...color, ...action.payload.updates }
            : color
        ),
      };
    }

    case 'SET_CONTRAST_STANDARD': {
      return {
        ...state,
        contrastStandard: action.payload,
      };
    }

    case 'SET_TARGET_LEVEL': {
      return {
        ...state,
        targetLevel: action.payload,
      };
    }

    case 'SET_MODE': {
      return {
        ...state,
        mode: action.payload,
      };
    }

    case 'RESET_PALETTE': {
      return initialPaletteState;
    }

    default: {
      // TypeScript will ensure this is never reached if all cases are handled
      return state;
    }
  }
}
