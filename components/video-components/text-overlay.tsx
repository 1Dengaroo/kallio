'use client';

import { TextOverlay } from '@/types';
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface TextOverlayComponentProps {
  item: TextOverlay;
}

export const TextOverlayComponent: React.FC<TextOverlayComponentProps> = ({
  item
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '64px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 0 5px black',
        opacity
      }}
    >
      {item.text}
    </div>
  );
};
