import { nanoid } from "nanoid";

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  type: "preset" | "custom";
  colors: ThemeColors;
  cssVars: Record<string, string>;
  cssVarsRaw?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
}

// Built-in theme URLs from tweakcn.com
export const BUILT_IN_THEMES: { name: string; url: string }[] = [
  { name: "Mono", url: "https://tweakcn.com/editor/theme?theme=mono" },
  { name: "T3 Chat", url: "https://tweakcn.com/editor/theme?theme=t3-chat" },
  {
    name: "Tangerine",
    url: "https://tweakcn.com/editor/theme?theme=tangerine",
  },
  {
    name: "Perpetuity",
    url: "https://tweakcn.com/editor/theme?theme=perpetuity",
  },
  {
    name: "Modern Minimal",
    url: "https://tweakcn.com/editor/theme?theme=modern-minimal",
  },
  { name: "Caffeine", url: "https://tweakcn.com/editor/theme?theme=caffeine" },
  {
    name: "Quantum Rose",
    url: "https://tweakcn.com/editor/theme?theme=quantum-rose",
  },
  {
    name: "Claymorphism",
    url: "https://tweakcn.com/editor/theme?theme=claymorphism",
  },
  {
    name: "Pastel Dreams",
    url: "https://tweakcn.com/editor/theme?theme=pastel-dreams",
  },
  { name: "Supabase", url: "https://tweakcn.com/editor/theme?theme=supabase" },
  { name: "Vercel", url: "https://tweakcn.com/editor/theme?theme=vercel" },
  {
    name: "Cyberpunk",
    url: "https://tweakcn.com/editor/theme?theme=cyberpunk",
  },
];

/**
 * Converts a tweakcn.com URL to the JSON API endpoint.
 * - editor/theme?theme=NAME -> r/themes/NAME.json
 * - themes/ID -> r/themes/ID (if not already .json)
 */
export function normalizeThemeUrl(url: string): string {
  if (!url) return "";

  const baseUrl = "https://tweakcn.com/r/themes/";
  const isEditorUrl = url.includes("editor/theme?theme=");
  const isThemesUrl = url.includes("tweakcn.com/themes/");

  if (isEditorUrl) {
    // https://tweakcn.com/editor/theme?theme=mono -> https://tweakcn.com/r/themes/mono.json
    const themeName = url.split("editor/theme?theme=")[1];
    return `${baseUrl}${themeName}.json`;
  }

  if (isThemesUrl) {
    // https://tweakcn.com/themes/abc123 -> https://tweakcn.com/r/themes/abc123.json
    const themeId = url.split("tweakcn.com/themes/")[1];
    return `${baseUrl}${themeId}${themeId.endsWith(".json") ? "" : ".json"}`;
  }

  // Already a direct JSON URL or unknown format
  if (url.includes("/r/themes/") && !url.endsWith(".json")) {
    return `${url}.json`;
  }

  return url;
}

export async function fetchThemeFromUrl(
  url: string
): Promise<ThemePreset | null> {
  try {
    const normalizedUrl = normalizeThemeUrl(url);
    const res = await fetch(normalizedUrl);
    if (!res.ok) throw new Error(`Failed to fetch theme: ${res.status}`);

    const data = await res.json();

    // Validate that we have cssVars
    if (!data.cssVars || typeof data.cssVars !== "object") {
      console.error("Invalid theme data: missing cssVars");
      return null;
    }

    // tweakcn.com uses nested structure: { theme: {}, light: {}, dark: {} }
    const cssVarsRaw = data.cssVars as {
      theme?: Record<string, string>;
      light?: Record<string, string>;
      dark?: Record<string, string>;
    };

    // Merge theme + light as the default (can be extended for dark mode later)
    const rawMerged = {
      ...(cssVarsRaw.theme || {}),
      ...(cssVarsRaw.light || {}),
    };

    // Add -- prefix to keys
    const mergedCssVars: Record<string, string> = {};
    for (const [key, value] of Object.entries(rawMerged)) {
      const prop = key.startsWith("--") ? key : `--${key}`;
      mergedCssVars[prop] = value;
    }

    const colors = extractThemeColors(mergedCssVars);

    // Generate name from data or URL
    let themeName = data.name || "Imported Theme";
    if (typeof themeName === "string") {
      themeName = themeName
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
    }

    return {
      id: data.id || nanoid(),
      name: themeName,
      type: "custom",
      colors,
      cssVars: mergedCssVars,
      // Store the raw structure for dark mode support
      cssVarsRaw,
    };
  } catch (error) {
    console.error("Error fetching theme:", error);
    return null;
  }
}

export function extractThemeColors(
  cssVars: Record<string, string>
): ThemeColors {
  return {
    background: cssVars["--background"] || "",
    foreground: cssVars["--foreground"] || "",
    card: cssVars["--card"] || "",
    cardForeground: cssVars["--card-foreground"] || "",
    popover: cssVars["--popover"] || "",
    popoverForeground: cssVars["--popover-foreground"] || "",
    primary: cssVars["--primary"] || "",
    primaryForeground: cssVars["--primary-foreground"] || "",
    secondary: cssVars["--secondary"] || "",
    secondaryForeground: cssVars["--secondary-foreground"] || "",
    muted: cssVars["--muted"] || "",
    mutedForeground: cssVars["--muted-foreground"] || "",
    accent: cssVars["--accent"] || "",
    accentForeground: cssVars["--accent-foreground"] || "",
    destructive: cssVars["--destructive"] || "",
    destructiveForeground: cssVars["--destructive-foreground"] || "",
    border: cssVars["--border"] || "",
    input: cssVars["--input"] || "",
    ring: cssVars["--ring"] || "",
    chart1: cssVars["--chart-1"] || "",
    chart2: cssVars["--chart-2"] || "",
    chart3: cssVars["--chart-3"] || "",
    chart4: cssVars["--chart-4"] || "",
    chart5: cssVars["--chart-5"] || "",
    sidebar: cssVars["--sidebar"] || "",
    sidebarForeground: cssVars["--sidebar-foreground"] || "",
    sidebarPrimary: cssVars["--sidebar-primary"] || "",
    sidebarPrimaryForeground: cssVars["--sidebar-primary-foreground"] || "",
    sidebarAccent: cssVars["--sidebar-accent"] || "",
    sidebarAccentForeground: cssVars["--sidebar-accent-foreground"] || "",
    sidebarBorder: cssVars["--sidebar-border"] || "",
    sidebarRing: cssVars["--sidebar-ring"] || "",
  };
}
