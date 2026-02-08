'use client';

/**
 * AnnouncementDisplay Component
 *
 * Renders the global live region for screen reader announcements.
 * Consumes the AnnouncementContext to display current announcement messages.
 */

import React from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { LiveRegion } from './LiveRegion';

/**
 * AnnouncementDisplay component
 *
 * Must be rendered within AnnouncementProvider.
 * Automatically displays announcements triggered via the useAnnouncements hook.
 */
export function AnnouncementDisplay() {
  const { message, politeness } = useAnnouncements();

  return <LiveRegion message={message} politeness={politeness} />;
}
