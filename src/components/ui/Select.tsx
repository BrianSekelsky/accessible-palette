'use client';

/**
 * Select Component
 *
 * Accessible dropdown select with label association.
 * Uses native <select> element for built-in keyboard accessibility.
 */

import React, { useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  visuallyHideLabel?: boolean;
}

/**
 * Reusable select component with proper label association
 *
 * @example
 * ```tsx
 * <Select
 *   label="Choose a role"
 *   options={[
 *     { value: 'primary', label: 'Primary' },
 *     { value: 'secondary', label: 'Secondary' }
 *   ]}
 *   value={selectedRole}
 *   onChange={(e) => setSelectedRole(e.target.value)}
 * />
 * ```
 */
export function Select({
  label,
  options,
  error,
  visuallyHideLabel = false,
  className = '',
  id,
  ...props
}: SelectProps) {
  // Generate unique ID if not provided
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = error ? `${selectId}-error` : undefined;

  // Build aria-describedby from error
  const describedBy = errorId || undefined;

  // Label classes
  const labelClasses = visuallyHideLabel
    ? 'visually-hidden'
    : 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  // Select classes
  const baseSelectClasses =
    'w-full px-3 py-2 border rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors cursor-pointer';
  const normalSelectClasses =
    'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400';
  const errorSelectClasses =
    'border-red-500 dark:border-red-400 focus:border-red-600 dark:focus:border-red-500';

  const selectClasses = `${baseSelectClasses} ${
    error ? errorSelectClasses : normalSelectClasses
  } ${className}`;

  return (
    <div className="w-full">
      <label htmlFor={selectId} className={labelClasses}>
        {label}
      </label>
      <select
        id={selectId}
        className={selectClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
