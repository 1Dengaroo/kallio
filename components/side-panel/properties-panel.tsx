'use client';

import { TextOverlayProperties } from './text-overlay-properties';
import { isClip, isTextOverlay, isAudio } from '@/types/guards';
import { TimelineItemType } from '@/types';
import { CardFooter } from '../ui/card';

interface PropertiesPanelContentProps {
  selectedItem: TimelineItemType;
}

export const PropertiesPanelContent: React.FC<PropertiesPanelContentProps> = ({
  selectedItem
}) => {
  const isText = isTextOverlay(selectedItem);
  const isVideo = isClip(selectedItem);
  const isAudioItem = isAudio(selectedItem);

  return (
    <div className="flex flex-col h-full">
      {/* Type-specific properties */}
      {isText && <TextOverlayProperties item={selectedItem} />}

      {(isVideo || isAudioItem) && (
        <div className="p-4">
          <p className="text-xs text-muted-foreground">
            No additional properties available
          </p>
        </div>
      )}

      {/* Debug Info */}
      <CardFooter className="px-4 py-3 mt-auto">
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
          {isAudioItem && (
            <>
              <div>
                <span className="text-muted-foreground">Source:</span>{' '}
                <span className="font-medium">
                  {selectedItem.sourceDuration}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Volume:</span>{' '}
                <span className="font-medium">{selectedItem.volume}</span>
              </div>
            </>
          )}
        </div>
      </CardFooter>
    </div>
  );
};
