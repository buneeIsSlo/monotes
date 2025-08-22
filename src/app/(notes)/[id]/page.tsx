"use client";

import { useState } from "react";
import Navbar from "@/app/(notes)/[id]/navbar";
import NotesEditor from "@/components/notes/notes-editor";
import { useParams } from "next/navigation";
import { useLocalNote } from "@/hooks/useLocalNote";

export default function Note() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { note, isLoading } = useLocalNote(id ?? "");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-background p-2">
      <Navbar onSidebarToggle={toggleSidebar} />
      <main className="flex">
        <section className="flex-1 md:max-w-4xl mx-auto">
          {isLoading ? null : note ? (
            <NotesEditor noteId={id} />
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No such note. Create a new one from the + button.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
