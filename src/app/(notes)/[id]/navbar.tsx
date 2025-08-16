"use client";

import { Button } from "@/components/ui/button";
import { MixerHorizontalIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import ThemeToggeler from "@/components/theme-toggeler";

interface NavbarProps {
  onSidebarToggle: () => void;
}

export default function Navbar({ onSidebarToggle }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between ">
      <Button
        variant="outline"
        size="icon"
        onClick={onSidebarToggle}
        aria-label="Toggle sidebar"
      >
        <HamburgerMenuIcon className="size-4" />
      </Button>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" aria-label="Settings">
          <MixerHorizontalIcon className="size-4" />
        </Button>
        <ThemeToggeler />
      </div>
    </nav>
  );
}
