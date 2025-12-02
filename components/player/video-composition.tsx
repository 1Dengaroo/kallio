'use client';

import { Sequence, Html5Video, AbsoluteFill } from 'remotion';
import type { Clip, TextOverlay, Audio } from '@/types';
import { TextOverlayComponent } from '../video-components/text-overlay';

interface VideoCompositionProps {
  clips: Clip[];
  textOverlays: TextOverlay[];
  audioTracks: Audio[];
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  clips,
  textOverlays,
  audioTracks
}) => {
  return (
    <>
      {[...clips, ...textOverlays, ...audioTracks].map((item) => (
        <Sequence
          key={item.id}
          from={item.start}
          durationInFrames={item.duration}
          layout="none"
        >
          <AbsoluteFill>
            {item.type === 'clip' ? (
              <Html5Video src={item.src} />
            ) : item.type === 'audio' ? (
              // Use Html5Video for audio - https://discord.com/channels/809501355504959528/817306238811111454/1106375592380743761
              <Html5Video src={item.src} />
            ) : item.type === 'text' ? (
              <TextOverlayComponent item={item} />
            ) : null}
          </AbsoluteFill>
        </Sequence>
      ))}
    </>
  );
};
