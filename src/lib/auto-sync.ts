/*
 * Auto-Sync (Legacy)
 * Global auto-sync that syncs all notes every 15 seconds
 * Kept for future use - replaced by debounced sync in sync-engine.ts
 */

/*
import { useCallback, useEffect, useRef } from "react";
import { useListCloudNotes, useSyncNote, useUpdateNote } from "./cloud-notes";
import { listNotes } from "./local-notes";

const SYNC_INTERVAL_MS = 15 * 1000; // 15 seconds

export function useAutoSync() {
  const syncNote = useSyncNote();
  const updateNote = useUpdateNote();
  const cloudNotes = useListCloudNotes();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isOnlineRef = useRef(navigator.onLine);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      isOnlineRef.current = true;
    };
    const handleOffline = () => {
      isOnlineRef.current = false;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncAllNotes = useCallback(async () => {
    if (!isOnlineRef.current) {
      console.log("Skipping sync - offline");
      return; // Skip sync if offline
    }

    const localNotes = await listNotes();

    // Only sync notes with cloudStatus: "synced" or "ai-enabled"
    const notesToSync = localNotes.filter(
      (note) =>
        note.cloudStatus === "synced" || note.cloudStatus === "ai-enabled"
    );

    console.log(`Auto-sync: Found ${notesToSync.length} notes to sync`);

    for (const note of notesToSync) {
      try {
        // Get cloud version if available
        const cloudNote = cloudNotes?.find((cn) => cn.noteId === note.id);

        if (cloudNote) {
          // Compare timestamps
          if (note.updatedAt > cloudNote.updatedAt) {
            // Local note is newer - upload
            console.log(`Auto-sync: Updating note ${note.id} (local is newer)`);
            await updateNote(note);
          }
          // If cloud note is newer, real-time subscription will handle it
        } else {
          // Note doesn't exist in cloud - initial sync
          console.log(`Auto-sync: Initial sync for note ${note.id}`);
          await syncNote(note);
        }
      } catch (error) {
        console.error(`Failed to sync note ${note.id}:`, error);
        // Continue with other notes even if one fails
      }
    }
  }, [syncNote, updateNote, cloudNotes]);

  const startAutoSync = useCallback(() => {
    if (intervalRef.current) {
      return; // Already running
    }

    // Initial sync
    syncAllNotes();

    // Set up interval
    intervalRef.current = setInterval(() => {
      syncAllNotes();
    }, SYNC_INTERVAL_MS);
  }, [syncAllNotes]);

  const stopAutoSync = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoSync();
    };
  }, [stopAutoSync]);

  return {
    startAutoSync,
    stopAutoSync,
    syncAllNotes,
    isOnline: isOnlineRef.current,
  };
}
*/
