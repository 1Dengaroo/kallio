'use client';

import { Card } from '@/components/ui/card';
import { useVideoEditor } from '@/context/video-editor-context';
import { Video } from 'lucide-react';
import type { UploadedClip } from '@/types';

export const ClipsList = () => {
  const { availableClips, addClipFromAvailable } = useVideoEditor();

  const handleClipClick = (clip: UploadedClip) => {
    addClipFromAvailable(clip);
  };

  return (
    <Card className="h-full rounded-none border-y-0 border-l-0 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">Uploaded Clips</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Click on a clip to add it to the timeline
        </p>
      </div>

      {/* Clips List */}
      <div className="flex-1 overflow-y-auto">
        {availableClips.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Video className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No clips uploaded</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload a video to get started
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {availableClips.map((clip) => (
              <Card
                key={clip.id}
                className="p-3 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleClipClick(clip)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">
                      {clip.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Duration: {(clip.sourceDuration / 30).toFixed(1)}s
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
