'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode
} from 'react';
import type { Clip, TextOverlay } from '@/types/video-editor';
import { PlayerRef } from '@remotion/player';

interface VideoEditorContextType {
  clips: Clip[];
  textOverlays: TextOverlay[];
  totalDuration: number;
  playerRef: React.RefObject<PlayerRef> | null;
  addClip: () => void;
  addTextOverlay: () => void;
  setPlayerRef: (playerRef: React.RefObject<PlayerRef> | null) => void;
  reorderItems: (newOrder: Array<Clip | TextOverlay>) => void;
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
  const [playerRef, setPlayerRef] = useState<React.RefObject<PlayerRef> | null>(
    null
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
      start: lastItem.start + lastItem.duration,
      duration: 300,
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
      start: lastItem.start + lastItem.duration,
      duration: 100,
      text: `Text ${textOverlays.length + 1}`,
      row: 0
    };

    const updatedOverlays = [...textOverlays, newOverlay];
    setTextOverlays(updatedOverlays);
    updateTotalDuration(clips, updatedOverlays);
  }, [clips, textOverlays, updateTotalDuration]);

  const reorderItems = useCallback(
    (newOrder: Array<Clip | TextOverlay>) => {
      // Recalculate start times based on new order
      let currentStart = 0;
      const reorderedItems = newOrder.map((item) => {
        const updatedItem = { ...item, start: currentStart };
        currentStart += item.duration;
        return updatedItem;
      });

      // Separate clips and text overlays
      const newClips = reorderedItems.filter(
        (item): item is Clip => 'src' in item
      );
      const newTextOverlays = reorderedItems.filter(
        (item): item is TextOverlay => 'text' in item
      );

      setClips(newClips);
      setTextOverlays(newTextOverlays);
      updateTotalDuration(newClips, newTextOverlays);
    },
    [updateTotalDuration]
  );

  const value: VideoEditorContextType = {
    clips,
    textOverlays,
    totalDuration,
    playerRef,
    addClip,
    addTextOverlay,
    setPlayerRef,
    reorderItems
  };

  return (
    <VideoEditorContext.Provider value={value}>
      {children}
    </VideoEditorContext.Provider>
  );
};
