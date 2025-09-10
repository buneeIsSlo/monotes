"use client";

import Link from "next/link";
import Image from "next/image";
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
} from "@/components/ui/sidebar";
import { listNotes } from "@/lib/local-notes";
import type { NoteContent } from "@/lib/local-db";

export default function NotesSidebar() {
  const [notes, setNotes] = useState<NoteContent[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const all = await listNotes();
        if (isMounted) setNotes(all);
      } catch (err) {
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
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Image src="/globe.svg" alt="Monotes" width={20} height={20} />
          <span className="font-semibold text-sm">Monotes</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {notes.map((n) => (
                <SidebarMenuItem key={n.id}>
                  <Link href={`/${n.id}`} className="w-full">
                    <SidebarMenuButton asChild>
                      <span>
                        {n.content?.trim()
                          ? n.content.split("\n")[0].slice(0, 80)
                          : n.id}
                      </span>
                    </SidebarMenuButton>
                  </Link>
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
