import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getNote, saveNote } from "@/lib/local-notes";
import type { NoteContent } from "@/lib/local-db";
import { isInCreationWhitelist } from "@/lib/creation-whitelist";

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

export function useLocalNote(slug: string) {
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
      } else if (isInCreationWhitelist(slug)) {
        // Slug is whitelisted - create temp in-memory note for lazy persistence
        const tempNote: NoteContent = {
          id: slug,
          content: "",
          updatedAt: Date.now(),
          cloudStatus: "local",
        };
        setNote(tempNote);
      } else {
        setNote(null);
      }
    })();
  }, [slug]);

  const saveNow = useCallback(
    async (content?: string) => {
      if (!note) return;
      setIsSaving(true);
      try {
        const updated = await saveNote(slug, content ?? note.content);
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
