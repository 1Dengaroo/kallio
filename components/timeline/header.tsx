import { Button } from '@/components/ui/button';
import {
  ACTIVE_CLONE,
  ACTIVE_DELETE,
  ACTIVE_SPLIT,
  TIMELINE_SCALE_CHANGED,
  dispatch
} from '@designcombo/events';
import { frameToTimeString, getCurrentTime, timeToString } from '@/utils/time';
import useStore from '@/store/store';
import {
  Copy,
  SquareSplitHorizontal,
  Trash,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { getNextZoomLevel, getPreviousZoomLevel } from '@/utils/timeline';
import { useCurrentPlayerFrame } from '@/hooks/use-current-frame';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Header = () => {
  const { duration, fps, scale, playerRef, activeIds } = useStore();
  const currentFrame = useCurrentPlayerFrame(playerRef!);

  const onZoomOutClick = () => {
    const previousZoom = getPreviousZoomLevel(scale);
    dispatch(TIMELINE_SCALE_CHANGED, {
      payload: {
        scale: previousZoom
      }
    });
  };

  const onZoomInClick = () => {
    const nextZoom = getNextZoomLevel(scale);

    dispatch(TIMELINE_SCALE_CHANGED, {
      payload: {
        scale: nextZoom
      }
    });
  };

  const doActiveClone = () => {
    dispatch(ACTIVE_CLONE);
  };

  const doActiveDelete = () => {
    dispatch(ACTIVE_DELETE);
  };

  const doActiveSplit = () => {
    dispatch(ACTIVE_SPLIT, {
      payload: {},
      options: {
        time: getCurrentTime()
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="relative h-[50px] flex-none border-t border-border">
        <div className="absolute h-[50px] w-full">
          <div className="h-[50px] w-full grid grid-cols-[1fr_200px_1fr] items-center">
            <div className="px-4 flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!activeIds.length}
                    onClick={doActiveDelete}
                    variant={'ghost'}
                    size={'icon'}
                  >
                    <Trash size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete selected items</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!activeIds.length}
                    onClick={doActiveClone}
                    variant={'ghost'}
                    size={'icon'}
                  >
                    <Copy size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Duplicate selected items</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!activeIds.length}
                    onClick={doActiveSplit}
                    variant={'ghost'}
                    size={'icon'}
                  >
                    <SquareSplitHorizontal size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Split selected items at playhead</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Badge variant="secondary" className="font-mono">
                {frameToTimeString({ frame: currentFrame }, { fps })}
              </Badge>
              <Separator orientation="vertical" className="h-4" />
              <Badge
                variant="outline"
                className="font-mono text-muted-foreground"
              >
                {timeToString({ time: duration })}
              </Badge>
            </div>

            <div className="flex justify-end items-center px-4 gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={'icon'}
                    variant={'ghost'}
                    onClick={onZoomOutClick}
                  >
                    <ZoomOut size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom out timeline</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={'icon'}
                    variant={'ghost'}
                    onClick={onZoomInClick}
                  >
                    <ZoomIn size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom in timeline</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Header;
