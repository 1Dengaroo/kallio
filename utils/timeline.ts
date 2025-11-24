import { FRAME_INTERVAL, PREVIEW_FRAME_WIDTH } from '@/constants';

export const unitsToTimeMs = (units: number, zoom = 1): number => {
  const zoomedFrameWidth = PREVIEW_FRAME_WIDTH * zoom;

  const frames = units / zoomedFrameWidth;

  return frames * FRAME_INTERVAL;
};

export const formatTimelineUnit = (units?: number): string => {
  if (!units) return '0';
  const time = units / PREVIEW_FRAME_WIDTH;

  const frames = Math.trunc(time) % 60;
  const seconds = Math.trunc(time / 60) % 60;
  const minutes = Math.trunc(time / 3600) % 60;
  const hours = Math.trunc(time / 216000);
  const formattedTime = [
    hours.toString(),
    minutes.toString(),
    seconds.toString(),
    frames.toString()
  ];

  if (time < 60) {
    return `${formattedTime[3].padStart(2, '0')}f`;
  }
  if (time < 3600) {
    return `${formattedTime[2].padStart(1, '0')}s`;
  }
  if (time < 216000) {
    return `${formattedTime[1].padStart(2, '0')}:${formattedTime[2].padStart(
      2,
      '0'
    )}`;
  }
  return `${formattedTime[0].padStart(2, '0')}:${formattedTime[1].padStart(
    2,
    '0'
  )}:${formattedTime[2].padStart(2, '0')}`;
};

// Convert time (frames) to pixels using the ruler's coordinate system
export const timeToPixels = (
  timeInFrames: number,
  scaleZoom: number
): number => {
  // Match the ruler's calculation: zoomUnit = unit * zoom * PREVIEW_FRAME_WIDTH
  const pixelsPerFrame = scaleZoom * PREVIEW_FRAME_WIDTH;
  return timeInFrames * pixelsPerFrame;
};
