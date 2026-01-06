"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export interface EditorSettings {
  vimMode: boolean;
  vimCommands: string;
  fontSize: number;
  highlightActiveLine: boolean;
  lineNumbers: boolean;
  tabSize: number;
}

const DEFAULT_SETTINGS: EditorSettings = {
  vimMode: true,
  vimCommands: "",
  fontSize: 14,
  highlightActiveLine: false,
  lineNumbers: false,
  tabSize: 4,
};

const STORAGE_KEY = "monotes-editor-settings";

interface EditorSettingsContextType {
  settings: EditorSettings;
  updateSetting: <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => void;
  isLoading: boolean;
}

const EditorSettingsContext = createContext<
  EditorSettingsContextType | undefined
>(undefined);

export function EditorSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Failed to parse editor settings", e);
      }
    }
    setMounted(true);
  }, []);

  const updateSetting = useCallback(
    <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  // Compute effective settings, disabling vim mode on mobile
  const effectiveSettings = useMemo(
    () => ({
      ...settings,
      vimMode: settings.vimMode && !isMobile,
    }),
    [settings, isMobile]
  );

  return (
    <EditorSettingsContext.Provider
      value={{
        settings: effectiveSettings,
        updateSetting,
        isLoading: !mounted,
      }}
    >
      {children}
    </EditorSettingsContext.Provider>
  );
}

export function useEditorSettings() {
  const context = useContext(EditorSettingsContext);
  if (!context) {
    throw new Error(
      "useEditorSettings must be used within an EditorSettingsProvider. " +
        "Ensure you've wrapped your app (or the relevant branch) with the provider."
    );
  }
  return context;
}
