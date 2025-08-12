"use client";

import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView, keymap } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { vim, Vim } from "@replit/codemirror-vim";
import { toast } from "sonner";

const baseTheme = EditorView.theme(
  {
    "&": { backgroundColor: "transparent" },
    "&.cm-editor": {
      color: "inherit",
      fontFamily: "inherit",
      outline: "none",
      border: "none",
    },
    ".cm-content": { color: "inherit", fontFamily: "inherit" },
    ".cm-scroller": { fontFamily: "inherit" },
  },
  { dark: false }
);

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
      baseTheme,
      syntaxHighlighting(
        HighlightStyle.define([
          {
            tag: t.heading1,
            fontSize: "1.875rem",
            fontWeight: "700",
            lineHeight: "2.25rem",
          },
          {
            tag: t.heading2,
            fontSize: "1.5rem",
            fontWeight: "700",
            lineHeight: "2rem",
          },
          {
            tag: t.heading3,
            fontSize: "1.25rem",
            fontWeight: "700",
            lineHeight: "1.75rem",
          },
          { tag: t.heading, fontWeight: "700" },
          { tag: t.emphasis, fontStyle: "italic" },
          { tag: t.strong, fontWeight: "700" },
          { tag: t.link, textDecoration: "underline" },
          { tag: t.quote, color: "var(--muted-foreground)" },
          {
            tag: t.monospace,
            fontFamily: "var(--font-mono)",
            backgroundColor:
              "color-mix(in oklab, var(--foreground) 8%, transparent)",
            padding: "0 0.25rem",
            borderRadius: "0.25rem",
          },
        ])
      ),
      keymap.of([{ key: "Mod-s", run: handleSave, preventDefault: true }]),
    ],
    []
  );

  return (
    <div className="editor-shell">
      <CodeMirror
        placeholder={"Let's goo!"}
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
