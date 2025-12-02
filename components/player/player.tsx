'use client';

import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { cn } from '@/lib/utils';
import { VideoComposition } from './video-composition';
import { useVideoEditor } from '../../context/video-editor-context';
import { DEFAULT_FRAMERATE } from '@/constants';
import { useKeyboardEvent } from '@/hooks/use-keyboard-event';
import { useSidePanel } from '@/context/side-panel-context';
import type { ResizableTimelineItem } from '@/types';
import { usePlayerDimensions } from '@/context/player-dimensions-context';

export const VideoPlayer: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);
  const { clips, textOverlays, audioTracks, totalDuration, setPlayerRef } =
    useVideoEditor();
  const { setPropertiesView } = useSidePanel();
  const { playerWidth, playerHeight, compositionWidth, compositionHeight } =
    usePlayerDimensions();

  const { selectedItem, setSelectedItem, updateResizableItemProperties } =
    useVideoEditor();

  const onSelectItem = useCallback(
    (item: ResizableTimelineItem) => {
      setPropertiesView();
    },
    [setPropertiesView]
  );

  const component = useMemo(() => VideoComposition, []);
  const inputProps = useMemo(
    () => ({
      clips,
      textOverlays,
      audioTracks,
      selectedItem,
      setSelectedItem,
      updateResizableItemProperties,
      onSelectItem
    }),
    [
      clips,
      textOverlays,
      audioTracks,
      selectedItem,
      setSelectedItem,
      updateResizableItemProperties,
      onSelectItem
    ]
  );

  const onPlayerToggle = useCallback(() => {
    if (playerRef.current) {
      if (playerRef.current.isPlaying()) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  }, []);

  useEffect(() => {
    setPlayerRef(playerRef as React.RefObject<PlayerRef>);
  }, []);

  useKeyboardEvent('keydown', 'k', (e) => {
    e.preventDefault();
    onPlayerToggle();
  });

  useKeyboardEvent('keydown', ' ', (e) => {
    e.preventDefault();
    onPlayerToggle();
  });

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div
        className={cn(
          'shadow-lg rounded-lg overflow-visible',
          'bg-muted/50 border'
        )}
        style={{
          width: `${playerWidth}px`,
          height: `${playerHeight}px`,
          position: 'relative',
          flexShrink: 0 // Prevent flex container from shrinking this element
        }}
      >
        <Player
          ref={playerRef}
          component={component}
          durationInFrames={Math.max(1, totalDuration)}
          compositionWidth={compositionWidth}
          compositionHeight={compositionHeight}
          fps={DEFAULT_FRAMERATE}
          style={{
            width: '100%',
            height: '100%'
          }}
          renderLoading={() => (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          )}
          inputProps={inputProps}
          logLevel="trace"
          overflowVisible
        />
      </div>
    </div>
  );
};
