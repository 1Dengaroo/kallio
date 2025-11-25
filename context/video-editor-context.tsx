'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo
} from 'react';
import type { Clip, TextOverlay, Scale, TimelineItemType } from '@/types';
import { PlayerRef } from '@remotion/player';
import { DEFAULT_SCALE } from '@/constants';

interface VideoEditorContextType {
  clips: Clip[];
  textOverlays: TextOverlay[];
  allTimelineItems: Array<TimelineItemType>;
  totalDuration: number;
  playerRef: React.RefObject<PlayerRef> | null;
  scale: Scale;
  selectedItem: TimelineItemType | null;
  addClip: () => void;
  addTextOverlay: () => void;
  setPlayerRef: (playerRef: React.RefObject<PlayerRef> | null) => void;
  updateItemStartAndDuration: (
    itemId: string,
    newStart: number,
    newDuration: number
  ) => void;
  updateItemRow: (itemId: string, newStart: number, newRow: number) => void;
  setScale: (scale: Scale) => void;
  setSelectedItem: (item: TimelineItemType | null) => void;
}

const VideoEditorContext = createContext<VideoEditorContextType | undefined>(
  undefined
);

export const useVideoEditor = () => {
  const context = useContext(VideoEditorContext);
  if (!context) {
    throw new Error('useVideoEditor must be used within VideoEditorProvider');
  }
  return context;
};

interface VideoEditorProviderProps {
  children: ReactNode;
}

export const VideoEditorProvider: React.FC<VideoEditorProviderProps> = ({
  children
}) => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [totalDuration, setTotalDuration] = useState(1);
  const [scale, setScale] = useState<Scale>(DEFAULT_SCALE);
  const [playerRef, setPlayerRef] = useState<React.RefObject<PlayerRef> | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<TimelineItemType | null>(
    null
  );

  const allTimelineItems = useMemo(
    () => [...clips, ...textOverlays].sort((a, b) => a.start - b.start),
    [clips, textOverlays]
  );

  const updateTotalDuration = useCallback(
    (updatedClips: Clip[], updatedTextOverlays: TextOverlay[]) => {
      const lastClipEnd = updatedClips.reduce(
        (max, clip) => Math.max(max, clip.start + clip.duration),
        0
      );
      const lastTextOverlayEnd = updatedTextOverlays.reduce(
        (max, overlay) => Math.max(max, overlay.start + overlay.duration),
        0
      );

      const newTotalDuration = Math.max(lastClipEnd, lastTextOverlayEnd);
      setTotalDuration(newTotalDuration);
    },
    []
  );

  const addClip = useCallback(() => {
    const lastItem = [...clips, ...textOverlays].reduce(
      (latest, item) =>
        item.start + item.duration > latest.start + latest.duration
          ? item
          : latest,
      { start: 0, duration: 0 }
    );

    const newClip: Clip = {
      id: `clip-${clips.length + 1}`,
      type: 'clip',
      start: lastItem.start + lastItem.duration,
      duration: 300,
      sourceDuration: 900,
      src: 'https://hgwavsootdmvmjdvfiwc.supabase.co/storage/v1/object/public/clips/reactvideoeditor-quality.mp4?t=2024-09-03T02%3A09%3A02.395Z',
      row: 0
    };

    const updatedClips = [...clips, newClip];
    setClips(updatedClips);
    updateTotalDuration(updatedClips, textOverlays);
  }, [clips, textOverlays, updateTotalDuration]);

  const addTextOverlay = useCallback(() => {
    const lastItem = [...clips, ...textOverlays].reduce(
      (latest, item) =>
        item.start + item.duration > latest.start + latest.duration
          ? item
          : latest,
      { start: 0, duration: 0 }
    );

    const newOverlay: TextOverlay = {
      id: `text-${textOverlays.length + 1}`,
      type: 'text',
      start: lastItem.start + lastItem.duration,
      duration: 100,
      text: `Text ${textOverlays.length + 1}`,
      row: 0
    };

    const updatedOverlays = [...textOverlays, newOverlay];
    setTextOverlays(updatedOverlays);
    updateTotalDuration(clips, updatedOverlays);
  }, [clips, textOverlays, updateTotalDuration]);

  const updateItemStartAndDuration = useCallback(
    (itemId: string, newStart: number, newDuration: number) => {
      // Ensure start is not negative and duration is at least 1 frame
      const clampedStart = Math.max(0, newStart);
      const clampedDuration = Math.max(1, newDuration);

      // Update the item in clips or textOverlays
      const updatedClips = clips.map((clip) =>
        clip.id === itemId
          ? { ...clip, start: clampedStart, duration: clampedDuration }
          : clip
      );
      const updatedTextOverlays = textOverlays.map((overlay) =>
        overlay.id === itemId
          ? { ...overlay, start: clampedStart, duration: clampedDuration }
          : overlay
      );

      setClips(updatedClips);
      setTextOverlays(updatedTextOverlays);
      updateTotalDuration(updatedClips, updatedTextOverlays);
    },
    [clips, textOverlays, updateTotalDuration]
  );

  const updateItemRow = useCallback(
    (itemId: string, newStart: number, newRow: number) => {
      // Ensure start is not negative and row is not negative
      const clampedStart = Math.max(0, newStart);
      const clampedRow = Math.max(0, newRow);

      // Update the item in clips or textOverlays
      const updatedClips = clips.map((clip) =>
        clip.id === itemId
          ? { ...clip, start: clampedStart, row: clampedRow }
          : clip
      );
      const updatedTextOverlays = textOverlays.map((overlay) =>
        overlay.id === itemId
          ? { ...overlay, start: clampedStart, row: clampedRow }
          : overlay
      );

      setClips(updatedClips);
      setTextOverlays(updatedTextOverlays);
      updateTotalDuration(updatedClips, updatedTextOverlays);
    },
    [clips, textOverlays, updateTotalDuration]
  );

  const value: VideoEditorContextType = {
    clips,
    textOverlays,
    allTimelineItems,
    totalDuration,
    playerRef,
    addClip,
    scale,
    selectedItem,
    addTextOverlay,
    setPlayerRef,
    updateItemStartAndDuration,
    updateItemRow,
    setScale,
    setSelectedItem
  };

  return (
    <VideoEditorContext.Provider value={value}>
      {children}
    </VideoEditorContext.Provider>
  );
};
