'use client';

import React from 'react';
import { Sequence, Html5Video } from 'remotion';
import type { Clip, TextOverlay } from '@/types/video-editor';
import { TextOverlayComponent } from './text-overlay';

interface VideoCompositionProps {
  clips: Clip[];
  textOverlays: TextOverlay[];
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  clips,
  textOverlays
}) => {
  return (
    <>
      {[...clips, ...textOverlays]
        .sort((a, b) => a.start - b.start)
        .map((item) => (
          <Sequence
            key={item.id}
            from={item.start}
            durationInFrames={item.duration}
          >
            {'src' in item ? (
              <Html5Video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
            ) : (
              <TextOverlayComponent text={item.text} />
            )}
          </Sequence>
        ))}
    </>
  );
};
