'use client';

import React, { useCallback, useMemo } from 'react';
import { Sequence, Html5Video, AbsoluteFill } from 'remotion';
import type { Clip, TextOverlay, Audio, TimelineItemType } from '@/types';
import { TextOverlayComponent } from '../video-components/text-overlay';
import { SelectionOutline } from '../video-components/selection-outline';

interface VideoCompositionProps {
  clips: Clip[];
  textOverlays: TextOverlay[];
  audioTracks: Audio[];
  selectedItem?: TimelineItemType | null;
  setSelectedItem?: (item: TimelineItemType | null) => void;
  updateTextOverlayProperties?: (
    id: string,
    updates: Partial<TextOverlay>
  ) => void;
  onSelectItem?: (item: TextOverlay) => void;
}

const displaySelectedItemOnTop = (
  items: TextOverlay[],
  selectedItem: TimelineItemType | null
): TextOverlay[] => {
  const selectedItems = items.filter((item) => item.id === selectedItem?.id);
  const unselectedItems = items.filter((item) => item.id !== selectedItem?.id);

  return [...unselectedItems, ...selectedItems];
};

const layerContainer: React.CSSProperties = {
  overflow: 'hidden'
};

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  clips,
  textOverlays,
  audioTracks,
  selectedItem,
  setSelectedItem,
  updateTextOverlayProperties,
  onSelectItem
}) => {
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) {
        return;
      }

      if (setSelectedItem) {
        setSelectedItem(null);
      }
    },
    [setSelectedItem]
  );

  const sortedTextOverlays = useMemo(
    () => displaySelectedItemOnTop(textOverlays, selectedItem ?? null),
    [textOverlays, selectedItem]
  );

  const isDragging = useMemo(() => false, []);

  return (
    <AbsoluteFill onPointerDown={onPointerDown}>
      {/* Layers with overflow hidden */}
      <AbsoluteFill style={layerContainer}>
        {[...clips, ...textOverlays, ...audioTracks].map((item) => (
          <Sequence
            key={item.id}
            from={item.start}
            durationInFrames={item.duration}
            layout="none"
          >
            <AbsoluteFill>
              {item.type === 'clip' ? (
                <Html5Video src={item.src} />
              ) : item.type === 'audio' ? (
                // Use Html5Video for audio - https://discord.com/channels/809501355504959528/817306238811111454/1106375592380743761
                <Html5Video src={item.src} />
              ) : item.type === 'text' ? (
                <TextOverlayComponent item={item} />
              ) : null}
            </AbsoluteFill>
          </Sequence>
        ))}
      </AbsoluteFill>
      {/* Selection outlines with overflow visible */}
      {setSelectedItem &&
        updateTextOverlayProperties &&
        sortedTextOverlays.map((item) => {
          return (
            <Sequence
              key={`outline-${item.id}`}
              from={item.start}
              durationInFrames={item.duration}
              layout="none"
            >
              <SelectionOutline
                updateItem={updateTextOverlayProperties}
                item={item}
                setSelectedItem={setSelectedItem}
                selectedItem={selectedItem ?? null}
                isDragging={isDragging}
                onSelect={onSelectItem}
              />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};
