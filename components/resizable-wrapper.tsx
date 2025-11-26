'use client';

import React, { useRef, useState, useCallback } from 'react';

interface ResizableWrapperProps {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  onResize: (x: number, y: number, width: number, height: number) => void;
  onSelect: () => void;
  children: React.ReactNode;
}

export const ResizableWrapper: React.FC<ResizableWrapperProps> = ({
  x,
  y,
  width,
  height,
  isSelected,
  onResize,
  onSelect,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, startWidth: 0, startHeight: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect();
      if (!isSelected) return;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        startX: x,
        startY: y
      };
    },
    [x, y, isSelected, onSelect]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsResizing(true);
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        startWidth: width,
        startHeight: height
      };
    },
    [width, height]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        const newX = dragStartRef.current.startX + deltaX;
        const newY = dragStartRef.current.startY + deltaY;
        onResize(newX, newY, width, height);
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartRef.current.x;
        const deltaY = e.clientY - resizeStartRef.current.y;
        const newWidth = Math.max(
          50,
          resizeStartRef.current.startWidth + deltaX
        );
        const newHeight = Math.max(
          20,
          resizeStartRef.current.startHeight + deltaY
        );
        onResize(x, y, newWidth, newHeight);
      }
    },
    [isDragging, isResizing, onResize, x, y, width, height]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        border: isSelected ? '2px solid rgba(255, 255, 255, 0.5)' : 'none',
        cursor: isSelected ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            right: -4,
            bottom: -4,
            width: 8,
            height: 8,
            backgroundColor: 'white',
            cursor: 'nwse-resize',
            borderRadius: '50%'
          }}
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};
