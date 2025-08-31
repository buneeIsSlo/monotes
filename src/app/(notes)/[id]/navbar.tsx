"use client";

import { Button } from "@/components/ui/button";
import {
  MixerHorizontalIcon,
  HamburgerMenuIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import ThemeToggeler from "@/components/theme-toggeler";
import { useRouter } from "next/navigation";
import { createNewNote } from "@/lib/local-notes";

interface NavbarProps {
  onSidebarToggle: () => void;
}

export default function Navbar({ onSidebarToggle }: NavbarProps) {
  const router = useRouter();

  const onCreateNew = async () => {
    const note = await createNewNote();
    router.push(`${note.id}#${note.accessKey}`); // Navigate with access key in hash
  };

  return (
    <nav className="flex items-center justify-between fixed top-0 left-0 w-full p-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onSidebarToggle}
        aria-label="Toggle sidebar"
      >
        <HamburgerMenuIcon className="size-4" />
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="New note"
          onClick={onCreateNew}
        >
          <PlusIcon className="size-4" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Settings">
          <MixerHorizontalIcon className="size-4" />
        </Button>
        <ThemeToggeler />
      </div>
    </nav>
  );
}
