'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SCALE_X, SCALE_Y } from '@/constants';
import { useVideoEditor } from '@/context/video-editor-context';
import { TextOverlay } from '@/types';

interface TextOverlayPropertiesProps {
  item: TextOverlay;
}

export const TextOverlayProperties: React.FC<TextOverlayPropertiesProps> = ({
  item
}) => {
  const { updateTextOverlayProperties } = useVideoEditor();

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text" className="text-xs">
          Text
        </Label>
        <Textarea
          id="text"
          value={item.text}
          onChange={(e) =>
            updateTextOverlayProperties(item.id, {
              text: e.target.value
            })
          }
          className="min-h-[80px] resize-y"
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="fontSize" className="text-xs">
          Font Size
        </Label>
        <Input
          id="fontSize"
          type="number"
          value={item.fontSize}
          onChange={(e) =>
            updateTextOverlayProperties(item.id, {
              fontSize: Number(e.target.value)
            })
          }
          className="h-8"
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="font" className="text-xs">
          Font
        </Label>
        <Select
          value={item.font}
          onValueChange={(value) => {
            updateTextOverlayProperties(item.id, {
              font: value
            });
          }}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="weight" className="text-xs">
          Font Weight
        </Label>
        <Select
          value={item.weight.toString()}
          onValueChange={(value) =>
            updateTextOverlayProperties(item.id, {
              weight: Number(value)
            })
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100">Thin (100)</SelectItem>
            <SelectItem value="200">Extra Light (200)</SelectItem>
            <SelectItem value="300">Light (300)</SelectItem>
            <SelectItem value="400">Normal (400)</SelectItem>
            <SelectItem value="500">Medium (500)</SelectItem>
            <SelectItem value="600">Semi Bold (600)</SelectItem>
            <SelectItem value="700">Bold (700)</SelectItem>
            <SelectItem value="800">Extra Bold (800)</SelectItem>
            <SelectItem value="900">Black (900)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="color" className="text-xs">
          Text Color
        </Label>
        <div className="flex gap-2">
          <Input
            id="color"
            type="color"
            value={item.color}
            onChange={(e) =>
              updateTextOverlayProperties(item.id, {
                color: e.target.value
              })
            }
            className="h-8 w-16 p-1"
          />
          <Input
            value={item.color}
            onChange={(e) =>
              updateTextOverlayProperties(item.id, {
                color: e.target.value
              })
            }
            className="h-8 flex-1"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="borderColor" className="text-xs">
          Border Color
        </Label>
        <div className="flex gap-2">
          <Input
            id="borderColor"
            type="color"
            value={item.borderColor}
            onChange={(e) =>
              updateTextOverlayProperties(item.id, {
                borderColor: e.target.value
              })
            }
            className="h-8 w-16 p-1"
          />
          <Input
            value={item.borderColor}
            onChange={(e) =>
              updateTextOverlayProperties(item.id, {
                borderColor: e.target.value
              })
            }
            className="h-8 flex-1"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="opacity" className="text-xs">
          Opacity
        </Label>
        <Input
          id="opacity"
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={item.opacity}
          onChange={(e) =>
            updateTextOverlayProperties(item.id, {
              opacity: Number(e.target.value)
            })
          }
          className="h-8"
        />
      </div>
    </div>
  );
};
