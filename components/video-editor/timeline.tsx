'use client';

import React, { useRef } from 'react';
import { Plus, LetterText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TimelineMarker } from './timeline-marker';
import { TimelineItem } from './timeline-item';
import { useVideoEditor } from './video-editor-context';
import { useCurrentPlayerFrame } from '@/hooks/use-current-frame';

interface TimelineProps {}

export const Timeline: React.FC<TimelineProps> = (props) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const {
    clips,
    textOverlays,
    totalDuration,
    addClip,
    addTextOverlay,
    playerRef
  } = useVideoEditor();

  const currentFrame = useCurrentPlayerFrame(playerRef);

  const onAddClip = () => {
    addClip();
  };

  const onAddTextOverlay = () => {
    addTextOverlay();
  };

  return (
    <Card className="border-t rounded-none border-x-0 border-b-0 h-full">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Timeline controls */}
        <div className="flex justify-between items-center border-b p-4">
          <div className="flex items-center space-x-2">
            <Button
              onClick={onAddClip}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Clip</span>
            </Button>
            <Button
              onClick={onAddTextOverlay}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LetterText className="h-4 w-4" />
              <span>Add Text</span>
            </Button>
          </div>
        </div>

        {/* Timeline items */}
        <div
          ref={timelineRef}
          className={cn(
            'bg-muted/30 relative flex-1',
            'border-t border-border'
          )}
        >
          <div className="absolute inset-0">
            <div className="top-10 left-0 right-0 bottom-0 overflow-x-auto overflow-y-visible p-2">
              <div
                className="gap-4"
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative'
                }}
              >
                <div className="h-10 inset-0 flex flex-col z-0">
                  <div className="flex-grow flex flex-col p-[2px]">
                    <div className="flex-grow bg-gradient-to-b from-muted to-muted/50 rounded-sm" />
                  </div>
                </div>
                {clips.map((clip, index) => (
                  <TimelineItem
                    key={clip.id}
                    item={clip}
                    type="clip"
                    index={index}
                    totalDuration={totalDuration}
                  />
                ))}
                {textOverlays.map((overlay, index) => (
                  <TimelineItem
                    key={overlay.id}
                    item={overlay}
                    type="text"
                    index={index}
                    totalDuration={totalDuration}
                  />
                ))}
              </div>
            </div>
          </div>
          <TimelineMarker
            currentFrame={currentFrame}
            totalDuration={totalDuration}
          />
        </div>
      </div>
    </Card>
  );
};
