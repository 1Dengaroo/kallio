'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo
} from 'react';
import type {
  Clip,
  TextOverlay,
  Audio,
  Scale,
  TimelineItemType,
  UploadedClip
} from '@/types';
import { PlayerRef } from '@remotion/player';
import { DEFAULT_SCALE, DEFAULT_TEXT_FONT_SIZE } from '@/constants';
import { DEFAULT_CLIPS } from '@/lib/sample';

interface VideoEditorContextType {
  clips: Clip[];
  textOverlays: TextOverlay[];
  audioTracks: Audio[];
  allTimelineItems: Array<TimelineItemType>;
  totalDuration: number;
  playerRef: React.RefObject<PlayerRef> | null;
  scale: Scale;
  selectedItem: TimelineItemType | null;
  availableClips: UploadedClip[];
  addClip: () => void;
  addClipFromAvailable: (uploadedClip: UploadedClip) => void;
  addTextOverlay: () => void;
  addAudio: () => void;
  setPlayerRef: (playerRef: React.RefObject<PlayerRef> | null) => void;
  updateItemStartAndDuration: (
    itemId: string,
    newStart: number,
    newDuration: number
  ) => void;
  updateItemRow: (itemId: string, newStart: number, newRow: number) => void;
  setScale: (scale: Scale) => void;
  setSelectedItem: (item: TimelineItemType | null) => void;
  addAvailableClip: (clip: UploadedClip) => void;
  duplicateItem: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  splitItem: (itemId: string, splitFrame: number) => void;
  updateTextOverlayProperties: (
    itemId: string,
    properties: Partial<
      Omit<TextOverlay, 'id' | 'type' | 'start' | 'duration' | 'row'>
    >
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
  const [audioTracks, setAudioTracks] = useState<Audio[]>([]);
  const [totalDuration, setTotalDuration] = useState(1);
  const [scale, setScale] = useState<Scale>(DEFAULT_SCALE);
  const [playerRef, setPlayerRef] = useState<React.RefObject<PlayerRef> | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<TimelineItemType | null>(
    null
  );
  const [availableClips, setAvailableClips] =
    useState<UploadedClip[]>(DEFAULT_CLIPS);

  const allTimelineItems = useMemo(
    () =>
      [...clips, ...textOverlays, ...audioTracks].sort(
        (a, b) => a.start - b.start
      ),
    [clips, textOverlays, audioTracks]
  );

  const updateTotalDuration = useCallback(
    (
      updatedClips: Clip[],
      updatedTextOverlays: TextOverlay[],
      updatedAudioTracks: Audio[]
    ) => {
      const lastClipEnd = updatedClips.reduce(
        (max, clip) => Math.max(max, clip.start + clip.duration),
        0
      );
      const lastTextOverlayEnd = updatedTextOverlays.reduce(
        (max, overlay) => Math.max(max, overlay.start + overlay.duration),
        0
      );
      const lastAudioEnd = updatedAudioTracks.reduce(
        (max, audio) => Math.max(max, audio.start + audio.duration),
        0
      );

      const newTotalDuration = Math.max(
        lastClipEnd,
        lastTextOverlayEnd,
        lastAudioEnd
      );
      setTotalDuration(newTotalDuration);
    },
    []
  );

  const addClip = useCallback(() => {
    const lastItem = [...clips, ...textOverlays, ...audioTracks].reduce(
      (latest, item) =>
        item.start + item.duration > latest.start + latest.duration
          ? item
          : latest,
      { start: 0, duration: 0 }
    );

    const newClip: Clip = {
      id: `clip-${clips.length + 1}`,
      type: 'clip',
      name: `New Clip ${clips.length + 1}`,
      start: lastItem.start + lastItem.duration,
      duration: 300,
      sourceDuration: 900,
      src: 'https://hgwavsootdmvmjdvfiwc.supabase.co/storage/v1/object/public/clips/reactvideoeditor-quality.mp4?t=2024-09-03T02%3A09%3A02.395Z',
      row: 0
    };

    const updatedClips = [...clips, newClip];
    setClips(updatedClips);
    updateTotalDuration(updatedClips, textOverlays, audioTracks);
  }, [clips, textOverlays, audioTracks, updateTotalDuration]);

  const addClipFromAvailable = useCallback(
    (uploadedClip: UploadedClip) => {
      const lastItem = [...clips, ...textOverlays, ...audioTracks].reduce(
        (latest, item) =>
          item.start + item.duration > latest.start + latest.duration
            ? item
            : latest,
        { start: 0, duration: 0 }
      );

      const newClip: Clip = {
        type: 'clip',
        id: `clip-${Date.now()}`,
        name: uploadedClip.name,
        start: lastItem.start + lastItem.duration,
        duration: uploadedClip.sourceDuration,
        sourceDuration: uploadedClip.sourceDuration,
        src: uploadedClip.src,
        row: 0
      };

      const updatedClips = [...clips, newClip];
      setClips(updatedClips);
      updateTotalDuration(updatedClips, textOverlays, audioTracks);
    },
    [clips, textOverlays, audioTracks, updateTotalDuration]
  );

  const addTextOverlay = useCallback(() => {
    const lastItem = [...clips, ...textOverlays, ...audioTracks].reduce(
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
      width: 300,
      height: 100,
      x: 100,
      y: 100,
      fontSize: DEFAULT_TEXT_FONT_SIZE,
      font: 'Inter',
      color: '#ffffff',
      borderColor: '#000000',
      opacity: 1,
      weight: 400
    };

    const updatedOverlays = [...textOverlays, newOverlay];
    setTextOverlays(updatedOverlays);
    updateTotalDuration(clips, updatedOverlays, audioTracks);
  }, [clips, textOverlays, audioTracks, updateTotalDuration]);

  const addAudio = useCallback(() => {
    const lastItem = [...clips, ...textOverlays, ...audioTracks].reduce(
      (latest, item) =>
        item.start + item.duration > latest.start + latest.duration
          ? item
          : latest,
      { start: 0, duration: 0 }
    );

    const newAudio: Audio = {
      id: `audio-${audioTracks.length + 1}`,
      type: 'audio',
      name: `Audio ${audioTracks.length + 1}`,
      start: lastItem.start + lastItem.duration,
      duration: 300,
      sourceDuration: 300,
      src: 'https://cdn.designcombo.dev/audio/Hope.mp3',
      row: 0,
      volume: 1
    };

    const updatedAudio = [...audioTracks, newAudio];
    setAudioTracks(updatedAudio);
    updateTotalDuration(clips, textOverlays, updatedAudio);
  }, [clips, textOverlays, audioTracks, updateTotalDuration]);

  const updateItemStartAndDuration = useCallback(
    (itemId: string, newStart: number, newDuration: number) => {
      // Ensure start is not negative and duration is at least 1 frame
      const clampedStart = Math.max(0, newStart);
      const clampedDuration = Math.max(1, newDuration);

      // Update the item in clips, textOverlays, or audioTracks
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
      const updatedAudioTracks = audioTracks.map((audio) =>
        audio.id === itemId
          ? { ...audio, start: clampedStart, duration: clampedDuration }
          : audio
      );

      setClips(updatedClips);
      setTextOverlays(updatedTextOverlays);
      setAudioTracks(updatedAudioTracks);
      updateTotalDuration(
        updatedClips,
        updatedTextOverlays,
        updatedAudioTracks
      );

      // Update selectedItem if it's the item being updated
      if (selectedItem?.id === itemId) {
        setSelectedItem({
          ...selectedItem,
          start: clampedStart,
          duration: clampedDuration
        });
      }
    },
    [clips, textOverlays, audioTracks, updateTotalDuration, selectedItem]
  );

  const updateItemRow = useCallback(
    (itemId: string, newStart: number, newRow: number) => {
      // Ensure start is not negative, row is not negative, and both are integers
      const clampedStart = Math.round(Math.max(0, newStart));
      const clampedRow = Math.round(Math.max(0, newRow));

      // Update the item in clips, textOverlays, or audioTracks
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
      const updatedAudioTracks = audioTracks.map((audio) =>
        audio.id === itemId
          ? { ...audio, start: clampedStart, row: clampedRow }
          : audio
      );

      setClips(updatedClips);
      setTextOverlays(updatedTextOverlays);
      setAudioTracks(updatedAudioTracks);
      updateTotalDuration(
        updatedClips,
        updatedTextOverlays,
        updatedAudioTracks
      );
    },
    [clips, textOverlays, audioTracks, updateTotalDuration]
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

      if (item.type === 'clip') {
        const newClip: Clip = {
          ...item,
          id: `clip-${Date.now()}`,
          start: endPosition,
          row: 0
        };
        const updatedClips = [...clips, newClip];
        setClips(updatedClips);
        updateTotalDuration(updatedClips, textOverlays, audioTracks);
      } else if (item.type === 'text') {
        const newOverlay: TextOverlay = {
          ...item,
          id: `text-${Date.now()}`,
          start: endPosition,
          row: 0
        };
        const updatedOverlays = [...textOverlays, newOverlay];
        setTextOverlays(updatedOverlays);
        updateTotalDuration(clips, updatedOverlays, audioTracks);
      } else if (item.type === 'audio') {
        const newAudio: Audio = {
          ...item,
          id: `audio-${Date.now()}`,
          start: endPosition,
          row: 0
        };
        const updatedAudio = [...audioTracks, newAudio];
        setAudioTracks(updatedAudio);
        updateTotalDuration(clips, textOverlays, updatedAudio);
      }
    },
    [clips, textOverlays, audioTracks, allTimelineItems, updateTotalDuration]
  );

