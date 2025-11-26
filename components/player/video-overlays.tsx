'use client';

import { useVideoEditor } from '../../context/video-editor-context';
import { ResizableWrapper } from '@/components/resizable-wrapper';
import {
  COMPOSITION_WIDTH,
  COMPOSITION_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT
} from '@/constants';
import { TextOverlay } from '@/types';

interface OverlaysProps {
  textOverlays: Array<TextOverlay>;
  currentFrame: number;
}

export const Overlays: React.FC<OverlaysProps> = ({
  textOverlays,
  currentFrame
}) => {
  const { updateTextOverlayTransform, selectedItem, setSelectedItem } =
    useVideoEditor();

  const scaleX = PLAYER_WIDTH / COMPOSITION_WIDTH;
  const scaleY = PLAYER_HEIGHT / COMPOSITION_HEIGHT;

  const visibleTextOverlays = textOverlays.filter(
    (overlay) =>
      currentFrame >= overlay.start &&
      currentFrame < overlay.start + overlay.duration
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto'
      }}
      onClick={() => setSelectedItem(null)}
    >
      {visibleTextOverlays.map((overlay) => {
        return (
          <ResizableWrapper
            key={overlay.id}
            x={overlay.x * scaleX}
            y={overlay.y * scaleY}
            width={overlay.width * scaleX}
            height={overlay.height * scaleY}
            isSelected={selectedItem?.id === overlay.id}
            onSelect={() => setSelectedItem(overlay)}
            onResize={(x, y, width, height) => {
              const newWidth = width / scaleX;
              const newHeight = height / scaleY;

              const widthScale = newWidth / overlay.width;
              const newFontSize = overlay.fontSize * widthScale;

              updateTextOverlayTransform(
                overlay.id,
                x / scaleX,
                y / scaleY,
                newWidth,
                newHeight,
                newFontSize
              );
            }}
          >
            <div />
          </ResizableWrapper>
        );
      })}
    </div>
  );
};
