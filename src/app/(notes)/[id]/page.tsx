"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/(notes)/[id]/navbar";
import NotesEditor from "@/components/notes/notes-editor";
import { useParams } from "next/navigation";
import { useLocalNote } from "@/hooks/useLocalNote";
import { isValidSlug } from "@/lib/ids";
import { hasAccess } from "@/lib/access";

export default function Note() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userHasAccess, setUserHasAccess] = useState<boolean | null>(null);
  const params = useParams<{ id: string }>();
  const id = params?.id;

  useEffect(() => {
    const checkAccess = async () => {
      if (id && isValidSlug(id)) {
        const hash =
          typeof window !== "undefined" ? window.location.hash.slice(1) : null;

        const access = await hasAccess(id, hash);
        setUserHasAccess(access);

        if (hash && access && typeof window !== "undefined")
          window.history.replaceState(null, "", `/${id}`);
      } else {
        setUserHasAccess(false);
      }
    };

    checkAccess();
  }, [id]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { isLoading } = useLocalNote(userHasAccess && id ? id : "");

  // Validate slug format
  if (id && !isValidSlug(id)) {
    return (
      <div className="bg-background p-2">
        <Navbar onSidebarToggle={toggleSidebar} />
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

  // Show loading while checking access
  if (userHasAccess === null) {
    return (
      <div className="bg-background p-2">
        <Navbar onSidebarToggle={toggleSidebar} />
        <main className="flex">
          <section className="flex-1 md:max-w-4xl mx-auto">
            <div className="py-12 text-center text-muted-foreground">
              Loading...
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (id && !userHasAccess) {
    return (
      <div className="bg-background p-2">
        <Navbar onSidebarToggle={toggleSidebar} />
        <main className="flex">
          <section className="flex-1 md:max-w-4xl mx-auto">
            <div className="py-12 text-center text-muted-foreground">
              <div className="mb-4">🔒 Access Denied</div>
              <div>You need the access key to view this note.</div>
              <div className="mt-2 text-sm">
                Create a new note from the + button.
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background p-2">
      <Navbar onSidebarToggle={toggleSidebar} />
      <main className="flex">
        <section className="flex-1 md:max-w-4xl mx-auto">
          {isLoading ? null : <NotesEditor noteId={id} />}
        </section>
      </main>
    </div>
  );
}
