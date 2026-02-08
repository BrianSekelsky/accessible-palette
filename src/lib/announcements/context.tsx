'use client';

/**
 * Announcement Context
 *
 * Provides a global announcement system for screen reader notifications.
 * Components can trigger announcements from anywhere in the app.
 */

import React, { createContext, useCallback, useState } from 'react';

export interface AnnouncementContextType {
  /**
   * Current announcement message
   */
  message: string;

  /**
   * Announce a message to screen readers
   * @param msg - The message to announce
   * @param politeness - Politeness level ('polite' | 'assertive')
   */
  announce: (msg: string, politeness?: 'polite' | 'assertive') => void;

  /**
   * Current politeness level
   */
  politeness: 'polite' | 'assertive';
}

export const AnnouncementContext = createContext<AnnouncementContextType | null>(null);

export interface AnnouncementProviderProps {
  children: React.ReactNode;
}

/**
 * AnnouncementProvider component
 *
 * Wraps the application to provide global announcement functionality.
 * Use with the useAnnouncements hook to trigger announcements from any component.
 */
export function AnnouncementProvider({ children }: AnnouncementProviderProps) {
  const [message, setMessage] = useState('');
  const [politeness, setPoliteness] = useState<'polite' | 'assertive'>('polite');

  const announce = useCallback((msg: string, level: 'polite' | 'assertive' = 'polite') => {
    // Clear the message first to ensure the same message can be announced twice in a row
    setMessage('');
    setPoliteness(level);

    // Use setTimeout to ensure screen readers detect the change
    setTimeout(() => {
      setMessage(msg);
    }, 100);

    // Clear the message after announcement (screen readers have processed it)
    setTimeout(() => {
      setMessage('');
    }, 1000);
  }, []);

  return (
    <AnnouncementContext.Provider value={{ message, announce, politeness }}>
      {children}
    </AnnouncementContext.Provider>
  );
}
