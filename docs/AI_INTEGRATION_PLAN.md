# AI Integration Planning Document

## Current Data Structure

### Overview
All video editing state is managed through the `VideoEditorContext` (located in `/context/video-editor-context.tsx`). This context provides centralized state management for all timeline items and their properties.

---

## Data Storage Architecture

### 1. Timeline Items Storage

The context maintains three separate state arrays for different types of timeline items:

```typescript
const [clips, setClips] = useState<Clip[]>([]);
const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
const [audioTracks, setAudioTracks] = useState<Audio[]>([]);
```

These arrays are the **single source of truth** for all video editing content.

### 2. Data Type Definitions

#### Base Timeline Item
All timeline items share these common properties:

```typescript
interface BaseTimelineItem {
  id: string;                // Unique identifier
  start: number;             // Start position in frames
  duration: number;          // Length in frames
  row: number;               // Timeline track/layer number
}
```

#### Video Clips (`Clip`)
```typescript
interface Clip extends ResizableTimelineItem {
  type: 'clip';
  name: string;              // Display name
  sourceDuration: number;    // Original video length (frames)
  src: string;               // Video file URL
  volume: number;            // 0.0 to 1.0+ (can go above 100%)

  // Inherited from ResizableTimelineItem:
  width: number;             // Canvas width
  height: number;            // Canvas height
  x: number;                 // Canvas X position
  y: number;                 // Canvas Y position
}
```

**Key Points:**
- Clips are **resizable and positionable** on the canvas
- Volume control available (0.0 - 1.0 range, can exceed for boost)
- Source URL points to actual video file
- Position measured in frames (not seconds)

#### Text Overlays (`TextOverlay`)
```typescript
interface TextOverlay extends ResizableTimelineItem {
  type: 'text';
  text: string;              // Actual text content
  fontSize: number;          // Font size in pixels
  font: string;              // Font family name
  color: string;             // Text color (hex)
  borderColor: string;       // Border/outline color (hex)
  opacity: number;           // 0.0 to 1.0
  weight: number;            // Font weight (100-900)

  // Inherited from ResizableTimelineItem:
  width: number;
  height: number;
  x: number;
  y: number;
}
```

**Key Points:**
- Text overlays are **fully stylable**
- Can be positioned and resized on canvas
- Independent from video clips (overlay layer)

#### Audio Tracks (`Audio`)
```typescript
interface Audio extends BaseTimelineItem {
  type: 'audio';
  name: string;              // Display name
  sourceDuration: number;    // Original audio length (frames)
  src: string;               // Audio file URL
  volume: number;            // 0.0 to 1.0+ volume level
}
```

**Key Points:**
- Audio is **not resizable** (no canvas position)
- Only has timeline position (start, duration, row)
- Volume control available

---

## State Management APIs

### Available Context Functions

#### Create Operations
```typescript
addClip()                          // Add new video clip
addClipFromAvailable(clip)         // Add from library
addTextOverlay()                   // Add new text overlay
addAudio()                         // Add new audio track
```

#### Update Operations
```typescript
updateClipProperties(id, props)              // Update video clip
updateTextOverlayProperties(id, props)       // Update text overlay
updateAudioProperties(id, props)             // Update audio track
updateResizableItemProperties(item, props)   // Update any resizable item
updateItemStartAndDuration(id, start, dur)   // Update timeline position
updateItemRow(id, start, row)                // Update track/layer
```

#### Item Management
```typescript
duplicateItem(id)          // Clone an item
deleteItem(id)             // Remove an item
splitItem(id, frame)       // Split item at frame
```

---

## Data Flow

### Current State Access Pattern
```
User Action → Chat UI → AI Request → AI Response →
Context API Call → State Update → UI Re-render
```

### Centralized State
All state changes go through the context's setter functions:
- `setClips()`
- `setTextOverlays()`
- `setAudioTracks()`

**Important:** Direct state mutation is NOT possible - all updates must use the provided API functions.

---

## AI Integration Considerations

### What the AI Needs to Know

1. **Current Timeline State**
   - All clips with their properties
   - All text overlays with their content and styling
   - All audio tracks with their timing

2. **Available Operations**
   - Which items can be modified
   - What properties can be changed
   - Valid value ranges for each property

3. **Constraints**
   - Timing measured in frames (30 FPS by default)
   - Position coordinates relative to canvas (1920x1080)
   - Volume range (0.0 to 1.0+)

### Data Format for AI Context

The AI should receive the current state as structured JSON:

```typescript
{
  clips: Clip[],
  textOverlays: TextOverlay[],
  audioTracks: Audio[],
  totalDuration: number,  // Total video length in frames
  selectedItem: TimelineItemType | null  // Currently selected item
}
```

This provides complete context about the video project state.

---

## Next Steps for AI Integration

### Required Components

1. **AI Service Layer**
   - API endpoint for chat messages
   - Context serialization for AI
   - Response parsing and validation

2. **Action Executor**
   - Translate AI responses into context API calls
   - Validate AI-suggested changes
   - Handle errors and edge cases

3. **Chat Context Management**
   - Track conversation history
   - Include video state in prompts
   - Maintain context window

### Implementation Approach

1. Send current video state with each AI request
2. AI returns structured commands/actions
3. Frontend validates and executes actions
4. Update chat UI with results

---

## File Locations

- **Types**: `/types/index.ts`
- **Context**: `/context/video-editor-context.tsx`
- **Chat Panel**: `/components/chat/chat-panel.tsx`

---

*This document will be expanded with API design, action schemas, and implementation details in subsequent planning phases.*
