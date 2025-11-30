"use client";

import NotesSidebar from "@/components/notes/notes-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { NoteSyncProvider } from "@/contexts/note-sync-context";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NoteSyncProvider>
      <SidebarProvider>
        <NotesSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </NoteSyncProvider>
  );
}
