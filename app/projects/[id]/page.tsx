'use client';

import {
  ADD_AUDIO,
  ADD_IMAGE,
  ADD_TEXT,
  ADD_VIDEO,
  dispatch
} from '@designcombo/events';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import Timeline from '@/components/timeline';
import { generateId } from '@designcombo/timeline';
import { Player } from '@/components/player';
import useStore from '@/store/store';
import useTimelineEvents from '@/hooks/use-timeline-events';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, Image, Music, Type } from 'lucide-react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';

export default function Page() {
  useTimelineEvents();

  const { playerRef } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileUpload = async (files: File[]) => {
    const resourceId = 'VMJQit9N0hJaCAss';

    dispatch(ADD_VIDEO, {
      payload: {
        id: resourceId,
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
          width: 400,
          textAlign: 'left',
          color: '#ffffff',
          left: 80
        }
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70} minSize={30}>
            <div className="bg-background h-full flex flex-col items-center justify-center">
              <Card className="max-w-3xl flex-1 w-full h-full flex border-0 shadow-none">
                <Player />
              </Card>
              <Separator className="my-4" />
              <div className="m-auto flex gap-2 py-4">
                <input
                  ref={fileInputRef}
                  id="file-upload-handle"
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    handleFileChange(Array.from(e.target.files || []))
                  }
                  className="hidden"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={'sm'}
                      onClick={handleClick}
                      variant={'secondary'}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload a video file</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={'sm'}
                      onClick={handleAddImage}
                      variant={'secondary'}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      Add Image
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add an image to the timeline</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={'sm'}
                      onClick={handleAddAudio}
                      variant={'secondary'}
                    >
                      <Music className="mr-2 h-4 w-4" />
                      Add Audio
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add an audio track</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={'sm'}
                      onClick={handleAddText}
                      variant={'secondary'}
                    >
                      <Type className="mr-2 h-4 w-4" />
                      Add Text
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a text element</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={30} minSize={20}>
            {playerRef && <Timeline />}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
}
