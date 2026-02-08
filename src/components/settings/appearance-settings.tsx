"use client";

import { useState } from "react";
import { Check, Loader2, RotateCcw, X } from "lucide-react";
import { useTheme } from "next-themes";
import { BUILT_IN_THEMES, fetchThemeFromUrl } from "@/lib/themes";
import { useColorTheme } from "@/components/theme-provider";
import { useThemes, PreviewColors } from "@/hooks/useThemes";
import { cn } from "@/lib/utils";
import ThemeToggeler from "@/components/theme-toggeler";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ColorPreview({ colors }: { colors: PreviewColors | null }) {
  const hasValidColors = colors && (colors.primary || colors.background);

  if (!hasValidColors) {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="size-3 rounded-full bg-muted-foreground/20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const colorList = [
    { value: colors.background, label: "Background" },
    { value: colors.primary, label: "Primary" },
    { value: colors.secondary, label: "Secondary" },
    { value: colors.accent, label: "Accent" },
    { value: colors.muted, label: "Muted" },
  ];

  return (
    <div className="flex gap-1">
      {colorList.map((color, i) => (
        <div
          key={i}
          className="size-4 rounded-full border-2 border-border"
          style={color.value ? { backgroundColor: color.value } : undefined}
          title={color.label}
        />
      ))}
    </div>
  );
}

export default function AppearanceSettings() {
  const { activeTheme, setActiveTheme } = useColorTheme();
  const {
    themes,
    customThemeNames,
    getPreviewColors,
    addCustomTheme,
    removeCustomTheme,
    existingTheme,
  } = useThemes();
  const { resolvedTheme } = useTheme();
  const [customThemeUrl, setCustomThemeUrl] = useState("");
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);
  const [error, setError] = useState("");

  const mode = resolvedTheme === "dark" ? "dark" : "light";

  const handleThemeSelect = (themeName: string) => {
    const state = themes.get(themeName);
    if (state?.theme) {
      setActiveTheme(state.theme);
    }
  };

  const handleImportTheme = async () => {
    if (!customThemeUrl) return;
    setIsLoadingCustom(true);
    setError("");
    try {
      const theme = await fetchThemeFromUrl(customThemeUrl);
      if (theme) {
        if (existingTheme(theme.name)) {
          setError("Theme with that name already exists");
          return;
        }
        addCustomTheme(theme);
        setActiveTheme(theme);
        setCustomThemeUrl("");
      } else {
        setError("Failed to load theme. Please check the URL.");
      }
    } catch (e) {
      setError("An error occurred while importing the theme.");
    } finally {
      setIsLoadingCustom(false);
    }
  };

  const handleRemoveCustomTheme = (themeName: string) => {
    // If the active theme is being removed, reset to default
    if (activeTheme?.name === themeName) {
      setActiveTheme(null);
    }
    removeCustomTheme(themeName);
  };

  // Get custom themes for display
  const customThemeEntries = Array.from(themes.entries()).filter(([name]) =>
    customThemeNames.has(name),
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Appearance Mode</Label>
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 p-3">
          <div className="text-sm text-muted-foreground">
            Switch between light, dark, and system usage.
          </div>
          <ThemeToggeler />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Theme Color</Label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <button
            onClick={() => setActiveTheme(null)}
            className={cn(
              "group relative flex aspect-[1.6] flex-col items-start justify-between rounded-lg border-2 p-3 transition-all hover:bg-accent/50",
              activeTheme === null
                ? "border-primary"
                : "border-border/50 hover:border-border",
            )}
          >
            <div className="flex w-full justify-between">
              <RotateCcw className="size-4 text-muted-foreground" />
              {activeTheme === null && (
                <div className="rounded-full bg-primary p-0.5 text-primary-foreground shadow-sm">
                  <Check className="size-3" />
                </div>
              )}
            </div>
            <span className="text-xs font-medium">Default</span>
          </button>

          {BUILT_IN_THEMES.map((theme) => {
            const isActive = activeTheme?.name === theme.name;
            const state = themes.get(theme.name);
            const previewColors = getPreviewColors(theme.name, mode);

            return (
              <button
                key={theme.name}
                onClick={() => handleThemeSelect(theme.name)}
                disabled={state?.isLoading}
                className={cn(
                  "group relative flex aspect-[1.6] flex-col items-start justify-between rounded-lg border-2 p-3 transition-all hover:bg-accent/50",
                  isActive
                    ? "border-primary"
                    : "border-border/50 hover:border-border",
                  state?.isLoading && "opacity-70 cursor-wait",
                )}
              >
                <div className="flex w-full justify-between">
                  <ColorPreview colors={previewColors} />
                  {isActive && (
                    <div className="rounded-full bg-primary p-0.5 text-primary-foreground shadow-sm">
                      <Check className="size-3" />
                    </div>
                  )}
                </div>

                <span className="text-xs font-medium text-left line-clamp-1 w-full">
                  {theme.name}
                </span>

                {state?.isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/50">
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                )}

                {state?.error && !state.theme && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-destructive/10">
                    <span className="text-xs text-destructive">Failed</span>
                  </div>
                )}
              </button>
            );
          })}

          {/* Custom Imported Themes */}
          {customThemeEntries.map(([themeName, state]) => {
            const isActive = activeTheme?.name === themeName;
            const previewColors = getPreviewColors(themeName, mode);

            return (
              <div key={themeName} className="relative">
                <button
                  onClick={() => handleThemeSelect(themeName)}
                  className={cn(
                    "group relative flex aspect-[1.6] w-full flex-col items-start justify-between rounded-lg border-2 p-3 transition-all hover:bg-accent/50",
                    isActive
                      ? "border-primary"
                      : "border-border/50 hover:border-border",
                  )}
                >
                  <div className="flex w-full justify-between">
                    <ColorPreview colors={previewColors} />
                    {isActive && (
                      <div className="rounded-full bg-primary p-0.5 text-primary-foreground shadow-sm">
                        <Check className="size-3" />
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-medium text-left line-clamp-1 w-full pr-5">
                    {state.theme?.name || themeName}
                  </span>
                </button>

                {/* Remove button for custom themes */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCustomTheme(themeName);
                  }}
                  className="absolute bottom-3 right-3 rounded-full p-0.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                  title="Remove theme"
                >
                  <X className="size-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Custom Theme</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Paste tweakcn.com URL..."
            value={customThemeUrl}
            onChange={(e) => setCustomThemeUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleImportTheme}
            disabled={isLoadingCustom || !customThemeUrl}
          >
            {isLoadingCustom ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Import"
            )}
          </Button>
        </div>
        {error && <p className="text-destructive text-xs">{error}</p>}
        <p className="text-[0.8rem] text-muted-foreground">
          Import themes from{" "}
          <a
            href="https://tweakcn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            tweakcn.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
