import { useCallback, useEffect, useRef, useState } from "react";
import { getDB, NoteContent } from "./local-db";
import { useSyncNote } from "./cloud-notes";
import { useDebounced } from "@/hooks/useDebounced";

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
  const syncCompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);
  const prevNoteIdRef = useRef(noteId);
  const lastSyncedContentRef = useRef<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

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

    const localDB = getDB();

    try {
      // Read note and check if content has changed before setting syncing state
      const note = await localDB.notes.get(noteId);
      if (!note) {
        throw new Error(`Note ${noteId} not found`);
      }

      // Skip sync if content hasn't changed from what was last synced
      if (note.content === lastSyncedContentRef.current) {
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

      console.log(`Debounced sync: Syncing note ${noteId}`);
      await syncNote(note);
      lastSyncedContentRef.current = note.content;
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

  const { debouncedFn: debouncedSync, cancel: cancelSync } = useDebounced(
    performSync,
    DEBOUNCE_DELAY_MS
  );

  // Initialize lastSyncedContentRef from database when note changes
  useEffect(() => {
    if (!noteId) return;

    (async () => {
      const localDB = getDB();
      const note = await localDB.notes.get(noteId);
      if (note) {
        lastSyncedContentRef.current = note.content;
      }
    })();
  }, [noteId]);

  useEffect(() => {
    const prevNoteId = prevNoteIdRef.current;
    prevNoteIdRef.current = noteId;

    // Reset baseline when switching notes - content will be initialized from DB in separate effect
    if (prevNoteId !== noteId) {
      return;
    }

    // Skip if content matches what was last synced (no changes)
    if (content === lastSyncedContentRef.current) {
      cancelSync();
      return;
    }

    // Schedule debounced sync - performSync will handle all validation
    debouncedSync();
  }, [noteId, content, debouncedSync, cancelSync]);

  // Cleanup on note change
  useEffect(() => {
    return () => {
      cancelSync();
      if (syncCompleteTimeoutRef.current) {
        clearTimeout(syncCompleteTimeoutRef.current);
        syncCompleteTimeoutRef.current = null;
      }
    };
  }, [noteId, cancelSync]);

  const syncNow = useCallback(async () => {
    cancelSync();
    await performSync();
  }, [cancelSync, performSync]);

  return { syncNow, isSyncing, syncComplete };
}
