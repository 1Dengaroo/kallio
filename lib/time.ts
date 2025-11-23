/**
 * Safely gets the current frame from a player reference
 * @param playerRef - The player reference
 * @returns The current frame as a finite number, or 0 if invalid
 */
export const getSafeCurrentFrame = (playerRef: any): number => {
  try {
    if (!playerRef?.current) {
      return 0;
    }

    const frame = playerRef.current.getCurrentFrame();

    // Check if frame is a valid finite number
    if (typeof frame !== 'number' || !Number.isFinite(frame)) {
      console.warn('getCurrentFrame returned non-finite value:', frame);
      return 0;
    }

    // Ensure frame is non-negative
    return Math.max(0, frame);
  } catch (error) {
    console.error('Error getting current frame:', error);
    return 0;
  }
};
