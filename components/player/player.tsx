'use client';

import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { cn } from '@/lib/utils';
import { VideoComposition } from './video-composition';
import { useVideoEditor } from '../../context/video-editor-context';
import { DEFAULT_FRAMERATE } from '@/constants';
import { useKeyboardEvent } from '@/hooks/use-keyboard-event';
import { useStableInputProps } from '@/hooks/use-stable-input-props';
import { usePlayerDimensions } from '@/context/player-dimensions-context';

export const VideoPlayer: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);
  const { totalDuration, setPlayerRef } = useVideoEditor();
  const { playerWidth, playerHeight, compositionWidth, compositionHeight } =
    usePlayerDimensions();

  const component = useMemo(() => VideoComposition, []);

  const inputProps = useStableInputProps();

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
          'bg-muted/50 border',
          'relative shrink-0'
        )}
        style={{
          width: `${playerWidth}px`,
          height: `${playerHeight}px`
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
          inputProps={inputProps}
          logLevel="trace"
          overflowVisible
        />
      </div>
    </div>
  );
};
