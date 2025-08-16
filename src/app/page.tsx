"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function generateTempId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const noteId = generateTempId();
    router.replace(`/${noteId}`);
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
