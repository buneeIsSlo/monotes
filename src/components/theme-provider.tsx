"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemePreset } from "@/lib/themes";

interface ColorThemeContextType {
  activeTheme: ThemePreset | null;
  setActiveTheme: (theme: ThemePreset | null) => void;
  isLoading: boolean;
}

const ColorThemeContext = React.createContext<ColorThemeContextType>({
  activeTheme: null,
  setActiveTheme: () => {},
  isLoading: false,
});

export const useColorTheme = () => React.useContext(ColorThemeContext);

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [activeTheme, setActiveThemeState] = React.useState<ThemePreset | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);

  // Load from local storage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("monotes-color-theme");
    if (saved) {
      try {
        setActiveThemeState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved theme", e);
      }
    }
    setIsLoading(false);
  }, []);

  const setActiveTheme = (theme: ThemePreset | null) => {
    setActiveThemeState(theme);
    if (theme) {
      localStorage.setItem("monotes-color-theme", JSON.stringify(theme));
    } else {
      localStorage.removeItem("monotes-color-theme");
    }
  };

  return (
    <NextThemesProvider {...props}>
      <ColorThemeContext.Provider
        value={{ activeTheme, setActiveTheme, isLoading }}
      >
        <ThemeInjector activeTheme={activeTheme} />
        {children}
      </ColorThemeContext.Provider>
    </NextThemesProvider>
  );
}

function ThemeInjector({ activeTheme }: { activeTheme: ThemePreset | null }) {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!activeTheme) return;

    let rawVars = activeTheme.cssVars;

    // Mixed/Dark logic
    if (resolvedTheme === "dark" && activeTheme.cssVarsRaw?.dark) {
      rawVars = {
        ...(activeTheme.cssVarsRaw.theme || {}),
        ...(activeTheme.cssVarsRaw.dark || {}),
      };
    }

    // Ensure prefixes for all paths
    const vars: Record<string, string> = {};
    Object.entries(rawVars).forEach(([key, value]) => {
      const prop = key.startsWith("--") ? key : `--${key}`;

      // Exclude font styles
      if (prop.includes("font")) return;

      vars[prop] = value;
    });

    console.table(vars);

    injectThemeVars(vars);
    return () => removeThemeVars(vars);
  }, [activeTheme, resolvedTheme]);

  return null;
}

function injectThemeVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function removeThemeVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.keys(vars).forEach((key) => {
    root.style.removeProperty(key);
  });
}
