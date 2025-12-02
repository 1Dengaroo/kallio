import { useRef, useEffect, useMemo, useCallback } from 'react';
import type {
  Clip,
  TextOverlay,
  TimelineItemType,
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
  const selectedItemRef = useRef(selectedItem);
  const setSelectedItemRef = useRef(setSelectedItem);
  const updateResizableItemPropertiesRef = useRef(
    updateResizableItemProperties
  );
  const onSelectItemRef = useRef(onSelectItem);

  useEffect(() => {
    clipsRef.current = clips;
    textOverlaysRef.current = textOverlays;
    audioTracksRef.current = audioTracks;
    selectedItemRef.current = selectedItem;
    setSelectedItemRef.current = setSelectedItem;
    updateResizableItemPropertiesRef.current = updateResizableItemProperties;
    onSelectItemRef.current = onSelectItem;
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
      get selectedItem() {
        return selectedItemRef.current;
      },
      setSelectedItem: (item: TimelineItemType | null) =>
        setSelectedItemRef.current(item),
      updateResizableItemProperties: (
        item: ResizableItem,
        updates: Partial<Clip | TextOverlay>
      ) => updateResizableItemPropertiesRef.current(item, updates),
      onSelectItem: (item: ResizableItem) => onSelectItemRef.current(item)
    }),
    []
  );
}
