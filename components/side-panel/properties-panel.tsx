'use client';

import { Card } from '@/components/ui/card';
import { TextOverlayProperties } from './text-overlay-properties';
import { isClip, isTextOverlay } from '@/types/guards';
import { TimelineItemType } from '@/types';

interface PropertiesPanelProps {
  selectedItem: TimelineItemType;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedItem
}) => {
  const isText = isTextOverlay(selectedItem);
  const isVideo = isClip(selectedItem);

  return (
    <Card className="h-full rounded-none border-y-0 border-l-0 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">
          {isText ? 'Text Overlay' : 'Clip'} Properties
        </h3>
      </div>

      {/* Type-specific properties */}
      {isText && <TextOverlayProperties item={selectedItem} />}

      {isVideo && (
        <div className="p-4">
          <p className="text-xs text-muted-foreground">
            No additional properties available
          </p>
        </div>
      )}

      {/* Base Info */}
      <div className="px-4 py-3 bg-muted/30 mt-auto">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div>
            <span className="text-muted-foreground">ID:</span>{' '}
            <span className="font-medium">{selectedItem.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Start:</span>{' '}
            <span className="font-medium">{selectedItem.start}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Duration:</span>{' '}
            <span className="font-medium">{selectedItem.duration}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Row:</span>{' '}
            <span className="font-medium">{selectedItem.row}</span>
          </div>
          {isVideo && (
            <div>
              <span className="text-muted-foreground">Source:</span>{' '}
              <span className="font-medium">{selectedItem.sourceDuration}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
