import { useCallback, useEffect, useRef, useState } from "react";
import { getDB, NoteContent } from "./local-db";
import { useSyncNote } from "./cloud-notes";

const DEBOUNCE_DELAY_MS = 3 * 1000;
const SYNC_COMPLETE_MS = 3 * 1000;

/*
 * Hook to sync a single note to cloud
 */
export function useSyncNoteToCloud() {
  const syncNote = useSyncNote();

  return useCallback(
    async (noteId: string): Promise<void> => {
      const localDB = getDB();
      const note = await localDB.notes.get(noteId);

      if (!note) {
        throw new Error(`Note ${noteId} not found`);
      }

      const originalStatus = note.cloudStatus;

      try {
        console.log("Calling syncNote with note:", note.id, note.cloudStatus);
        await syncNote(note);
        console.log("Sync completed for note:", note.id);

        const finalStatus: NoteContent["cloudStatus"] =
          originalStatus === "ai-enabled" ? "ai-enabled" : "synced";

        await localDB.notes.update(noteId, { cloudStatus: finalStatus });
        console.log("Updated note status to:", finalStatus);
      } catch (error) {
        console.error("Sync error for note", noteId, ":", error);
        await localDB.notes.update(noteId, { cloudStatus: "local" });
        throw error;
      }
    },
    [syncNote]
  );
}

/*
 * Hook for debounced cloud sync of the current note
 */
export function useDebouncedCloudSync(
  noteId: string,
  content: string,
  cloudStatus: string
) {
  const syncNote = useSyncNote();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const syncCompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);
  const prevNoteIdRef = useRef(noteId);
  const prevContentRef = useRef(content);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  // Cleanup on unmount and noteId changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (syncCompleteTimeoutRef.current) {
        clearTimeout(syncCompleteTimeoutRef.current);
        syncCompleteTimeoutRef.current = null;
      }
    };
  }, [noteId]);

  const performSync = useCallback(async () => {
    if (!navigator.onLine) {
      console.log("Skipping sync - offline");
      return;
    }

    if (cloudStatus !== "synced" && cloudStatus !== "ai-enabled") {
      return;
    }

    if (isSyncingRef.current) {
      return;
    }

    // Clear any pending sync complete timeout
    if (syncCompleteTimeoutRef.current) {
      clearTimeout(syncCompleteTimeoutRef.current);
      syncCompleteTimeoutRef.current = null;
    }

    isSyncingRef.current = true;
    setIsSyncing(true);
    setSyncComplete(false);
    const localDB = getDB();

    try {
      const note = await localDB.notes.get(noteId);
      if (!note) {
        throw new Error(`Note ${noteId} not found`);
      }

      console.log(`Debounced sync: Syncing note ${noteId}`);
      await syncNote(note);
      console.log(`Debounced sync: Completed for note ${noteId}`);

      // Show completion briefly
      setIsSyncing(false);
      setSyncComplete(true);
      syncCompleteTimeoutRef.current = setTimeout(() => {
        setSyncComplete(false);
        syncCompleteTimeoutRef.current = null;
      }, SYNC_COMPLETE_MS);
    } catch (error) {
      console.error(`Debounced sync failed for note ${noteId}:`, error);
      setIsSyncing(false);
    } finally {
      isSyncingRef.current = false;
    }
  }, [noteId, cloudStatus, syncNote]);

  // Debounce sync on content changes
  useEffect(() => {
    const prevNoteId = prevNoteIdRef.current;
    const prevContent = prevContentRef.current;

    prevNoteIdRef.current = noteId;
    prevContentRef.current = content;

    // Skip sync if noteId changed (user switched notes)
    if (prevNoteId !== noteId) {
      return;
    }

    // Skip sync if content hasn't changed
    if (prevContent === content) {
      return;
    }

    // Skip sync if this looks like initial load (prev was empty, now not)
    if (prevContent === "" && content !== "") {
      return;
    }

    // Only set up debounce for syncable notes
    if (cloudStatus !== "synced" && cloudStatus !== "ai-enabled") {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      performSync();
    }, DEBOUNCE_DELAY_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [noteId, content, cloudStatus, performSync]);

  //syncNow method for immediate syncing
  const syncNow = useCallback(() => {
    // Clear pending debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    performSync();
  }, [performSync]);

  return { syncNow, isSyncing, syncComplete };
}
