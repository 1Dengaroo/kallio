import type { Scale } from '@/types/types';

export const DEFAULT_SCALE: Scale = {
  unit: 60,
  zoom: 1 / 90,
  segments: 5
};

export const TIMELINE_OFFSET_X = 40;

export const PREVIEW_FRAME_WIDTH = 188;
export const DEFAULT_FRAMERATE = 60;
export const FRAME_INTERVAL = 1000 / DEFAULT_FRAMERATE;
