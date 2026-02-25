import { useRef, useEffect, useMemo, useCallback } from 'react';
import type {
  Clip,
  TextOverlay,
  ResizableItem,
  ResizableTimelineItem
} from '@/types';
import { useVideoEditor } from '@/context/video-editor-context';
import { useSidePanel } from '@/context/side-panel-context';

export function useStableInputProps() {
  const {
    clips,
    textOverlays,
    audioTracks,
    selectedItem,
    setSelectedItem,
    updateResizableItemProperties
  } = useVideoEditor();

  const { setPropertiesView } = useSidePanel();

  const onSelectItem = useCallback(
    (item: ResizableTimelineItem) => {
      setPropertiesView();
    },
    [setPropertiesView]
  );

  const clipsRef = useRef(clips);
  const textOverlaysRef = useRef(textOverlays);
  const audioTracksRef = useRef(audioTracks);
  const updateResizableItemPropertiesRef = useRef(
    updateResizableItemProperties
  );

  useEffect(() => {
    clipsRef.current = clips;
    textOverlaysRef.current = textOverlays;
    audioTracksRef.current = audioTracks;
    updateResizableItemPropertiesRef.current = updateResizableItemProperties;
  });

  return useMemo(
    () => ({
      get clips() {
        return clipsRef.current;
      },
      get textOverlays() {
        return textOverlaysRef.current;
      },
      get audioTracks() {
        return audioTracksRef.current;
      },
      selectedItem,
      setSelectedItem,
      updateResizableItemProperties: (
        item: ResizableItem,
        updates: Partial<Clip | TextOverlay>
      ) => updateResizableItemPropertiesRef.current(item, updates),
      onSelectItem
    }),
    []
  );
}
