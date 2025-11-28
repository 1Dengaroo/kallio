export interface BaseTimelineItem {
  id: string;
  start: number;
  /* In frames (FRAMERATE * SECONDS) */
  duration: number;
  row: number;
}

export interface ResizableTimelineItem extends BaseTimelineItem {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface Clip extends BaseTimelineItem {
  type: 'clip';
  name: string;
  /* In frames (FRAMERATE * SECONDS) */
  sourceDuration: number;
  src: string;
}

export interface UploadedClip {
  id: string;
  name: string;
  sourceDuration: number;
  src: string;
}

export interface TextOverlay extends ResizableTimelineItem {
  type: 'text';
  text: string;
  fontSize: number;
  font: string;
  color: string;
  borderColor: string;
  opacity: number;
  weight: number;
}

// Union type for all timeline items
export type TimelineItemType = Clip | TextOverlay;

export interface Scale {
  zoom: number;
  unit: number;
  segments: number;
}
