/*
 * Sync Engine
 * Manages automatic syncing of notes to cloud storage
 * Only syncs notes with cloudStatus: "synced" or "ai-enabled"
 */

import { useCallback, useEffect, useRef } from "react";
import { getDB, NoteContent } from "./local-db";
import { useListCloudNotes, useSyncNote, useUpdateNote } from "./cloud-notes";
import { listNotes } from "./local-notes";

const SYNC_INTERVAL_MS = 15 * 1000; // 15 seconds

/*
 * Hook to sync a single note to cloud
 * Updates cloudStatus: "local" → "syncing" → "synced"
 */

export function useSyncNoteToCloud() {
  const syncNote = useSyncNote();

  return useCallback(
    async (noteId: string): Promise<void> => {
      const localDB = getDB();
      let note = await localDB.notes.get(noteId);

      if (!note) {
        throw new Error(`Note ${noteId} not found`);
      }

      // Only sync if cloudStatus is "synced" or "ai-enabled"
      // If it's "local", we need to change it to "syncing" first
      if (note.cloudStatus === "local") {
        await localDB.notes.update(noteId, {
          cloudStatus: "syncing",
        });

        const updatedNote = await localDB.notes.get(noteId);
        if (!updatedNote) {
          throw new Error(`Note ${noteId} not found after update`);
        }
        note = updatedNote;
      }

      try {
        // Try to sync - syncNote mutation handles create vs update automatically
        // (it checks if note exists and updates or creates accordingly)
        console.log("Calling syncNote with note:", note.id, note.cloudStatus);
        await syncNote(note);
        console.log("Sync completed for note:", note.id);

        // Update status to "synced" (or keep "ai-enabled" if it was that)
        const finalStatus: NoteContent["cloudStatus"] =
          note.cloudStatus === "ai-enabled" ? "ai-enabled" : "synced";

        await localDB.notes.update(noteId, {
          cloudStatus: finalStatus,
        });
        console.log("Updated note status to:", finalStatus);
      } catch (error) {
        console.error("Sync error for note", noteId, ":", error);
        // On error, revert to "local" status
        await localDB.notes.update(noteId, {
          cloudStatus: "local",
        });
        throw error;
      }
    },
    [syncNote]
  );
}

/*
 * Hook to start auto-sync (runs every 15 seconds)
 * Only syncs notes with cloudStatus: "synced" or "ai-enabled"
 */
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
      console.log("Skipping sync - ofline");
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
            console.log(`Auto-sync: Found ${notesToSync.length} notes to sync`);
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
