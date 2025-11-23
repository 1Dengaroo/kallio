'use client';

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import {
  VideoEditorProvider,
  VideoPlayer,
  Timeline
} from '@/components/video-editor';

export default function Page() {
  return (
    <VideoEditorProvider>
      <div className="h-screen flex flex-col">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70} minSize={30}>
            <div className="bg-background h-full flex flex-col items-center justify-center">
              <VideoPlayer />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={30} minSize={20}>
            <Timeline />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </VideoEditorProvider>
  );
}
