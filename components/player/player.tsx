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
import { Film } from 'lucide-react';

export const VideoPlayer: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);
  const { totalDuration, setPlayerRef, clips } = useVideoEditor();
  const { playerWidth, playerHeight, compositionWidth, compositionHeight } =
    usePlayerDimensions();
  const hasContent = clips.length > 0;

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

        {/* Empty state overlay */}
        {!hasContent && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center gap-3 text-center p-6">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Film className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">Your canvas awaits</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add a clip from the sidebar to start editing
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
