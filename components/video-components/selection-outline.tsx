'use client';

import React, { useCallback, useMemo } from 'react';
import { useCurrentScale } from 'remotion';
import type { TextOverlay, TimelineItemType } from '@/types';

const HANDLE_SIZE = 8;

type ResizeHandleType = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const ResizeHandle: React.FC<{
  type: ResizeHandleType;
  item: TextOverlay;
  updateItem: (id: string, updates: Partial<TextOverlay>) => void;
}> = ({ type, item, updateItem }) => {
  const scale = useCurrentScale();
  const size = Math.round(HANDLE_SIZE / scale);
  const borderSize = 1 / scale;

  const sizeStyle: React.CSSProperties = useMemo(() => {
    return {
      position: 'absolute',
      height: size,
      width: size,
      backgroundColor: 'white',
      border: `${borderSize}px solid rgba(255, 255, 255, 0.8)`,
    };
  }, [borderSize, size]);

  const margin = -size / 2 - borderSize;

  const style: React.CSSProperties = useMemo(() => {
    if (type === 'top-left') {
      return {
        ...sizeStyle,
        marginLeft: margin,
        marginTop: margin,
        cursor: 'nwse-resize',
      };
    }

    if (type === 'top-right') {
      return {
        ...sizeStyle,
        marginTop: margin,
        marginRight: margin,
        right: 0,
        cursor: 'nesw-resize',
      };
    }

    if (type === 'bottom-left') {
      return {
        ...sizeStyle,
        marginBottom: margin,
        marginLeft: margin,
        bottom: 0,
        cursor: 'nesw-resize',
      };
    }

    if (type === 'bottom-right') {
      return {
        ...sizeStyle,
        marginBottom: margin,
        marginRight: margin,
        right: 0,
        bottom: 0,
        cursor: 'nwse-resize',
      };
    }

    throw new Error('Unknown type: ' + JSON.stringify(type));
  }, [margin, sizeStyle, type]);

  const onPointerDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.button !== 0) {
        return;
      }

      const initialX = e.clientX;
      const initialY = e.clientY;

      const onPointerMove = (pointerMoveEvent: PointerEvent) => {
        const offsetX = (pointerMoveEvent.clientX - initialX) / scale;
        const offsetY = (pointerMoveEvent.clientY - initialY) / scale;

        const isLeft = type === 'top-left' || type === 'bottom-left';
        const isTop = type === 'top-left' || type === 'top-right';

        const newWidth = item.width + (isLeft ? -offsetX : offsetX);
        const newHeight = item.height + (isTop ? -offsetY : offsetY);
        const newLeft = item.x + (isLeft ? offsetX : 0);
        const newTop = item.y + (isTop ? offsetY : 0);

        const finalWidth = Math.max(50, Math.round(newWidth));
        const finalHeight = Math.max(20, Math.round(newHeight));
        const widthScale = finalWidth / item.width;

        updateItem(item.id, {
          x: Math.min(item.x + item.width - 1, Math.round(newLeft)),
          y: Math.min(item.y + item.height - 1, Math.round(newTop)),
          width: finalWidth,
          height: finalHeight,
          fontSize: item.fontSize * widthScale,
        });
      };

      const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove);
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', onPointerUp, {
        once: true,
      });
    },
    [item, scale, updateItem, type],
  );

  return <div onPointerDown={onPointerDown} style={style} />;
};

export const SelectionOutline: React.FC<{
  item: TextOverlay;
  updateItem: (id: string, updates: Partial<TextOverlay>) => void;
  setSelectedItem: (item: TimelineItemType | null) => void;
  selectedItem: TimelineItemType | null;
  isDragging: boolean;
  onSelect?: (item: TextOverlay) => void;
}> = ({ item, updateItem, setSelectedItem, selectedItem, isDragging, onSelect }) => {
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
      cursor: isSelected ? 'grab' : 'pointer',
    };
  }, [item, hovered, isDragging, isSelected, scaledBorder]);

  const startDragging = useCallback(
    (e: PointerEvent | React.MouseEvent) => {
      const initialX = e.clientX;
      const initialY = e.clientY;

      const onPointerMove = (pointerMoveEvent: PointerEvent) => {
        const offsetX = (pointerMoveEvent.clientX - initialX) / scale;
        const offsetY = (pointerMoveEvent.clientY - initialY) / scale;
        updateItem(item.id, {
          x: Math.round(item.x + offsetX),
          y: Math.round(item.y + offsetY),
        });
      };

      const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove);
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });

      window.addEventListener('pointerup', onPointerUp, {
        once: true,
      });
    },
    [item, scale, updateItem],
  );

  const onPointerDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.button !== 0) {
        return;
      }

      setSelectedItem(item);
      if (onSelect) {
        onSelect(item);
      }
      startDragging(e);
    },
    [item, setSelectedItem, onSelect, startDragging],
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
          <ResizeHandle item={item} updateItem={updateItem} type="bottom-left" />
          <ResizeHandle item={item} updateItem={updateItem} type="bottom-right" />
        </>
      ) : null}
    </div>
  );
};
