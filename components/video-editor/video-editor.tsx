"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { Clip, TextOverlay } from "@/types/video-editor";
import { VideoComposition } from "./video-composition";
import { Timeline } from "./timeline";

export const VideoEditor: React.FC = () => {
  // State management
  const [clips, setClips] = useState<Clip[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [totalDuration, setTotalDuration] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Refs
  const playerRef = useRef<PlayerRef>(null);

  /**
   * Updates the total duration of the composition based on clips and text overlays
   */
  const updateTotalDuration = useCallback(
    (updatedClips: Clip[], updatedTextOverlays: TextOverlay[]) => {
      const lastClipEnd = updatedClips.reduce(
        (max, clip) => Math.max(max, clip.start + clip.duration),
        0
      );
      const lastTextOverlayEnd = updatedTextOverlays.reduce(
        (max, overlay) => Math.max(max, overlay.start + overlay.duration),
        0
      );

      const newTotalDuration = Math.max(lastClipEnd, lastTextOverlayEnd);
      setTotalDuration(newTotalDuration);
    },
    []
  );

  /**
   * Adds a new clip to the timeline
   */
  const addClip = useCallback(() => {
    const lastItem = [...clips, ...textOverlays].reduce(
      (latest, item) =>
        item.start + item.duration > latest.start + latest.duration
          ? item
          : latest,
      { start: 0, duration: 0 }
    );

    const newClip: Clip = {
      id: `clip-${clips.length + 1}`,
      start: lastItem.start + lastItem.duration,
      duration: 300,
      src: "https://hgwavsootdmvmjdvfiwc.supabase.co/storage/v1/object/public/clips/reactvideoeditor-quality.mp4?t=2024-09-03T02%3A09%3A02.395Z",
      row: 0,
    };

    const updatedClips = [...clips, newClip];
    setClips(updatedClips);
    updateTotalDuration(updatedClips, textOverlays);
  }, [clips, textOverlays, updateTotalDuration]);

  /**
   * Adds a new text overlay to the timeline
   */
  const addTextOverlay = useCallback(() => {
    const lastItem = [...clips, ...textOverlays].reduce(
      (latest, item) =>
        item.start + item.duration > latest.start + latest.duration
          ? item
          : latest,
      { start: 0, duration: 0 }
    );

    const newOverlay: TextOverlay = {
      id: `text-${textOverlays.length + 1}`,
      start: lastItem.start + lastItem.duration,
      duration: 100,
      text: `Text ${textOverlays.length + 1}`,
      row: 0,
    };

    const updatedOverlays = [...textOverlays, newOverlay];
    setTextOverlays(updatedOverlays);
    updateTotalDuration(clips, updatedOverlays);
  }, [clips, textOverlays, updateTotalDuration]);

  /**
   * Composition component for Remotion Player
   */
  const Composition = useCallback(
    () => (
      <VideoComposition clips={clips} textOverlays={textOverlays} />
    ),
    [clips, textOverlays]
  );

  // Effect for updating current frame
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const frame = playerRef.current.getCurrentFrame();
        if (frame !== null) {
          setCurrentFrame(frame);
        }
      }
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, []);

  // Effect for checking mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Render mobile view message if on a mobile device
  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-4">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Mobile View Not Supported</h2>
          <p className="text-muted-foreground">
            This video editor is only available on desktop or laptop devices.
          </p>
        </Card>
      </div>
    );
  }

  // Main render
  return (
    <div className="flex flex-col w-full h-screen">
      {/* Player section */}
      <div className="flex-1 overflow-hidden">
        <Card className={cn(
          "border-x-0 border-t-0 rounded-none",
          "flex-grow p-6 flex items-center justify-center overflow-hidden h-full"
        )}>
          <div className="w-full h-full flex items-center justify-center">
            <div
              className={cn(
                "shadow-lg rounded-lg overflow-hidden",
                "bg-muted/50 border"
              )}
              style={{
                width: "700px",
                height: "400px",
              }}
            >
              <Player
                ref={playerRef}
                component={Composition}
                durationInFrames={Math.max(1, totalDuration)}
                compositionWidth={1920}
                compositionHeight={1080}
                controls
                fps={30}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                renderLoading={() => (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                )}
                inputProps={{}}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Timeline section */}
      <Timeline
        clips={clips}
        textOverlays={textOverlays}
        totalDuration={totalDuration}
        currentFrame={currentFrame}
        onAddClip={addClip}
        onAddTextOverlay={addTextOverlay}
      />
    </div>
  );
};
