import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate dynamic dimensions for text overlays based on fontSize and text content
 * @param text - The text content
 * @param fontSize - The font size in pixels
 * @returns Object with calculated width and height
 */
export function calculateTextOverlayDimensions(
  text: string,
  fontSize: number
): { width: number; height: number } {
  const avgCharWidth = fontSize * 0.6;
  const padding = fontSize * 0.6;

  const lines = text.split('\n');
  const numLines = Math.max(lines.length, 1);

  const longestLine = lines.reduce(
    (max, line) => (line.length > max.length ? line : max),
    ''
  );
  const textWidth = longestLine.length * avgCharWidth;
  const width = Math.max(textWidth + padding, fontSize * 3); // Minimum width

  const lineHeight = fontSize * 1.4;
  const totalTextHeight = lineHeight * numLines;
  const height = Math.max(totalTextHeight + padding, fontSize * 2); // Minimum height

  return { width, height };
}
