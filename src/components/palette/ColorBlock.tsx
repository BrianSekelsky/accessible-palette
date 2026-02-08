'use client';

/**
 * Color Block Component
 *
 * Minimal color display - just a colored rectangle with label and hex below.
 * Click to copy hex, lock icon to preserve color during regeneration.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useColorBlindness } from '@/contexts/ColorBlindnessContext';
import { simulateColorBlindness } from '@/lib/color/colorblind';
import { ColorPicker } from './ColorPicker';
import type { ColorEntry, ColorRole } from '@/types';

export interface ColorBlockProps {
  color: ColorEntry;
  onUpdate: (id: string, updates: Partial<Omit<ColorEntry, 'id'>>) => void;
  onRemove?: (id: string) => void;
  canRemove?: boolean;
}

/**
 * Get size classes based on color role
 */
function getSizeClasses(role: ColorRole): { container: string; display: string } {
  switch (role) {
    case 'background':
      return {
        container: 'w-80',
        display: 'h-48',
      };
    case 'surface':
      return {
        container: 'w-52',
        display: 'h-40',
      };
    case 'text-primary':
    case 'text-secondary':
      return {
        container: 'w-28',
        display: 'h-28',
      };
    case 'primary':
    case 'secondary':
    case 'accent':
    case 'success':
    case 'warning':
    case 'error':
    case 'info':
      return {
        container: 'w-28',
        display: 'h-28',
      };
    default:
      return {
        container: 'w-28',
        display: 'h-28',
      };
  }
}

/**
 * Get visual representation based on color role
 */
function getColorPreview(role: ColorRole, hex: string): React.ReactNode {
  const color = `#${hex}`;

  switch (role) {
    case 'text-primary':
    case 'text-secondary':
      return (
        <div
          className="text-6xl font-serif font-normal flex items-center justify-center h-full"
          style={{ color }}
          aria-hidden="true"
        >
          T
        </div>
      );
    default:
      return null;
  }
}

/**
 * Color block component - minimal design
 */
export function ColorBlock({ color, onUpdate, onRemove, canRemove }: ColorBlockProps) {
  const sizes = getSizeClasses(color.role);
  const { announce } = useAnnouncements();
  const { mode } = useColorBlindness();
  const [copied, setCopied] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Apply color blindness simulation
  const displayHex = simulateColorBlindness(color.hex, mode);
  const preview = getColorPreview(color.role, displayHex);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPicker]);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(`#${color.hex}`);
      setCopied(true);
      announce(`Color #${color.hex} copied to clipboard`);

      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLockToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger copy when clicking lock
    onUpdate(color.id, { locked: !color.locked });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(color.id);
    }
  };

  const handleColorChange = (newHex: string) => {
    onUpdate(color.id, { hex: newHex });
  };

  return (
    <div className={`${sizes.container} flex-shrink-0`}>
      {/* Color Display */}
      <div
        className={`${sizes.display} rounded-lg relative group cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md`}
        style={{ backgroundColor: `#${displayHex}` }}
        onClick={handleCopyClick}
        role="button"
        tabIndex={0}
        aria-label={`${color.label}: #${color.hex}. Click to copy to clipboard.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCopyClick();
          }
        }}
      >
        {preview}

        {/* Copy icon indicator (appears on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black bg-opacity-40 rounded-full p-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.24162C20 6.7034 19.7831 6.18789 19.3982 5.81161L16.1566 2.6277C15.7676 2.24752 15.2415 2.03146 14.6931 2.0278L10 2C8.89543 2 8 2.89543 8 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V9C4 7.89543 4.89543 7 6 7H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Lock button (always visible) */}
        <button
          onClick={handleLockToggle}
          className="absolute bottom-2 right-2 p-1.5 bg-black bg-opacity-30 hover:bg-opacity-50 rounded transition-all"
          aria-label={color.locked ? `Unlock ${color.label}` : `Lock ${color.label}`}
          title={color.locked ? 'Unlock' : 'Lock'}
        >
          {color.locked ? (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-white">
              <path d="M6 1C4.34315 1 3 2.34315 3 4V5H2C1.44772 5 1 5.44772 1 6V10C1 10.5523 1.44772 11 2 11H10C10.5523 11 11 10.5523 11 10V6C11 5.44772 10.5523 5 10 5H9V4C9 2.34315 7.65685 1 6 1ZM7.5 4V5H4.5V4C4.5 3.17157 5.17157 2.5 6 2.5C6.82843 2.5 7.5 3.17157 7.5 4Z" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-white">
              <path d="M2 5C1.44772 5 1 5.44772 1 6V10C1 10.5523 1.44772 11 2 11H10C10.5523 11 11 10.5523 11 10V6C11 5.44772 10.5523 5 10 5H9V4C9 2.34315 7.65685 1 6 1C4.34315 1 3 2.34315 3 4H4.5C4.5 3.17157 5.17157 2.5 6 2.5C6.82843 2.5 7.5 3.17157 7.5 4V5H2Z" fill="currentColor"/>
            </svg>
          )}
        </button>

        {/* Remove button (for optional colors) */}
        {canRemove && onRemove && (
          <button
            onClick={handleRemove}
            className="absolute bottom-2 left-2 p-1.5 bg-black bg-opacity-30 hover:bg-opacity-50 rounded transition-all"
            aria-label={`Remove ${color.label}`}
            title="Remove"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-white">
              <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* Copied indicator */}
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-sm font-medium">Copied!</span>
          </div>
        )}
      </div>

      {/* Label and Hex */}
      <div className="mt-4 relative" ref={pickerRef}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{color.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mt-1">
              #{color.hex}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker(!showPicker);
            }}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Edit color"
            title="Edit color"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </button>
        </div>

        {/* Color Picker */}
        {showPicker && (
          <ColorPicker
            hex={color.hex}
            onChange={handleColorChange}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>
    </div>
  );
}
