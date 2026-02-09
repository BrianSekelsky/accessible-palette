'use client';

/**
 * Theme Provider Component
 *
 * Wraps the app with next-themes provider for dark mode support.
 * Prevents flash of unstyled content on page load.
 */

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="color-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
