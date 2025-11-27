import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getNote, saveNote } from "@/lib/local-notes";
import type { NoteContent } from "@/lib/local-db";
import { isInCreationWhitelist } from "@/lib/creation-whitelist";
import { useDebounced } from "./useDebounced";

export function useLocalNote(slug: string) {
  const [note, setNote] = useState<NoteContent | null | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedContentRef = useRef<string>("");

  useEffect(() => {
    if (!slug) {
      setNote(undefined);
      return;
    }

    (async () => {
      const existing = await getNote(slug);
      if (existing) {
        setNote(existing);
        // Track the loaded content as our baseline
        lastSavedContentRef.current = existing.content;
      } else if (isInCreationWhitelist(slug)) {
        // Slug is whitelisted - create temp in-memory note for lazy persistence
        const tempNote: NoteContent = {
          id: slug,
          content: "",
          updatedAt: Date.now(),
          cloudStatus: "local",
        };
        setNote(tempNote);
        lastSavedContentRef.current = "";
      } else {
        setNote(null);
      }
    })();
  }, [slug]);

  const saveNow = useCallback(
    async (content?: string) => {
      if (!note) return;

      const contentToSave = content ?? note.content;

      // Don't save if content hasn't changed from last saved state
      if (contentToSave === lastSavedContentRef.current) {
        return;
      }

      setIsSaving(true);
      try {
        const updated = await saveNote(slug, contentToSave);
        lastSavedContentRef.current = contentToSave;
        // Only update timestamp to preserve current content and avoid race condition
        setNote((prev) =>
          prev
            ? {
                ...prev,
                updatedAt: updated.updatedAt,
              }
            : prev
        );
      } finally {
        setIsSaving(false);
      }
    },
    [note, slug]
  );

  const { debouncedFn: debouncedSave } = useDebounced(saveNow, 500);

  const setMarkdown = useCallback(
    (content: string) => {
      setNote((prev) => (prev ? { ...prev, content } : prev));

      // Always trigger debounced save to clear any pending timers
      // The actual save will be skipped if content hasn't changed
      debouncedSave(content);
    },
    [debouncedSave]
  );

  return useMemo(
    () => ({
      note,
      isLoading: note === undefined,
      isSaving,
      setMarkdown,
      saveNow,
    }),
    [note, isSaving, setMarkdown, saveNow]
  );
}
