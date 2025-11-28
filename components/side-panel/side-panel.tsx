'use client';

import { Card } from '@/components/ui/card';
import { useVideoEditor } from '@/context/video-editor-context';
import { useSidePanel } from '@/context/side-panel-context';
import { ClipsList } from './clips-list';
import { PropertiesPanel } from './properties-panel';

export const SidePanel = () => {
  const { selectedItem } = useVideoEditor();
  const { viewMode } = useSidePanel();

  if (viewMode === 'clips') {
    return <ClipsList />;
  }

  if (viewMode === 'properties' && selectedItem) {
    return <PropertiesPanel selectedItem={selectedItem} />;
  }

  return (
    <Card className="h-full rounded-none border-y-0 border-l-0 flex items-center justify-center">
      <div className="text-center text-muted-foreground p-4">
        <p className="text-sm">No item selected</p>
        <p className="text-xs mt-2">
          Select a timeline item to edit properties
        </p>
      </div>
    </Card>
  );
};
