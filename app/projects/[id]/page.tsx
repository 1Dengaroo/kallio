'use client';

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { VideoPlayer } from '@/components/player';
import { Timeline } from '@/components/timeline';
import { SidePanel } from '@/components/side-panel';

export default function Page() {
  return (
    <div className="h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} collapsible>
          <SidePanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="bg-background h-full flex flex-col items-center justify-center">
                <VideoPlayer />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={40} minSize={20} collapsible>
              <Timeline />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
