'use client';

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { VideoPlayer } from '@/components/player';
import { Timeline } from '@/components/timeline';

export default function Page() {
  return (
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
  );
}
