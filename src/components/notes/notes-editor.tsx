"use client";

import { useCallback, useEffect, useMemo } from "react";
import CodeMirror, { EditorSelection } from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView, keymap } from "@codemirror/view";
import { vim, Vim } from "@replit/codemirror-vim";
import { toast } from "sonner";
import { editorThemeExtensions } from "./notes-theme";
import { useLocalNote } from "@/hooks/useLocalNote";
import NotesMetadataBar from "./notes-metadata-bar";

export default function NotesEditor({ noteId }: { noteId?: string }) {
  const id = noteId ?? "local-default";
  const { note, setMarkdown, saveNow } = useLocalNote(id);

  const handleSave = useCallback(() => {
    saveNow();
    toast.success("Saved");
    return true;
  }, [saveNow]);

  useEffect(() => {
    Vim.defineEx("write", "w", handleSave);
  }, [handleSave]);

  const extensions = useMemo(
    () => [
      markdown(),
      vim(),
      ...editorThemeExtensions(),
      keymap.of([{ key: "Mod-s", run: handleSave, preventDefault: true }]),
    ],
    [handleSave]
  );

  if (!note) return null;

  return (
    <div className="editor-shell">
      <div className="py-12">
        <NotesMetadataBar lastEdited={note?.updatedAt} />
        <CodeMirror
          placeholder={"Start typing"}
          className="cm-container md:max-w-4xl text-xs sm:text-sm md:text-base"
          value={note?.content ?? ""}
          onChange={setMarkdown}
          extensions={extensions}
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            highlightActiveLine: false,
            bracketMatching: false,
            autocompletion: false,
            highlightSelectionMatches: false,
          }}
          onCreateEditor={(view) => {
            view.focus();
            const pos = view.state.doc.length;
            view.dispatch({
              selection: EditorSelection.cursor(pos),
              effects: EditorView.scrollIntoView(pos, { y: "center" }),
            });
          }}
        />
      </div>
    </div>
  );
}
