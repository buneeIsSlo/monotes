"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  ReactNode,
} from "react";

interface NoteSyncContextValue {
  currentNoteId: string | null;
  syncNow: (() => Promise<void>) | null;
  registerSync: (noteId: string, syncFn: () => Promise<void>) => void;
  unregisterSync: () => void;
}

const NoteSyncContext = createContext<NoteSyncContextValue | undefined>(
  undefined
);

export function NoteSyncProvider({ children }: { children: ReactNode }) {
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const syncFnRef = useRef<(() => Promise<void>) | null>(null);

  // Create a stable wrapper function that always calls the latest syncFn
  const syncNow = useCallback(async () => {
    if (syncFnRef.current) {
      await syncFnRef.current();
    }
  }, []);

  const registerSync = useCallback(
    (noteId: string, syncFn: () => Promise<void>) => {
      setCurrentNoteId(noteId);
      syncFnRef.current = syncFn;
    },
    []
  );

  const unregisterSync = useCallback(() => {
    setCurrentNoteId(null);
    syncFnRef.current = null;
  }, []);

  return (
    <NoteSyncContext.Provider
      value={{ currentNoteId, syncNow, registerSync, unregisterSync }}
    >
      {children}
    </NoteSyncContext.Provider>
  );
}

export function useNoteSync() {
  const context = useContext(NoteSyncContext);
  if (context === undefined) {
    throw new Error("useNoteSync must be used within a NoteSyncProvider");
  }
  return context;
}
