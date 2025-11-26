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
  const fadeOpacity = interpolate(frame, [0, 30], [0, 1], {
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
        fontSize: `${item.fontSize}px`,
        fontFamily: item.font,
        fontWeight: item.weight,
        color: item.color,
        textShadow: `0 0 5px ${item.borderColor}`,
        opacity: fadeOpacity * item.opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        padding: '0.5em',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {item.text}
    </div>
  );
};
