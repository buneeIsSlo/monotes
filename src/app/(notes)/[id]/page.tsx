"use client";

import { useState } from "react";
import Navbar from "@/app/(notes)/[id]/navbar";
import NotesEditor from "@/components/notes/notes-editor";

export default function Note() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-background p-2">
      <Navbar onSidebarToggle={toggleSidebar} />
      <main className="flex">
        <section className="flex-1 md:max-w-4xl mx-auto">
          <NotesEditor />
        </section>
      </main>
    </div>
  );
}
