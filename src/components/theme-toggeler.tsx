"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon, DesktopIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeToggeler() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <span className="size-[1.2rem]" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon-lg"
      onClick={cycleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" && <SunIcon className="h-[1.2rem] w-[1.2rem]" />}
      {theme === "dark" && <MoonIcon className="h-[1.2rem] w-[1.2rem]" />}
      {(theme === "system" || !theme) && (
        <DesktopIcon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
