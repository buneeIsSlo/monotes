"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import { listNotes } from "@/lib/local-notes";
import type { NoteContent } from "@/lib/local-db";

export default function NotesSidebar() {
  const [notes, setNotes] = useState<NoteContent[]>([]);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const all = await listNotes();
        if (isMounted) setNotes(all);
      } catch {
        // ignore
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Cross1Icon className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Monotes</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {notes.map((n) => (
                <SidebarMenuItem key={n.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/${n.id}`} className="w-full">
                      <span>
                        {n.content?.trim()
                          ? n.content.split("\n")[0].slice(0, 80)
                          : n.id}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {notes.length === 0 && (
                <div className="text-xs text-muted-foreground px-2 py-1.5">
                  No notes yet.
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
