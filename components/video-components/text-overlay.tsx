'use client';

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface TextOverlayComponentProps {
  text: string;
}

export const TextOverlayComponent: React.FC<TextOverlayComponentProps> = ({
  text
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '64px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 0 5px black',
        opacity
      }}
    >
      {text}
    </div>
  );
};
