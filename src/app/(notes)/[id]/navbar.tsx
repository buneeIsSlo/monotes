"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { PlusIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import ThemeToggeler from "@/components/theme-toggeler";
import { useRouter } from "next/navigation";
import { createNewNote } from "@/lib/local-notes";
import { generateSlug } from "@/lib/ids";
import { useSidebar } from "@/components/ui/sidebar";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import SettingsTrigger from "@/components/settings/settings-trigger";

export default function Navbar() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const onCreateNew = async () => {
    const slug = generateSlug();
    const note = await createNewNote(slug);
    router.push(`/${note.id}`);
  };

  return (
    <nav className="flex items-center justify-between fixed top-0 left-0 w-full p-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <HamburgerMenuIcon className="size-4" />
      </Button>

      <ButtonGroup className="gap-2">
        <Button
          // variant="ghost"
          size="icon"
          aria-label="New note"
          onClick={onCreateNew}
        >
          <PlusIcon className="size-4" />
        </Button>
        <SettingsTrigger />
        <ThemeToggeler />
      </ButtonGroup>
    </nav>
  );
}
