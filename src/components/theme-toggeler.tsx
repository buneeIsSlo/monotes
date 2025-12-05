"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeToggeler() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <MoonIcon className="size-4 shrink-0 scale-0 opacity-0 transition-all dark:scale-100 dark:opacity-100" />
      <SunIcon className="size-4 absolute shrink-0 scale-100 opacity-100 transition-all dark:scale-0 dark:opacity-0" />
    </Button>
  );
}
