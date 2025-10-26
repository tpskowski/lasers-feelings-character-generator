import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Library, Option } from '@/types/models';
import { defaultLibrary } from '@/lib/defaults';
import { storage } from '@/utils/storage';

export type LibraryContextValue = {
  library: Library;
  updateLibrary: (updater: (prev: Library) => Library) => void;
  showDefaults: boolean;
  setShowDefaults: (value: boolean) => void;
};

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

const mergeLibrary = (stored?: Library): Library => {
  if (!stored) return defaultLibrary;
  return {
    styles: mergeOptions(defaultLibrary.styles, stored.styles),
    roles: mergeOptions(defaultLibrary.roles, stored.roles),
    goals: mergeOptions(defaultLibrary.goals, stored.goals)
  };
};

const mergeOptions = (defaults: Option[], stored: Option[] | undefined): Option[] => {
  const storedMap = new Map((stored ?? []).map((item) => [item.id, item]));
  const mergedDefaults = defaults.map((item) => storedMap.get(item.id) ?? item);
  const custom = (stored ?? []).filter((item) => item.source === 'custom');
  return [...mergedDefaults, ...custom];
};

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [library, setLibrary] = useState<Library>(() => mergeLibrary(storage.readLibrary()));
  const [showDefaults, setShowDefaults] = useState(true);

  useEffect(() => {
    storage.saveLibrary(library);
  }, [library]);

  const updateLibrary = (updater: (prev: Library) => Library) => {
    setLibrary((prev) => updater(prev));
  };

  const value = useMemo(
    () => ({
      library,
      updateLibrary,
      showDefaults,
      setShowDefaults
    }),
    [library, showDefaults]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return ctx;
};
