import type { Scale } from '@/types';

export const DEFAULT_FRAMERATE = 60;

export const DEFAULT_SCALE: Scale = {
  unit: 60,
  zoom: 1 / 90,
  segments: 5
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

export const COMPOSITION_WIDTH = 1920;
export const COMPOSITION_HEIGHT = 1080;

// Desktop player dimensions
// export const PLAYER_WIDTH = 700;
// export const PLAYER_HEIGHT = 400;

// Mobile player dimensions
export const PLAYER_WIDTH = 300;
export const PLAYER_HEIGHT = 500;

export const SCALE_X = PLAYER_WIDTH / COMPOSITION_WIDTH;
export const SCALE_Y = PLAYER_HEIGHT / COMPOSITION_HEIGHT;

// Default text overlay font size
export const DEFAULT_TEXT_FONT_SIZE = 32;
