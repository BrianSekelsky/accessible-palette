'use client';

/**
 * useAnnouncements Hook
 *
 * Provides access to the announcement system for screen reader notifications.
 */

import { useContext } from 'react';
import { AnnouncementContext } from '@/lib/announcements/context';

/**
 * Custom hook to access the announcement system
 *
 * Must be used within an AnnouncementProvider.
 *
 * @returns Announcement context with message and announce function
 * @throws Error if used outside AnnouncementProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { announce } = useAnnouncements();
 *
 *   const handleAction = () => {
 *     // ... perform action
 *     announce('Action completed successfully');
 *   };
 *
 *   return <button onClick={handleAction}>Do Action</button>;
 * }
 * ```
 */
export function useAnnouncements() {
  const context = useContext(AnnouncementContext);

  if (!context) {
    throw new Error('useAnnouncements must be used within AnnouncementProvider');
  }

  return context;
}
