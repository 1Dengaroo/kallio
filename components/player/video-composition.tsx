'use client';

import React, { useCallback, useMemo } from 'react';
import { Sequence, Html5Video, AbsoluteFill } from 'remotion';
import type {
  Clip,
  TextOverlay,
  Audio,
  TimelineItemType,
  ResizableItem
} from '@/types';
import { TextOverlayComponent } from '../video-components/text-overlay';
import { ClipComponent } from '../video-components/clip-component';
import { SelectionOutline } from '../video-components/selection-outline';

interface VideoCompositionProps {
  clips: Clip[];
  textOverlays: TextOverlay[];
  audioTracks: Audio[];
  selectedItem: TimelineItemType | null;
  setSelectedItem: (item: TimelineItemType | null) => void;
  updateResizableItemProperties: (
    item: ResizableItem,
    updates: Partial<Clip | TextOverlay>
  ) => void;
  onSelectItem: (item: ResizableItem) => void;
}

const displaySelectedItemOnTop = <T extends ResizableItem>(
  items: T[],
  selectedItem: TimelineItemType | null
): T[] => {
  const selectedItems = items.filter((item) => item.id === selectedItem?.id);
  const unselectedItems = items.filter((item) => item.id !== selectedItem?.id);

  return [...unselectedItems, ...selectedItems];
};

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  clips,
  textOverlays,
  audioTracks,
  selectedItem,
  setSelectedItem,
  updateResizableItemProperties,
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

  const resizableItems: ResizableItem[] = useMemo(
    () => [...clips, ...textOverlays],
    [clips, textOverlays]
  );

  const sortedResizableItems = useMemo(
    () => displaySelectedItemOnTop(resizableItems, selectedItem ?? null),
    [resizableItems, selectedItem]
  );

  const isDragging = useMemo(() => false, []);

  return (
    <AbsoluteFill onPointerDown={onPointerDown}>
      {/* Layers with overflow hidden */}
      <AbsoluteFill
        style={{
          overflow: 'hidden'
        }}
      >
        {[...clips, ...textOverlays, ...audioTracks].map((item) => (
          <Sequence
            key={item.id}
            from={item.start}
            durationInFrames={item.duration}
            layout="none"
          >
            <AbsoluteFill style={{ pointerEvents: 'none' }}>
              {item.type === 'clip' ? (
                <ClipComponent item={item} />
              ) : item.type === 'audio' ? (
                // Use Html5Video for audio - https://discord.com/channels/809501355504959528/817306238811111454/1106375592380743761
                <Html5Video src={item.src} volume={item.volume} />
              ) : item.type === 'text' ? (
                <TextOverlayComponent item={item} />
              ) : null}
            </AbsoluteFill>
          </Sequence>
        ))}
      </AbsoluteFill>

      {sortedResizableItems.map((item) => {
        return (
          <Sequence
            key={item.id}
            from={item.start}
            durationInFrames={item.duration}
            layout="none"
          >
            <SelectionOutline
              updateItem={updateResizableItemProperties}
              item={item}
              setSelectedItem={setSelectedItem}
              selectedItem={selectedItem}
              isDragging={isDragging}
              onSelect={onSelectItem}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
