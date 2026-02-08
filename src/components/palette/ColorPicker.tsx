'use client';

/**
 * Color Picker Component
 *
 * Advanced color picker with hex, RGB inputs and eye dropper support
 */

import React, { useState, useEffect } from 'react';

export interface ColorPickerProps {
  hex: string; // 6-digit hex without #
  onChange: (hex: string) => void;
  onClose: () => void;
}

/**
 * Converts hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  return {
    r: parseInt(cleanHex.substring(0, 2), 16),
    g: parseInt(cleanHex.substring(2, 4), 16),
    b: parseInt(cleanHex.substring(4, 6), 16),
  };
}

/**
 * Converts RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, n));
    return clamped.toString(16).padStart(2, '0');
  };
  return `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Color picker component
 */
export function ColorPicker({ hex, onChange, onClose }: ColorPickerProps) {
  const [hexValue, setHexValue] = useState(hex);
  const rgb = hexToRgb(hexValue);
  const [r, setR] = useState(rgb.r);
  const [g, setG] = useState(rgb.g);
  const [b, setB] = useState(rgb.b);

  // Check if EyeDropper API is supported
  const eyeDropperSupported = typeof window !== 'undefined' && 'EyeDropper' in window;

  // Sync internal state when hex prop changes
  useEffect(() => {
    setHexValue(hex);
    const rgb = hexToRgb(hex);
    setR(rgb.r);
    setG(rgb.g);
    setB(rgb.b);
  }, [hex]);

  const handleHexChange = (value: string) => {
    const cleaned = value.replace('#', '').toUpperCase();
    if (/^[0-9A-F]{0,6}$/.test(cleaned)) {
      setHexValue(cleaned);
      if (cleaned.length === 6) {
        const rgb = hexToRgb(cleaned);
        setR(rgb.r);
        setG(rgb.g);
        setB(rgb.b);
        onChange(cleaned);
      }
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const clamped = Math.max(0, Math.min(255, value));
    if (channel === 'r') setR(clamped);
    if (channel === 'g') setG(clamped);
    if (channel === 'b') setB(clamped);

    const newHex = rgbToHex(
      channel === 'r' ? clamped : r,
      channel === 'g' ? clamped : g,
      channel === 'b' ? clamped : b
    );
    setHexValue(newHex);
    onChange(newHex);
  };

  const handleEyeDropper = async () => {
    if (!eyeDropperSupported) return;

    try {
      // @ts-ignore - EyeDropper API is not yet in TypeScript types
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      const hex = result.sRGBHex.replace('#', '').toUpperCase();
      handleHexChange(hex);
    } catch (err) {
      // User cancelled or error occurred
      console.log('Eye dropper cancelled or failed:', err);
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 min-w-64">
      {/* Color Preview */}
      <div
        className="w-full h-16 rounded-lg mb-4 border border-gray-300 dark:border-gray-600"
        style={{ backgroundColor: `#${hexValue}` }}
      />

      {/* Hex Input */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hex
        </label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">#</span>
          <input
            type="text"
            value={hexValue}
            onChange={(e) => handleHexChange(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono"
            placeholder="RRGGBB"
            maxLength={6}
          />
        </div>
      </div>

      {/* RGB Inputs */}
      <div className="mb-4 space-y-2">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          RGB
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">R</label>
            <input
              type="number"
              min="0"
              max="255"
              value={r}
              onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">G</label>
            <input
              type="number"
              min="0"
              max="255"
              value={g}
              onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">B</label>
            <input
              type="number"
              min="0"
              max="255"
              value={b}
              onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Eye Dropper Button */}
      {eyeDropperSupported && (
        <button
          onClick={handleEyeDropper}
          className="w-full px-3 py-2 mb-3 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-700 dark:text-gray-300">
            <path d="M13.5 6L18 10.5M3 21L10.5 13.5M14.5 5L19 9.5M3 21L6.5 17.5M14 7L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 13L7 17L3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Pick from screen
        </button>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        Done
      </button>
    </div>
  );
}
