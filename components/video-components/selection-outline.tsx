'use client';

import React, { useCallback, useMemo } from 'react';
import { useCurrentScale } from 'remotion';
import type { ResizableItem, TimelineItemType } from '@/types';
import { ResizeHandle } from './resize-handle';

export const SelectionOutline: React.FC<{
  item: ResizableItem;
  updateItem: (item: ResizableItem, updates: Partial<ResizableItem>) => void;
  setSelectedItem: (item: TimelineItemType | null) => void;
  selectedItem: TimelineItemType | null;
  isDragging: boolean;
  onSelect?: (item: ResizableItem) => void;
}> = ({
  item,
  updateItem,
  setSelectedItem,
  selectedItem,
  isDragging,
  onSelect
}) => {
  const scale = useCurrentScale();
  const scaledBorder = Math.ceil(2 / scale);

  const [hovered, setHovered] = React.useState(false);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const isSelected = item.id === selectedItem?.id;

  const style: React.CSSProperties = useMemo(() => {
    return {
      width: item.width,
      height: item.height,
      left: item.x,
      top: item.y,
      position: 'absolute',
      outline:
        (hovered && !isDragging) || isSelected
          ? `${scaledBorder}px solid rgba(255, 255, 255, 0.5)`
          : undefined,
      userSelect: 'none',
      touchAction: 'none',
      cursor: isSelected ? 'grab' : 'pointer'
    };
  }, [item, hovered, isDragging, isSelected, scaledBorder]);

  const startDragging = useCallback(
    (e: PointerEvent | React.MouseEvent) => {
      const initialX = e.clientX;
      const initialY = e.clientY;

      const onPointerMove = (pointerMoveEvent: PointerEvent) => {
        const offsetX = (pointerMoveEvent.clientX - initialX) / scale;
        const offsetY = (pointerMoveEvent.clientY - initialY) / scale;
        updateItem(item, {
          x: Math.round(item.x + offsetX),
          y: Math.round(item.y + offsetY)
        });
      };

      const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove);
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });

      window.addEventListener('pointerup', onPointerUp, {
        once: true
      });
    },
    [item, scale, updateItem]
  );

  const onPointerDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.button !== 0) {
        return;
      }

      setSelectedItem(item as TimelineItemType);
      if (onSelect) {
        onSelect(item);
      }
      startDragging(e);
    },
    [item, setSelectedItem, onSelect, startDragging]
  );

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerEnter={onMouseEnter}
      onPointerLeave={onMouseLeave}
      style={style}
    >
      {isSelected ? (
        <>
          <ResizeHandle item={item} updateItem={updateItem} type="top-left" />
          <ResizeHandle item={item} updateItem={updateItem} type="top-right" />
          <ResizeHandle
            item={item}
            updateItem={updateItem}
            type="bottom-left"
          />
          <ResizeHandle
            item={item}
            updateItem={updateItem}
            type="bottom-right"
          />
        </>
      ) : null}
    </div>
  );
};
