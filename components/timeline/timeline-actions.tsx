'use client';

import { Minus, Plus, Copy, Scissors, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useVideoEditor } from '@/context/video-editor-context';
import { calculateRulerScale } from '@/utils/timeline';
import { ACTIONS_BAR_HEIGHT, TIMELINE_OFFSET_X } from '@/constants';
import { useCurrentPlayerFrame } from '@/hooks/use-current-frame';

export const TimelineActions = () => {
  const {
    scale,
    setScale,
    selectedItem,
    duplicateItem,
    deleteItem,
    splitItem,
    playerRef
  } = useVideoEditor();
  const currentFrame = useCurrentPlayerFrame(playerRef);

  const handleZoomIn = () => {
    // Increase zoom by 20%
    const newZoom = Math.min(scale.zoom * 1.2, 1); // Cap at 1 (max zoom)
    const rulerScale = calculateRulerScale(newZoom);
    setScale({
      zoom: newZoom,
      unit: rulerScale.unit,
      segments: rulerScale.segments
    });
  };

  const handleZoomOut = () => {
    // Decrease zoom by 20%
    const newZoom = Math.max(scale.zoom * 0.8, 1 / 3600); // Min zoom (very zoomed out)
    const rulerScale = calculateRulerScale(newZoom);
    setScale({
      zoom: newZoom,
      unit: rulerScale.unit,
      segments: rulerScale.segments
    });
  };

  const handleDuplicate = () => {
    if (selectedItem) {
      duplicateItem(selectedItem.id);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      deleteItem(selectedItem.id);
    }
  };

  const handleSplit = () => {
    if (selectedItem) {
      splitItem(selectedItem.id, currentFrame);
    }
  };

  return (
    <TooltipProvider>
      <div
        className="flex items-center justify-between py-2 border-b border-border bg-background/50"
        style={{
          height: ACTIONS_BAR_HEIGHT,
          paddingInline: TIMELINE_OFFSET_X - 4
        }}
      >
        {/* Left side - item actions */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleDuplicate}
                disabled={!selectedItem}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Duplicate selected item</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleSplit}
                disabled={!selectedItem}
              >
                <Scissors className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Split selected item at playhead</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleDelete}
                disabled={!selectedItem}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected item</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right side - scale controls */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleZoomOut}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom out</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-xs font-mono min-w-[3rem] text-center">
            {Math.round((scale.zoom / (1 / 90)) * 100)}%
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleZoomIn}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom in</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
