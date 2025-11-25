"use client";

import NotesSidebar from "@/components/notes/notes-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <NotesSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
