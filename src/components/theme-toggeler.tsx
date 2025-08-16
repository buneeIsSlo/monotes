"use client";

import { useId } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export default function ThemeToggeler() {
  const id = useId();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <legend className="text-foreground text-sm leading-none font-medium sr-only">
        Dark mode toggle checkbox
      </legend>
      <div className="flex flex-col justify-center">
        <input
          type="checkbox"
          name={id}
          id={id}
          className="peer sr-only"
          checked={theme === "dark"}
          onChange={() =>
            setTheme((prev) => (prev === "dark" ? "light" : "dark"))
          }
        />
        <label
          className="group border-input bg-background dark:bg-input/30 text-foreground hover:bg-accent hover:text-accent-foreground peer-focus-visible:border-ring peer-focus-visible:ring-ring/50 relative inline-flex size-9 items-center justify-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px]"
          htmlFor={id}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <MoonIcon
            className="size-4 shrink-0 scale-0 opacity-0 transition-all dark:scale-100 dark:opacity-100"
            aria-hidden="true"
          />
          <SunIcon
            className="size-4 absolute shrink-0 scale-100 opacity-100 transition-all dark:scale-0 dark:opacity-0"
            aria-hidden="true"
          />
        </label>
      </div>
    </div>
  );
}