  const deleteItem = useCallback(
    (itemId: string) => {
      const updatedClips = clips.filter((clip) => clip.id !== itemId);
      const updatedTextOverlays = textOverlays.filter(
        (overlay) => overlay.id !== itemId
      );
      const updatedAudioTracks = audioTracks.filter(
        (audio) => audio.id !== itemId
      );

      setClips(updatedClips);
      setTextOverlays(updatedTextOverlays);
      setAudioTracks(updatedAudioTracks);
      updateTotalDuration(
        updatedClips,
        updatedTextOverlays,
        updatedAudioTracks
      );
      setSelectedItem(null);
    },
    [clips, textOverlays, audioTracks, updateTotalDuration]
  );

  const splitItem = useCallback(
    (itemId: string, splitFrame: number) => {
      const item = allTimelineItems.find((i) => i.id === itemId);
      if (!item) return;

      // Calculate split point relative to item start (ensure integer)
      const splitPoint = Math.round(splitFrame - item.start);

      // Ensure split point is within the item bounds
      if (splitPoint <= 0 || splitPoint >= item.duration) return;

      if (item.type === 'clip') {
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
        updateTotalDuration(updatedClips, textOverlays, audioTracks);
      } else if (item.type === 'text') {
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
        updateTotalDuration(clips, updatedOverlays, audioTracks);
      } else if (item.type === 'audio') {
        const firstPart: Audio = {
          ...item,
          duration: Math.round(splitPoint)
        };
        const secondPart: Audio = {
          ...item,
          id: `audio-${Date.now()}`,
          start: Math.round(item.start + splitPoint),
          duration: Math.round(item.duration - splitPoint)
        };

        const updatedAudio = audioTracks.map((audio) =>
          audio.id === itemId ? firstPart : audio
        );
        updatedAudio.push(secondPart);

        setAudioTracks(updatedAudio);
        updateTotalDuration(clips, textOverlays, updatedAudio);
      }
    },
    [clips, textOverlays, audioTracks, allTimelineItems, updateTotalDuration]
  );

