'use client';

import { Card } from '@/components/ui/card';
import { useVideoEditor } from '@/context/video-editor-context';
import { useSidePanel } from '@/context/side-panel-context';
import { ClipsListContent } from './clips-list';
import { PropertiesPanelContent } from './properties-panel';
import { isTextOverlay } from '@/types/guards';

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
      return {
        title: `${isText ? 'Text Overlay' : 'Clip'} Properties`,
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
          <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
            <div>
              <p className="text-sm">No item selected</p>
              <p className="text-xs mt-2">
                Select a timeline item to edit properties
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
