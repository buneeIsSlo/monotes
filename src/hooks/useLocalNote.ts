import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getNote, saveNote } from "@/lib/local-notes";
import { storeNoteWithKey } from "@/lib/access";
import type { NoteContent } from "@/lib/local-db";

function useDebounced<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delayMs: number
) {
  const timer = useRef<number | null>(null);
  return useCallback(
    (...args: TArgs) => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => fn(...args), delayMs);
    },
    [fn, delayMs]
  );
}

export function useLocalNote(slug: string, accessKey?: string) {
  const [note, setNote] = useState<NoteContent | null | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNote(undefined);
      return;
    }

    (async () => {
      const existing = await getNote(slug);
      if (existing) {
        setNote(existing);
        return;
      }

      // If no existing note but we have an accessKey, create a temporary note in-memory
      if (accessKey) {
        const tempNote: NoteContent = {
          id: slug,
          content: "",
          updatedAt: Date.now(),
          accessKey,
        };
        setNote(tempNote);
        return;
      }

      setNote(null);
    })();
  }, [slug, accessKey]);

  const saveNow = useCallback(
    async (content?: string) => {
      if (!note) return;
      setIsSaving(true);
      try {
        let updated: NoteContent;
        const existing = await getNote(slug);

        if (existing) {
          // normal update
          updated = await saveNote(slug, content ?? note.content);
        } else {
          // first save = actually create in IndexedDB
          updated = await storeNoteWithKey(
            slug,
            note.accessKey ?? accessKey ?? "",
            content ?? note.content
          );
        }

        setNote(updated);
      } finally {
        setIsSaving(false);
      }
    },
    [note, slug, accessKey]
  );

  const debouncedSave = useDebounced(saveNow, 500);

  const setMarkdown = useCallback(
    (content: string) => {
      setNote((prev) => (prev ? { ...prev, content } : prev));
      debouncedSave(content);
    },
    [debouncedSave]
  );

  return useMemo(
    () => ({
      note, // undefined = loading, null = not found
      isLoading: note === undefined,
      isSaving,
      setMarkdown,
      saveNow,
    }),
    [note, isSaving, setMarkdown, saveNow]
  );
}
