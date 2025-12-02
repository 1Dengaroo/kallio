'use client';

import { Clip } from '@/types';
import React from 'react';
import { Html5Video } from 'remotion';

interface ClipComponentProps {
  item: Clip;
}

export const ClipComponent: React.FC<ClipComponentProps> = ({ item }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        overflow: 'hidden'
      }}
    >
      <Html5Video
        src={item.src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
};
