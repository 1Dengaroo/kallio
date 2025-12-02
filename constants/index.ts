import type { Scale } from '@/types';

export const DEFAULT_FRAMERATE = 60;

export const DEFAULT_SCALE: Scale = {
  unit: 60,
  zoom: 1 / 270,
  segments: 1
};

// Timeline left offset in pixels
export const TIMELINE_OFFSET_X = 40;

// Timeline row height in pixels
export const TIMELINE_ROW_HEIGHT = 44;

export const PREVIEW_FRAME_WIDTH = 188;
export const FRAME_INTERVAL = 1000 / DEFAULT_FRAMERATE;

// Maximum source duration in frames (30 minutes at 60fps)
export const MAX_SOURCE_DURATION_FRAMES = 1800 * DEFAULT_FRAMERATE;

// Actions bar height in pixels
export const ACTIONS_BAR_HEIGHT = 44;

// Desktop composition and player dimensions (16:9 landscape)
export const DESKTOP_COMPOSITION_WIDTH = 1920;
export const DESKTOP_COMPOSITION_HEIGHT = 1080;
export const DESKTOP_PLAYER_WIDTH = 700;
export const DESKTOP_PLAYER_HEIGHT = 400;

// Mobile composition and player dimensions (9:16 portrait)
export const MOBILE_COMPOSITION_WIDTH = 1080;
export const MOBILE_COMPOSITION_HEIGHT = 1920;
export const MOBILE_PLAYER_WIDTH = 285;
export const MOBILE_PLAYER_HEIGHT = 500;

// Default text overlay font size
export const DEFAULT_TEXT_FONT_SIZE = 32;
