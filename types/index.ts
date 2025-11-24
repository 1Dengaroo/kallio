export interface BaseTimelineItem {
  id: string;
  start: number;
  /* In frames (FRAMERATE * SECONDS) */
  duration: number;
  row: number;
}
export interface Clip extends BaseTimelineItem {
  type: 'clip';
  /* In frames (FRAMERATE * SECONDS) */
  sourceDuration: number;
  src: string;
}
export interface TextOverlay extends BaseTimelineItem {
  type: 'text';
  text: string;
}

// Union type for all timeline items
export type TimelineItemType = Clip | TextOverlay;

export interface Scale {
  zoom: number;
  unit: number;
  segments: number;
}
