export interface Clip {
  id: string;
  start: number;
  duration: number;
  src: string;
  row: number;
}

export interface TextOverlay {
  id: string;
  start: number;
  duration: number;
  text: string;
  row: number;
}

export type TimelineItem = Clip | TextOverlay;

export interface Scale {
  zoom: number;
  unit: number;
  segments: number;
}
