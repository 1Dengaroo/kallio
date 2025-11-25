import {
  FRAME_INTERVAL,
  PREVIEW_FRAME_WIDTH,
  MAX_SOURCE_DURATION_FRAMES,
  DEFAULT_FRAMERATE
} from '@/constants';
import { isClip, isTextOverlay } from '@/types/guards';
import { TimelineItemType } from '@/types';

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

export const getMaxSourceDurationFrames = (item: TimelineItemType): number => {
  if (isClip(item)) {
    return item.sourceDuration;
  } else if (isTextOverlay(item)) {
    return MAX_SOURCE_DURATION_FRAMES;
  }
  return MAX_SOURCE_DURATION_FRAMES;
};

// Calculate optimal ruler scale based on zoom level
// Returns unit (in frames) and segments that maintain readable spacing
export const calculateRulerScale = (zoom: number) => {
  // Target spacing in pixels for major marks (approximately)
  const targetSpacing = 120;

  // Calculate what unit would give us the target spacing
  // spacing = unit * zoom * PREVIEW_FRAME_WIDTH
  const idealUnit = targetSpacing / (zoom * PREVIEW_FRAME_WIDTH);

  const intervals = [
    { frames: 6, segments: 5 }, // 0.1 seconds (6 frames)
    { frames: 12, segments: 5 }, // 0.2 seconds (12 frames)
    { frames: 30, segments: 5 }, // 0.5 seconds (30 frames)
    { frames: 60, segments: 5 }, // 1 second (60 frames)
    { frames: 120, segments: 5 }, // 2 seconds (120 frames)
    { frames: 300, segments: 5 }, // 5 seconds (300 frames)
    { frames: 600, segments: 5 }, // 10 seconds (600 frames)
    { frames: 1800, segments: 5 }, // 30 seconds (1800 frames)
    { frames: 3600, segments: 5 } // 1 minute (3600 frames)
  ];

  // Find the interval closest to our ideal unit
  let bestInterval = intervals[0];
  let bestDiff = Math.abs(idealUnit - intervals[0].frames);

  for (const interval of intervals) {
    const diff = Math.abs(idealUnit - interval.frames);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestInterval = interval;
    }
  }

  return {
    unit: bestInterval.frames,
    segments: bestInterval.segments
  };
};

export const convertFramesToTimeString = (
  frames: number,
  fps: number = DEFAULT_FRAMERATE
): string => {
  const totalSeconds = Math.floor(frames / fps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
