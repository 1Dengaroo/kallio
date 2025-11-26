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
  duplicateItem: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  splitItem: (itemId: string, splitFrame: number) => void;
  updateTextOverlayTransform: (
    itemId: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fontSize: number
  ) => void;
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
      row: 0,
      width: 200,
      height: 50,
      x: 100,
      y: 100,
      fontSize: 32
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
      // Ensure start is not negative, row is not negative, and both are integers
      const clampedStart = Math.round(Math.max(0, newStart));
      const clampedRow = Math.round(Math.max(0, newRow));

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

  const duplicateItem = useCallback(
    (itemId: string) => {
      const item = allTimelineItems.find((i) => i.id === itemId);
      if (!item) return;

      // Find the end of all items to place the duplicate (ensure integer)
      const endPosition = Math.round(
        allTimelineItems.reduce(
          (max, i) => Math.max(max, i.start + i.duration),
          0
        )
      );

      if ('src' in item) {
        // It's a clip
        const newClip: Clip = {
          ...item,
          id: `clip-${Date.now()}`,
          start: endPosition,
          row: 0
        };
        const updatedClips = [...clips, newClip];
        setClips(updatedClips);
        updateTotalDuration(updatedClips, textOverlays);
      } else {
        // It's a text overlay
        const newOverlay: TextOverlay = {
          ...item,
          id: `text-${Date.now()}`,
          start: endPosition,
          row: 0
        };
        const updatedOverlays = [...textOverlays, newOverlay];
        setTextOverlays(updatedOverlays);
        updateTotalDuration(clips, updatedOverlays);
      }
    },
    [clips, textOverlays, allTimelineItems, updateTotalDuration]
  );

  const deleteItem = useCallback(
    (itemId: string) => {
      const updatedClips = clips.filter((clip) => clip.id !== itemId);
      const updatedTextOverlays = textOverlays.filter(
        (overlay) => overlay.id !== itemId
      );

      setClips(updatedClips);
      setTextOverlays(updatedTextOverlays);
      updateTotalDuration(updatedClips, updatedTextOverlays);
      setSelectedItem(null);
    },
    [clips, textOverlays, updateTotalDuration]
  );

  const splitItem = useCallback(
    (itemId: string, splitFrame: number) => {
      const item = allTimelineItems.find((i) => i.id === itemId);
      if (!item) return;

      // Calculate split point relative to item start (ensure integer)
      const splitPoint = Math.round(splitFrame - item.start);

      // Ensure split point is within the item bounds
      if (splitPoint <= 0 || splitPoint >= item.duration) return;

      if ('src' in item) {
        // It's a clip
        const firstPart: Clip = {
          ...item,
          duration: Math.round(splitPoint)
        };
        const secondPart: Clip = {
          ...item,
          id: `clip-${Date.now()}`,
          start: Math.round(item.start + splitPoint),
          duration: Math.round(item.duration - splitPoint)
        };

        const updatedClips = clips.map((clip) =>
          clip.id === itemId ? firstPart : clip
        );
        updatedClips.push(secondPart);

        setClips(updatedClips);
        updateTotalDuration(updatedClips, textOverlays);
      } else {
        // It's a text overlay
        const firstPart: TextOverlay = {
          ...item,
          duration: Math.round(splitPoint)
        };
        const secondPart: TextOverlay = {
          ...item,
          id: `text-${Date.now()}`,
          start: Math.round(item.start + splitPoint),
          duration: Math.round(item.duration - splitPoint)
        };

        const updatedOverlays = textOverlays.map((overlay) =>
          overlay.id === itemId ? firstPart : overlay
        );
        updatedOverlays.push(secondPart);

        setTextOverlays(updatedOverlays);
        updateTotalDuration(clips, updatedOverlays);
      }
    },
    [clips, textOverlays, allTimelineItems, updateTotalDuration]
  );

  const updateTextOverlayTransform = useCallback(
    (
      itemId: string,
      x: number,
      y: number,
      width: number,
      height: number,
      fontSize: number
    ) => {
      const updatedTextOverlays = textOverlays.map((overlay) =>
        overlay.id === itemId
          ? { ...overlay, x, y, width, height, fontSize }
          : overlay
      );
      setTextOverlays(updatedTextOverlays);
    },
    [textOverlays]
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
    setSelectedItem,
    duplicateItem,
    deleteItem,
    splitItem,
    updateTextOverlayTransform
  };

  return (
    <VideoEditorContext.Provider value={value}>
      {children}
    </VideoEditorContext.Provider>
  );
};