  const updateTextOverlayProperties = useCallback(
    (
      itemId: string,
      properties: Partial<
        Omit<TextOverlay, 'id' | 'type' | 'start' | 'duration' | 'row'>
      >
    ) => {
      const updatedTextOverlays = textOverlays.map((overlay) =>
        overlay.id === itemId ? { ...overlay, ...properties } : overlay
      );
      setTextOverlays(updatedTextOverlays);

      // Update selectedItem if it's the item being updated
      if (selectedItem?.id === itemId) {
        setSelectedItem({ ...selectedItem, ...properties });
      }
    },
    [textOverlays, selectedItem]
  );

  const addAvailableClip = useCallback((clip: UploadedClip) => {
    setAvailableClips((prev) => [...prev, clip]);
  }, []);

  const value: VideoEditorContextType = {
    clips,
    textOverlays,
    audioTracks,
    allTimelineItems,
    totalDuration,
    playerRef,
    addClip,
    addClipFromAvailable,
    scale,
    selectedItem,
    availableClips,
    addTextOverlay,
    addAudio,
    setPlayerRef,
    updateItemStartAndDuration,
    updateItemRow,
    setScale,
    setSelectedItem,
    addAvailableClip,
    duplicateItem,
    deleteItem,
    splitItem,
    updateTextOverlayProperties
  };

  return (
    <VideoEditorContext.Provider value={value}>
      {children}
    </VideoEditorContext.Provider>
  );
};
