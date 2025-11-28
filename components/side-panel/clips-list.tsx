'use client';

import { Card } from '@/components/ui/card';
import { useVideoEditor } from '@/context/video-editor-context';
import { Video } from 'lucide-react';
import type { UploadedClip } from '@/types';
import { Button } from '../ui/button';

export const ClipsListContent = () => {
  const { availableClips, addClipFromAvailable } = useVideoEditor();

  const handleClipClick = (clip: UploadedClip) => {
    addClipFromAvailable(clip);
  };

  if (availableClips.length !== 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-sm text-muted-foreground">No clips uploaded</p>
        <p className="text-xs text-muted-foreground mt-1">
          Upload a video to get started
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
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
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{clip.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Duration: {(clip.sourceDuration / 30).toFixed(1)}s
                </p>
              </div>
            </div>
          </Card>
        </Button>
      ))}
    </div>
  );
};
