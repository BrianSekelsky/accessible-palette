'use client';

/**
 * Live Region Component
 *
 * Provides accessible announcements for screen readers via ARIA live regions.
 * Used to announce dynamic content changes like palette updates, contrast results, etc.
 */

import React from 'react';

export interface LiveRegionProps {
  /**
   * The message to announce to screen readers
   */
  message: string;

  /**
   * Politeness level for announcements
   * - 'polite': Wait for user to finish current task (default, recommended)
   * - 'assertive': Interrupt user immediately (use sparingly for critical alerts)
   */
  politeness?: 'polite' | 'assertive';

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * LiveRegion component for screen reader announcements
 *
 * Renders an ARIA live region that is visually hidden but announced by screen readers.
 * When the message prop changes, screen readers will announce the new content.
 *
 * @example
 * ```tsx
 * const [announcement, setAnnouncement] = useState('');
 *
 * const handleSave = () => {
 *   // ... save logic
 *   setAnnouncement('Color saved successfully');
 * };
 *
 * return <LiveRegion message={announcement} />;
 * ```
 */
export function LiveRegion({
  message,
  politeness = 'polite',
  className = ''
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={`visually-hidden ${className}`}
    >
      {message}
    </div>
  );
}
