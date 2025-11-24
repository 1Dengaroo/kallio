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

export const DEFAULT_FONT = {
  id: 'font_UwdNKSyVq2iiMiuHSRRsUIOu',
  family: 'Roboto',
  fullName: 'Roboto Bold',
  postScriptName: 'Roboto-Bold',
  preview: 'https://ik.imagekit.io/lh/fonts/v2/5zQgS86djScKA0ri67BBCqW7.png',
  style: 'Roboto-Bold',
  url: 'https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf',
  category: 'sans-serif',
  createdAt: '2023-06-20T04:42:55.909Z',
  updatedAt: '2023-06-20T04:42:55.909Z',
  userId: null
};

export function Actions() {
  const pathname = usePathname();
  const isProjectPage = /^\/projects\/[^\/]+$/.test(pathname);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoEditor = useVideoEditor();

  if (!isProjectPage) {
    return null;
  }

  const handleFileUpload = async (files: File[]) => {
    const resourceId = 'VMJQit9N0hJaCAss';
  };

  const handleFileChange = (newFiles: File[]) => {
    handleFileUpload(newFiles);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddClip = () => {
    videoEditor?.addClip();
  };

  const handleAddImage = () => {};

  const handleAddAudio = () => {};

  const handleAddText = () => {
    videoEditor?.addTextOverlay();
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
      tooltip: 'Add a video clip to the timeline'
    },
    {
      name: 'Add Image',
      onClick: handleAddImage,
      icon: Image,
      tooltip: 'Add an image to the timeline'
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
