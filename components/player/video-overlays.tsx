'use client';

import { useVideoEditor } from '../../context/video-editor-context';
import { ResizableWrapper } from '@/components/resizable-wrapper';
import { SCALE_X, SCALE_Y } from '@/constants';
import { useSidePanel } from '@/context/side-panel-context';
import { TextOverlay } from '@/types';

interface OverlaysProps {
  textOverlays: Array<TextOverlay>;
  currentFrame: number;
}

export const Overlays: React.FC<OverlaysProps> = ({
  textOverlays,
  currentFrame
}) => {
  const { setPropertiesView } = useSidePanel();
  const { updateTextOverlayProperties, selectedItem, setSelectedItem } =
    useVideoEditor();

  const visibleTextOverlays = textOverlays.filter(
    (overlay) =>
      currentFrame >= overlay.start &&
      currentFrame < overlay.start + overlay.duration
  );

  const handleSelect = (overlay: TextOverlay) => {
    setSelectedItem(overlay);
    setPropertiesView();
  };

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
            x={overlay.x * SCALE_X}
            y={overlay.y * SCALE_Y}
            width={overlay.width * SCALE_X}
            height={overlay.height * SCALE_Y}
            isSelected={selectedItem?.id === overlay.id}
            onSelect={() => handleSelect(overlay)}
            onResize={(x, y, width, height) => {
              const newWidth = width / SCALE_X;
              const newHeight = height / SCALE_Y;

              const widthScale = newWidth / overlay.width;
              const newFontSize = overlay.fontSize * widthScale;

              updateTextOverlayProperties(overlay.id, {
                x: x / SCALE_X,
                y: y / SCALE_Y,
                width: newWidth,
                height: newHeight,
                fontSize: newFontSize
              });
            }}
          >
            <div />
          </ResizableWrapper>
        );
      })}
    </div>
  );
};
