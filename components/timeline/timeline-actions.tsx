'use client';

import { useEffect, useState } from 'react';
import {
  Minus,
  Plus,
  Copy,
  Scissors,
  Trash2,
  Play,
  Pause,
  Maximize,
  MonitorPlay,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoEditor } from '@/context/video-editor-context';
import {
  calculateRulerScale,
  convertFramesToTimeString
} from '@/utils/timeline';
import { ACTIONS_BAR_HEIGHT, TIMELINE_OFFSET_X } from '@/constants';
import { useCurrentPlayerFrame } from '@/hooks/use-current-frame';
import { usePlayerDimensions } from '@/context/player-dimensions-context';

export const TimelineActions = () => {
  const {
    scale,
    setScale,
    selectedItem,
    duplicateItem,
    deleteItem,
    splitItem,
    playerRef,
    totalDuration
  } = useVideoEditor();
  const currentFrame = useCurrentPlayerFrame(playerRef);
  const [isPlaying, setPlaying] = useState(false);
  const { isMobile, onViewportChange } = usePlayerDimensions();

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

  const handlePlayPause = () => {
    if (playerRef?.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  const handleFullscreen = () => {
    if (playerRef?.current) {
      playerRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    playerRef?.current?.addEventListener('play', () => {
      setPlaying(true);
    });
    playerRef?.current?.addEventListener('pause', () => {
      setPlaying(false);
    });
    return () => {
      playerRef?.current?.removeEventListener('play', () => {
        setPlaying(true);
      });
      playerRef?.current?.removeEventListener('pause', () => {
        setPlaying(false);
      });
    };
  }, [playerRef]);

  return (
    <div
      className="flex items-center justify-between py-2 border-b border-border bg-background/50"
      style={{
        height: ACTIONS_BAR_HEIGHT,
        paddingInline: TIMELINE_OFFSET_X - 4
      }}
    >
      {/* Left side - item actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleDuplicate}
          disabled={!selectedItem}
          tooltip="Duplicate selected item"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleSplit}
          disabled={!selectedItem}
          tooltip="Split selected item at playhead"
        >
          <Scissors className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleDelete}
          disabled={!selectedItem}
          tooltip="Delete selected item"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Middle - player controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handlePlayPause}
          tooltip={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </Button>
        <div className="text-xs font-mono">
          <span>{convertFramesToTimeString(currentFrame)}</span>
          <span className="text-muted-foreground"> | </span>
          <span className="text-muted-foreground">
            {convertFramesToTimeString(totalDuration)}
          </span>
        </div>
      </div>

      {/* Right side - scale controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onViewportChange(!isMobile)}
          tooltip="Toggle mobile/desktop view"
        >
          {isMobile ? (
            <MonitorPlay className="h-3.5 w-3.5" />
          ) : (
            <Smartphone className="h-3.5 w-3.5" />
          )}
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomOut}
            tooltip="Zoom out"
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
            tooltip="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleFullscreen}
          tooltip="Fullscreen"
        >
          <Maximize className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
