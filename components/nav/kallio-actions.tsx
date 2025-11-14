'use client';

import { usePathname } from 'next/navigation';
import { Upload, Image, Music, Type } from 'lucide-react';
import {
  ADD_AUDIO,
  ADD_IMAGE,
  ADD_TEXT,
  ADD_VIDEO,
  dispatch
} from '@designcombo/events';
import { generateId } from '@designcombo/timeline';
import { useRef } from 'react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

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

export function KallioActions() {
  const pathname = usePathname();
  const isProjectPage = /^\/projects\/[^\/]+$/.test(pathname);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isProjectPage) {
    return null;
  }

  const handleFileUpload = async (files: File[]) => {
    const resourceId = 'VMJQit9N0hJaCAss';

    dispatch(ADD_VIDEO, {
      payload: {
        id: generateId(),
        display: {
          from: 2000,
          to: 7000
        },
        details: {
          src: URL.createObjectURL(files[0]),
          name: files[0].name
        },
        metadata: {
          resourceId
        }
      }
    });
  };

  const handleFileChange = (newFiles: File[]) => {
    handleFileUpload(newFiles);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddImage = () => {
    dispatch(ADD_IMAGE, {
      payload: {
        id: generateId(),
        details: {
          src: 'https://designcombo.imgix.net/images/sample-image.jpg',
          zIndex: 1
        }
      }
    });
  };

  const handleAddAudio = () => {
    dispatch(ADD_AUDIO, {
      payload: {
        id: generateId(),
        details: {
          src: 'https://designcombo.imgix.net/audios/stop-in-the-name-of-love.mp3',
          volume: 50
        }
      }
    });
  };

  const handleAddText = () => {
    dispatch(ADD_TEXT, {
      payload: {
        id: generateId(),
        details: {
          text: 'Remotion',
          fontSize: 142,
          fontFamily: DEFAULT_FONT.postScriptName,
          fontUrl: DEFAULT_FONT.url,
          width: 400,
          textAlign: 'left',
          color: '#ffffff',
          left: 80
        }
      }
    });
  };
  const actions = [
    {
      name: 'Upload',
      onClick: handleUploadClick,
      icon: Upload,
      tooltip: 'Upload a video file'
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
