'use client';

import React from 'react';
import { Sequence, Html5Video } from 'remotion';
import type { Clip, TextOverlay } from '@/types';
import { TextOverlayComponent } from '../video-components/text-overlay';

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
              <Html5Video src={item.src} />
            ) : (
              <TextOverlayComponent text={item.text} />
            )}
          </Sequence>
        ))}
    </>
  );
};
