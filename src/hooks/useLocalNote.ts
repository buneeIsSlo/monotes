import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getOrCreateNote, saveNote } from "@/lib/local-notes";
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

export function useLocalNote(slug: string) {
  const [note, setNote] = useState<NoteContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const n = await getOrCreateNote(slug);
      console.log("From local", JSON.stringify(n.content));
      setNote(n);
    })();
  }, [slug]);

  const saveNow = useCallback(
    async (content?: string) => {
      if (!note) return;
      setIsSaving(true);
      try {
        const updated = await saveNote(slug, content ?? note.content);
        setNote(updated);
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
      note,
      isSaving,
      setMarkdown,
      saveNow,
    }),
    [note, isSaving, setMarkdown, saveNow]
  );
}
