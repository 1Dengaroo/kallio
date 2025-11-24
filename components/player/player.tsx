'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { cn } from '@/lib/utils';
import { VideoComposition } from './video-composition';
import { useVideoEditor } from '../../context/video-editor-context';
import { DEFAULT_FRAMERATE } from '@/constants';

export const VideoPlayer: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);
  const { clips, textOverlays, totalDuration, setPlayerRef } = useVideoEditor();

  const Composition = useCallback(
    () => <VideoComposition clips={clips} textOverlays={textOverlays} />,
    [clips, textOverlays]
  );

  useEffect(() => {
    setPlayerRef(playerRef as React.RefObject<PlayerRef>);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div
        className={cn(
          'shadow-lg rounded-lg overflow-hidden',
          'bg-muted/50 border'
        )}
        style={{
          width: '700px',
          height: '400px',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <Player
          ref={playerRef}
          component={Composition}
          durationInFrames={Math.max(1, totalDuration)}
          compositionWidth={1920}
          compositionHeight={1080}
          controls
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
          inputProps={{}}
        />
      </div>
    </div>
  );
};
