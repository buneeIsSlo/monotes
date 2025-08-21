import { createTheme } from "@uiw/codemirror-themes";
import { EditorView } from "@codemirror/view";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

export const cmAppearanceTheme = EditorView.theme(
  {
    "&": { backgroundColor: "transparent" },
    "&.cm-editor": {
      color: "inherit",
      fontFamily: "inherit",
      outline: "none",
      border: "none",
      backgroundColor: "transparent",
    },
    ".cm-content": { color: "inherit", fontFamily: "inherit" },
    ".cm-scroller": { fontFamily: "inherit" },
    ".cm-content::after": {
      content: '""',
      display: "block",
      height: "25vh",
    },
  },
  { dark: false }
);

export const cmColorTheme = createTheme({
  theme: "light",
  settings: {
    background: "transparent",
    foreground: "var(--foreground)",
    caret: "var(--primary)",
    selection: "color-mix(in oklab, var(--primary) 20%, transparent)",
    selectionMatch: "color-mix(in oklab, var(--primary) 12%, transparent)",
    gutterBackground: "transparent",
    gutterForeground: "color-mix(in oklab, var(--foreground) 58%, transparent)",
    lineHighlight: "color-mix(in oklab, var(--primary) 8%, transparent)",
  },
  styles: [
    { tag: t.heading, fontWeight: "700", textWrap: "balance" },
    { tag: t.strong, fontWeight: "700" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.link, textDecoration: "underline", color: "var(--primary)" },
    { tag: t.quote, color: "var(--muted-foreground)" },
    { tag: t.monospace, fontFamily: "var(--font-mono)" },
  ],
});

export const cmHighlightStyles = HighlightStyle.define([
  {
    tag: t.heading1,
    fontSize: "clamp(1.125rem, calc(0.9rem + 2.2cqi), 2.25rem)",
    lineHeight: "1.2",
  },
  {
    tag: t.heading2,
    fontSize: "clamp(1rem, calc(0.9rem + 1.6cqi), 1.5rem)",
    lineHeight: "1.3",
  },
  {
    tag: t.heading3,
    fontSize: "clamp(0.9375rem, calc(0.875rem + 1.0cqi), 1.25rem)",
    lineHeight: "1.4",
  },
  {
    tag: t.monospace,
    fontFamily: "var(--font-mono)",
    backgroundColor: "color-mix(in oklab, var(--foreground) 8%, transparent)",
    padding: "0 0.25rem",
    borderRadius: "0.25rem",
  },
]);

export function editorThemeExtensions() {
  return [
    cmAppearanceTheme,
    cmColorTheme,
    EditorView.lineWrapping,
    syntaxHighlighting(cmHighlightStyles),
  ];
}
