import { TimelineItemType, Clip, TextOverlay } from '@/types';

export function isClip(item: TimelineItemType): item is Clip {
  return item.type === 'clip';
}

export function isTextOverlay(item: TimelineItemType): item is TextOverlay {
  return item.type === 'text';
}
