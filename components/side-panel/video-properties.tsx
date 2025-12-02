'use client';

import { useVideoEditor } from '@/context/video-editor-context';
import { Clip } from '@/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface VideoPropertiesProps {
  item: Clip;
}

export function VideoProperties({ item }: VideoPropertiesProps) {
  const { updateClipProperties } = useVideoEditor();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="volume" className="text-xs">
            Volume
          </Label>
          <span className="text-xs text-muted-foreground">
            {Math.round(item.volume * 100)}%
          </span>
        </div>
        <Slider
          id="volume"
          min={0}
          max={1}
          step={0.01}
          value={[item.volume]}
          onValueChange={(value) => {
            updateClipProperties(item.id, {
              volume: value[0]
            });
          }}
          className="w-full"
        />
      </div>
    </div>
  );
}
