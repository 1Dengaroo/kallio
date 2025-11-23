'use client';

import { Card } from '@/components/ui/card';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';

export default function Page() {
  return (
    <div className="h-screen flex flex-col">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={70} minSize={30}>
          <div className="bg-background h-full flex flex-col items-center justify-center">
            <Card className="max-w-3xl flex-1 w-full h-full flex border-0 shadow-none"></Card>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={30} minSize={20}>
          {/* {playerRef && <Timeline />} */}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
