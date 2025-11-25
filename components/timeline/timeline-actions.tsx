'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoEditor } from '@/context/video-editor-context';
import { calculateRulerScale } from '@/utils/timeline';
import { ACTIONS_BAR_HEIGHT } from '@/constants';

export const TimelineActions = () => {
  const { scale, setScale } = useVideoEditor();

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

  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50"
      style={{ height: ACTIONS_BAR_HEIGHT }}
    >
      {/* Left side - reserved for future actions (split, delete, etc.) */}
      <div className="flex items-center gap-2">
        {/* Placeholder for future actions */}
      </div>

      {/* Right side - scale controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleZoomOut}
          title="Zoom out"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs font-mono min-w-[3rem] text-center">
          {Math.round((scale.zoom / (1 / 90)) * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleZoomIn}
          title="Zoom in"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
