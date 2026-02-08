'use client';

/**
 * Input Component
 *
 * Accessible text input with label association and error handling.
 * Ensures all form inputs follow WCAG accessibility guidelines.
 */

import React, { useId } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  visuallyHideLabel?: boolean;
}

/**
 * Reusable input component with proper label association
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email address"
 *   type="email"
 *   error={errors.email}
 *   helperText="We'll never share your email"
 * />
 * ```
 */
export function Input({
  label,
  error,
  helperText,
  visuallyHideLabel = false,
  className = '',
  id,
  ...props
}: InputProps) {
  // Generate unique ID if not provided
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  // Build aria-describedby from error and helper text
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  // Label classes
  const labelClasses = visuallyHideLabel
    ? 'visually-hidden'
    : 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  // Input classes
  const baseInputClasses =
    'w-full px-3 py-2 border rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors';
  const normalInputClasses =
    'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400';
  const errorInputClasses =
    'border-red-500 dark:border-red-400 focus:border-red-600 dark:focus:border-red-500';

  const inputClasses = `${baseInputClasses} ${
    error ? errorInputClasses : normalInputClasses
  } ${className}`;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className={labelClasses}>
        {label}
      </label>
      <input
        id={inputId}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        {...props}
      />
      {helperText && !error && (
        <p id={helperId} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
