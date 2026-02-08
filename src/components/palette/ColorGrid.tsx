'use client';

/**
 * Color Grid Component
 *
 * Displays colors in a grid with drag-and-drop support for reordering.
 */

import React, { useState } from 'react';
import { usePalette } from '@/hooks/usePalette';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { removeColor, updateColor, replaceColors } from '@/lib/palette/actions';
import { ColorCard } from './ColorCard';
import type { ColorEntry } from '@/types';

/**
 * Color grid with drag-and-drop reordering
 */
export function ColorGrid() {
  const { state, dispatch } = usePalette();
  const { announce } = useAnnouncements();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const canRemove = state.colors.length > 2;

  // Handle drag start
  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
  };

  // Handle drag over
  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  // Handle drop
  const handleDrop = (dropIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder the colors array
    const newColors = [...state.colors];
    const [draggedColor] = newColors.splice(draggedIndex, 1);
    newColors.splice(dropIndex, 0, draggedColor);

    dispatch(replaceColors(newColors));
    announce(`${draggedColor.label} moved to position ${dropIndex + 1}`);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle update color
  const handleUpdateColor = (
    id: string,
    updates: Partial<Omit<ColorEntry, 'id'>>
  ) => {
    const color = state.colors.find(c => c.id === id);
    dispatch(updateColor(id, updates));

    if (color && updates.locked !== undefined) {
      announce(`${color.label} ${updates.locked ? 'locked' : 'unlocked'}`);
    }
  };

  // Handle remove color
  const handleRemoveColor = (id: string) => {
    const color = state.colors.find(c => c.id === id);
    dispatch(removeColor(id));
    if (color) {
      announce(`${color.label} removed. ${state.colors.length - 1} of 12 colors in palette.`);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {state.colors.map((color, index) => {
        const isDragging = draggedIndex === index;
        const isDropTarget = dragOverIndex === index && draggedIndex !== index;

        return (
          <div
            key={color.id}
            draggable
            onDragStart={handleDragStart(index)}
            onDragOver={handleDragOver(index)}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={`
              transition-all cursor-move
              ${isDragging ? 'opacity-50 scale-95' : ''}
              ${isDropTarget ? 'scale-105 ring-2 ring-blue-500' : ''}
            `}
          >
            <ColorCard
              color={color}
              onUpdate={handleUpdateColor}
              onRemove={handleRemoveColor}
              canRemove={canRemove}
            />
          </div>
        );
      })}
    </div>
  );
}
