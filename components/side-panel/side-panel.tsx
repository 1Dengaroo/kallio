'use client';

import { Card } from '@/components/ui/card';
import { useVideoEditor } from '@/context/video-editor-context';
import { useSidePanel } from '@/context/side-panel-context';
import { ClipsListContent } from './clips-list';
import { PropertiesPanelContent } from './properties-panel';
import { isTextOverlay, isAudio } from '@/types/guards';
import { MousePointerClick } from 'lucide-react';

export const SidePanel = () => {
  const { selectedItem } = useVideoEditor();
  const { viewMode } = useSidePanel();

  const headerInfo = () => {
    if (viewMode === 'clips') {
      return {
        title: 'Uploaded Clips',
        description: 'Click on a clip to add it to the timeline'
      };
    }

    if (viewMode === 'properties' && selectedItem) {
      const isText = isTextOverlay(selectedItem);
      const isAudioItem = isAudio(selectedItem);
      return {
        title: `${isText ? 'Text Overlay' : isAudioItem ? 'Audio' : 'Clip'} Properties`,
        description: null
      };
    }

    return null;
  };

  const header = headerInfo();

  return (
    <Card className="h-full rounded-none border-y-0 border-l-0 flex flex-col overflow-y-auto">
      {header && (
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">{header.title}</h3>
          {header.description && (
            <p className="text-xs text-muted-foreground mt-1">
              {header.description}
            </p>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {viewMode === 'clips' ? (
          <ClipsListContent />
        ) : viewMode === 'properties' && selectedItem ? (
          <PropertiesPanelContent selectedItem={selectedItem} />
        ) : (
          <div className="flex items-center justify-center h-full text-center p-6">
            <div className="flex flex-col items-center gap-4 max-w-[200px]">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <MousePointerClick className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">No item selected</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Click on a clip or text overlay in the timeline to edit its properties
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
