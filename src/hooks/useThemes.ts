"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BUILT_IN_THEMES, fetchThemeFromUrl, ThemePreset } from "@/lib/themes";

const CACHE_KEY = "monotes-theme-cache";

interface ThemeCache {
  themes: Record<string, ThemePreset>;
}

interface ThemeState {
  theme: ThemePreset | null;
  isLoading: boolean;
  error: boolean;
}

export interface PreviewColors {
  primary: string;
  accent: string;
  secondary: string;
  background: string;
  muted: string;
}

interface UseThemesResult {
  themes: Map<string, ThemeState>;
  isInitialLoading: boolean;
  prefetchAll: () => Promise<void>;
  getPreviewColors: (
    themeName: string,
    mode?: "light" | "dark"
  ) => PreviewColors | null;
}

function loadCache(): ThemeCache {
  if (typeof window === "undefined") return { themes: {} };
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load theme cache", e);
  }
  return { themes: {} };
}

function saveCache(cache: ThemeCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("Failed to save theme cache", e);
  }
}

export function useThemes(): UseThemesResult {
  const [themes, setThemes] = useState<Map<string, ThemeState>>(() => {
    const cache = loadCache();
    const initial = new Map<string, ThemeState>();

    for (const builtIn of BUILT_IN_THEMES) {
      const cached = cache.themes[builtIn.name];
      initial.set(builtIn.name, {
        theme: cached || null,
        isLoading: !cached,
        error: false,
      });
    }

    return initial;
  });

  const [isInitialLoading, setIsInitialLoading] = useState(() => {
    const cache = loadCache();
    return BUILT_IN_THEMES.some((t) => !cache.themes[t.name]);
  });

  const hasFetchedRef = useRef(false);

  const prefetchAll = useCallback(async () => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const cache = loadCache();
    const themesToFetch = BUILT_IN_THEMES.filter((t) => !cache.themes[t.name]);

    if (themesToFetch.length === 0) {
      setIsInitialLoading(false);
      return;
    }

    const results = await Promise.allSettled(
      themesToFetch.map(async (builtIn) => {
        const theme = await fetchThemeFromUrl(builtIn.url);
        return { name: builtIn.name, theme };
      })
    );

    const newCache = { themes: { ...cache.themes } };

    setThemes((prev) => {
      const next = new Map(prev);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const themeName = themesToFetch[i].name;

        if (result.status === "fulfilled" && result.value.theme) {
          const { theme } = result.value;
          next.set(themeName, { theme, isLoading: false, error: false });
          newCache.themes[themeName] = theme;
        } else {
          next.set(themeName, {
            theme: null,
            isLoading: false,
            error: true,
          });
        }
      }

      return next;
    });

    saveCache(newCache);
    setIsInitialLoading(false);
  }, []);

  useEffect(() => {
    prefetchAll();
  }, [prefetchAll]);

  const getPreviewColors = useCallback(
    (themeName: string, mode?: "light" | "dark"): PreviewColors | null => {
      const state = themes.get(themeName);
      if (!state?.theme) return null;

      const { cssVarsRaw } = state.theme;

      // Get colors based on mode, falling back to light
      const modeVars =
        mode === "dark" && cssVarsRaw?.dark
          ? { ...(cssVarsRaw.theme || {}), ...cssVarsRaw.dark }
          : { ...(cssVarsRaw?.theme || {}), ...(cssVarsRaw?.light || {}) };

      return {
        primary: modeVars.primary || "",
        accent: modeVars.accent || "",
        secondary: modeVars.secondary || "",
        background: modeVars.background || "",
        muted: modeVars.muted || "",
      };
    },
    [themes]
  );

  return useMemo(
    () => ({
      themes,
      isInitialLoading,
      prefetchAll,
      getPreviewColors,
    }),
    [themes, isInitialLoading, prefetchAll, getPreviewColors]
  );
}
