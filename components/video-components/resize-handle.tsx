import React, { useCallback, useMemo } from 'react';
import { useCurrentScale } from 'remotion';
import type { ResizableItem } from '@/types';
import { isTextOverlay } from '@/types/guards';

const HANDLE_SIZE = 8;

type ResizeHandleType =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export const ResizeHandle: React.FC<{
  type: ResizeHandleType;
  item: ResizableItem;
  updateItem: (item: ResizableItem, updates: Partial<ResizableItem>) => void;
}> = ({ type, item, updateItem }) => {
  const scale = useCurrentScale();
  const size = Math.round(HANDLE_SIZE / scale);
  const borderSize = 1 / scale;

  const resizeDataRef = React.useRef<
    Partial<ResizableItem> & { fontSize?: number }
  >({});
  const isResizingRef = React.useRef(false);
  const animationFrameRef = React.useRef<number | null>(null);

  const sizeStyle: React.CSSProperties = useMemo(() => {
    return {
      position: 'absolute',
      height: size,
      width: size,
      backgroundColor: 'white',
      border: `${borderSize}px solid rgba(255, 255, 255, 0.8)`
    };
  }, [borderSize, size]);

  const margin = -size / 2 - borderSize;

  const style: React.CSSProperties = useMemo(() => {
    if (type === 'top-left') {
      return {
        ...sizeStyle,
        marginLeft: margin,
        marginTop: margin,
        cursor: 'nwse-resize'
      };
    }

    if (type === 'top-right') {
      return {
        ...sizeStyle,
        marginTop: margin,
        marginRight: margin,
        right: 0,
        cursor: 'nesw-resize'
      };
    }

    if (type === 'bottom-left') {
      return {
        ...sizeStyle,
        marginBottom: margin,
        marginLeft: margin,
        bottom: 0,
        cursor: 'nesw-resize'
      };
    }

    if (type === 'bottom-right') {
      return {
        ...sizeStyle,
        marginBottom: margin,
        marginRight: margin,
        right: 0,
        bottom: 0,
        cursor: 'nwse-resize'
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
      isResizingRef.current = true;

      const onPointerMove = (pointerMoveEvent: PointerEvent) => {
        if (!isResizingRef.current) return;

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

        const updates: Partial<ResizableItem> & { fontSize?: number } = {
          x: Math.min(item.x + item.width - 1, Math.round(newLeft)),
          y: Math.min(item.y + item.height - 1, Math.round(newTop)),
          width: finalWidth,
          height: finalHeight
        };

        // If item is TextOverlay, scale it proportionally
        if (isTextOverlay(item)) {
          updates.fontSize = item.fontSize * widthScale;
        }

        resizeDataRef.current = updates;

        if (animationFrameRef.current === null) {
          animationFrameRef.current = requestAnimationFrame(() => {
            if (isResizingRef.current) {
              updateItem(item, resizeDataRef.current);
            }
            animationFrameRef.current = null;
          });
        }
      };

      const onPointerUp = () => {
        isResizingRef.current = false;
        window.removeEventListener('pointermove', onPointerMove);

        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        updateItem(item, resizeDataRef.current);
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', onPointerUp, {
        once: true
      });
    },
    [item, scale, updateItem, type]
  );

  return <div onPointerDown={onPointerDown} style={style} />;
};
