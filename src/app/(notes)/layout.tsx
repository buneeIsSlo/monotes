"use client";

import NotesSidebar from "@/components/notes/notes-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAutoSync } from "@/lib/sync-engine";
import { useEffect } from "react";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { startAutoSync } = useAutoSync();

  useEffect(() => {
    // Auto-sync will only run for authenticated users
    startAutoSync();
  }, [startAutoSync]);

  return (
    <SidebarProvider>
      <NotesSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
