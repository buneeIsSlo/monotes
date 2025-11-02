"use client";

import Navbar from "@/app/(notes)/[id]/navbar";
import NotesEditor from "@/components/notes/notes-editor";
import NotesSidebar from "@/components/notes/notes-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { useLocalNote } from "@/hooks/useLocalNote";
import { isValidSlug } from "@/lib/ids";

export default function Note() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // All notes are local-only, no access control needed
  const { note, isLoading } = useLocalNote(id || "");

  // invalid slug format
  if (id && !isValidSlug(id)) {
    return (
      <div className="bg-background p-2">
        <Navbar />
        <main className="flex">
          <section className="flex-1 md:max-w-4xl mx-auto">
            <div className="py-12 text-center text-muted-foreground">
              Invalid note ID. Create a new note from the + button.
            </div>
          </section>
        </main>
      </div>
    );
  }

  // note not found in IndexedDB
  if (id && note === null && !isLoading) {
    return (
      <div className="bg-background p-2">
        <Navbar />
        <main className="flex">
          <section className="flex-1 md:max-w-4xl mx-auto">
            <div className="py-12 text-center text-muted-foreground">
              <div className="mb-4">❌ Note not found</div>
              <div>
                This note doesn’t exist locally. Create a new one instead.
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <NotesSidebar />
      <SidebarInset>
        <div className="bg-background p-2">
          <Navbar />
          <main className="flex">
            <section className="flex-1 md:max-w-4xl mx-auto">
              {isLoading ? null : <NotesEditor noteId={id} />}
            </section>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
