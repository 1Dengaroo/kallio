import type { Metadata } from 'next';
import '@/styles/globals.css';

import { Sidebar } from '@/components/nav/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { VideoEditorProvider } from '@/context/video-editor-context';
import { SidePanelProvider } from '@/context/side-panel-context';
import { PlayerDimensionsProvider } from '@/context/player-dimensions-context';

export const metadata: Metadata = {
  title: 'Kallio - Edit',
  description: 'The AI Video Editor'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <VideoEditorProvider>
      <PlayerDimensionsProvider>
        <SidePanelProvider>
          <SidebarProvider defaultOpen={false}>
            <Sidebar />
            <main className="relative w-full h-full">{children}</main>
          </SidebarProvider>
        </SidePanelProvider>
      </PlayerDimensionsProvider>
    </VideoEditorProvider>
  );
}
