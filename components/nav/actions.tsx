'use client';

import { usePathname } from 'next/navigation';
import { Upload, Image, Music, Type, Video } from 'lucide-react';
import { useRef } from 'react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { useVideoEditor } from '@/context/video-editor-context';
import { useSidePanel } from '@/context/side-panel-context';
import { UploadedClip } from '@/types';

export function Actions() {
  const pathname = usePathname();
  const isProjectPage = /^\/projects\/[^\/]+$/.test(pathname);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addAvailableClip, addTextOverlay, addAudio } = useVideoEditor();
  const { setClipsView } = useSidePanel()!;

  if (!isProjectPage) {
    return null;
  }

  const handleFileUpload = async (files: File[]) => {
    // Mock upload logic
    for (const file of files) {
      const mockClip: UploadedClip = {
        id: `uploaded-${Date.now()}-${Math.random()}`,
        name: file.name,
        src: 'https://hgwavsootdmvmjdvfiwc.supabase.co/storage/v1/object/public/clips/reactvideoeditor-quality.mp4?t=2024-09-03T02%3A09%3A02.395Z',
        sourceDuration: 900
      };
      addAvailableClip(mockClip);
    }
  };

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      handleFileUpload(newFiles);
      setClipsView();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddClip = () => {
    setClipsView();
  };

  const handleAddAudio = () => {
    addAudio();
  };

  const handleAddText = () => {
    addTextOverlay();
  };

  const actions = [
    {
      name: 'Upload',
      onClick: handleUploadClick,
      icon: Upload,
      tooltip: 'Upload a video file'
    },
    {
      name: 'Add Clip',
      onClick: handleAddClip,
      icon: Video,
      tooltip: 'View uploaded clips'
    },
    {
      name: 'Add Audio',
      onClick: handleAddAudio,
      icon: Music,
      tooltip: 'Add an audio track'
    },
    {
      name: 'Add Text',
      onClick: handleAddText,
      icon: Type,
      tooltip: 'Add a text element'
    }
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Actions</SidebarGroupLabel>
      <SidebarMenu>
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="video/*"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        {actions.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton tooltip={item.tooltip} onClick={item.onClick}>
              <item.icon />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
