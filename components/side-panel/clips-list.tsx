'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useVideoEditor } from '@/context/video-editor-context';
import { Video, Upload, Loader2 } from 'lucide-react';
import type { UploadedClip } from '@/types';
import { Button } from '../ui/button';
import { DEFAULT_FRAMERATE } from '@/constants';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const ClipsListContent = () => {
  const { availableClips, addClipFromAvailable, addAvailableClip } =
    useVideoEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClipClick = (clip: UploadedClip) => {
    addClipFromAvailable(clip);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.error('Cloudinary environment variables not configured');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const durationInFrames = Math.round(data.duration * DEFAULT_FRAMERATE);

      const newClip: UploadedClip = {
        id: `upload-${Date.now()}`,
        name: file.name,
        sourceDuration: durationInFrames,
        src: data.secure_url
      };

      addAvailableClip(newClip);
    } catch (error) {
      console.error('Failed to upload video:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-2 space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="outline"
        className="w-full"
        onClick={handleUploadClick}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Upload className="w-4 h-4 mr-2" />
        )}
        {isUploading ? 'Uploading...' : 'Upload Video'}
      </Button>

      {availableClips.map((clip) => (
        <Button
          key={clip.id}
          variant="ghost"
          className="p-0 h-auto w-full"
          onClick={() => handleClipClick(clip)}
        >
          <Card className="p-3 hover:bg-accent cursor-pointer transition-colors w-full border-none">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                <Video className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-sm font-medium truncate">{clip.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {(clip.sourceDuration / DEFAULT_FRAMERATE).toFixed(1)}s
                </p>
              </div>
            </div>
          </Card>
        </Button>
      ))}

      {/* Keyboard shortcuts hint */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider mb-2">
          Shortcuts
        </p>
        <div className="space-y-1.5 text-xs text-muted-foreground/60">
          <div className="flex justify-between">
            <span>Play / Pause</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-muted rounded">
              Space
            </kbd>
          </div>
          <div className="flex justify-between">
            <span>Delete clip</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-muted rounded">
              Backspace
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
