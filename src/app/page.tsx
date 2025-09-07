"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createNewNote } from "@/lib/local-notes";
import { generateSlug } from "@/lib/ids";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const createAndNavigate = async () => {
      const slug = generateSlug();
      const note = await createNewNote(slug);
      router.replace(`/${note.id}#${note.accessKey}`);
    };

    createAndNavigate();
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Creating new note...</p>
      </div>
    </main>
  );
}
