import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCallback } from "react";
import { NoteContent } from "./local-db";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 15000;

/*
 * Retry wrapper for async functions with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = MAX_RETRIES,
  delayMs = RETRY_DELAY_MS
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Skip retry on authentication errors
      if (
        lastError.message.includes("Not authenticated") ||
        lastError.message.includes("Unauthorized")
      ) {
        throw lastError;
      }

      // If this is the last attempt, throw
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff: delayMs * 2^attempt
      const backoffDelay = delayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError || new Error("Unknown error");
}

/*
 * Hook to sync a note to cloud (upload/initial sync)
 */
export function useSyncNote() {
  const syncNoteMutation = useMutation(api.notes.syncNote);

  return useCallback(
    async (note: NoteContent): Promise<void> => {
      console.log("Syncing note to cloud:", note.id);
      await withRetry(async () => {
        await syncNoteMutation({
          noteId: note.id,
          content: note.content,
          updatedAt: note.updatedAt,
        });
      });
      console.log("Successfully synced note: ", note.id);
    },
    [syncNoteMutation]
  );
}

/*
 * Hook to update a note in cloud
 */
export function useUpdateNote() {
  const updateNoteMutation = useMutation(api.notes.updateNote);

  return useCallback(
    async (note: NoteContent): Promise<void> => {
      if (note.cloudStatus !== "synced" && note.cloudStatus !== "ai-enabled") {
        return;
      }

      await withRetry(async () => {
        await updateNoteMutation({
          noteId: note.id,
          content: note.content,
          updatedAt: note.updatedAt,
        });
      });
    },
    [updateNoteMutation]
  );
}

/*
 * Hook to get a note from cloud
 * Returns the query result - use with useQuery(api.notes.getNote, { noteId })
 */
export function useGetCloudNote(noteId: string) {
  return useQuery(api.notes.getNote, { noteId });
}

/**
 * Hook to list all user's cloud notes
 */
export function useListCloudNotes() {
  return useQuery(api.notes.listUserNotes);
}

/**
 * Hook to delete a note from cloud (soft delete)
 */
export function useDeleteCloudNote() {
  const deleteNoteMutation = useMutation(api.notes.deleteNote);

  return async (noteId: string): Promise<void> => {
    await withRetry(async () => {
      await deleteNoteMutation({ noteId });
    });
  };
}
