"use client";

import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { keymap } from "@codemirror/view";
import { vim, Vim } from "@replit/codemirror-vim";
import { toast } from "sonner";
import { editorThemeExtensions } from "./notes-theme";

export default function NotesEditor() {
  const [value, setValue] = useState<string>("# Monotes\n\nStart typing...");

  const handleSave = () => {
    // TODO: replace with real save later
    toast.success("Saved");
    return true;
  };

  useEffect(() => {
    Vim.defineEx("write", "w", handleSave);
  }, []);

  const extensions = useMemo(
    () => [
      markdown(),
      vim(),
      ...editorThemeExtensions(),
      keymap.of([{ key: "Mod-s", run: handleSave, preventDefault: true }]),
    ],
    []
  );

  return (
    <div className="editor-shell">
      <CodeMirror
        placeholder={"Let's goo!"}
        className="cm-container md:max-w-4xl text-xs sm:text-sm md:text-base"
        value={value}
        onChange={setValue}
        extensions={extensions}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
          bracketMatching: false,
          autocompletion: false,
          highlightSelectionMatches: false,
        }}
      />
    </div>
  );
}
