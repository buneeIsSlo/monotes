"use client";

import { useState } from "react";
import Navbar from "@/app/(notes)/[id]/navbar";
import NotesEditor from "@/components/notes/notes-editor";
import { useParams } from "next/navigation";

export default function Note() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams<{ id: string }>();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-background p-2">
      <Navbar onSidebarToggle={toggleSidebar} />
      <main className="flex">
        <section className="flex-1 md:max-w-4xl mx-auto">
          <NotesEditor noteId={params?.id} />
        </section>
      </main>
    </div>
  );
}
