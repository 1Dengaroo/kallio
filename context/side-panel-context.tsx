'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback
} from 'react';

type SidePanelViewMode = 'properties' | 'clips' | null;

interface SidePanelContextType {
  viewMode: SidePanelViewMode;
  setPropertiesView: () => void;
  setClipsView: () => void;
  setEmptyView: () => void;
}

const SidePanelContext = createContext<SidePanelContextType | null>(null);

export const useSidePanel = () => {
  const context = useContext(SidePanelContext);
  if (!context) {
    throw new Error('useSidePanel must be used within SidePanelProvider');
  }
  return context;
};

interface SidePanelProviderProps {
  children: ReactNode;
}

export const SidePanelProvider: React.FC<SidePanelProviderProps> = ({
  children
}) => {
  const [viewMode, setViewModeState] = useState<SidePanelViewMode>(null);

  const setPropertiesView = () => {
    setViewModeState('properties');
  };

  const setClipsView = () => {
    setViewModeState('clips');
  };

  const setEmptyView = () => {
    setViewModeState(null);
  };

  const value: SidePanelContextType = {
    viewMode,
    setPropertiesView,
    setClipsView,
    setEmptyView
  };

  return (
    <SidePanelContext.Provider value={value}>
      {children}
    </SidePanelContext.Provider>
  );
};
