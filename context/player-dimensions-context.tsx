'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback
} from 'react';
import {
  MOBILE_PLAYER_HEIGHT,
  MOBILE_PLAYER_WIDTH,
  DESKTOP_PLAYER_HEIGHT,
  DESKTOP_PLAYER_WIDTH,
  MOBILE_COMPOSITION_WIDTH,
  MOBILE_COMPOSITION_HEIGHT,
  DESKTOP_COMPOSITION_WIDTH,
  DESKTOP_COMPOSITION_HEIGHT
} from '@/constants';

interface PlayerDimensionsContextType {
  playerWidth: number;
  playerHeight: number;
  compositionWidth: number;
  compositionHeight: number;
  isMobile: boolean;
  onViewportChange: (mobile: boolean) => void;
}

const PlayerDimensionsContext = createContext<
  PlayerDimensionsContextType | undefined
>(undefined);

export const usePlayerDimensions = () => {
  const context = useContext(PlayerDimensionsContext);
  if (!context) {
    throw new Error(
      'usePlayerDimensions must be used within PlayerDimensionsProvider'
    );
  }
  return context;
};

interface PlayerDimensionsProviderProps {
  children: ReactNode;
}

export const PlayerDimensionsProvider: React.FC<
  PlayerDimensionsProviderProps
> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  const playerWidth = useMemo(
    () => (isMobile ? MOBILE_PLAYER_WIDTH : DESKTOP_PLAYER_WIDTH),
    [isMobile]
  );

  const playerHeight = useMemo(
    () => (isMobile ? MOBILE_PLAYER_HEIGHT : DESKTOP_PLAYER_HEIGHT),
    [isMobile]
  );

  const compositionWidth = useMemo(
    () => (isMobile ? MOBILE_COMPOSITION_WIDTH : DESKTOP_COMPOSITION_WIDTH),
    [isMobile]
  );

  const compositionHeight = useMemo(
    () => (isMobile ? MOBILE_COMPOSITION_HEIGHT : DESKTOP_COMPOSITION_HEIGHT),
    [isMobile]
  );

  const onViewportChange = useCallback((mobile: boolean) => {
    setIsMobile(mobile);
  }, []);

  const value: PlayerDimensionsContextType = {
    playerWidth,
    playerHeight,
    compositionWidth,
    compositionHeight,
    isMobile,
    onViewportChange
  };

  return (
    <PlayerDimensionsContext.Provider value={value}>
      {children}
    </PlayerDimensionsContext.Provider>
  );
};
