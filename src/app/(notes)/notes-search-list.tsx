"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { generateSlug } from "@/lib/ids";
import { getDB } from "@/lib/local-db";
import { createNewNote } from "@/lib/local-notes";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotesSearchList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const onCreateNew = async () => {
    const slug = generateSlug();
    const note = await createNewNote(slug);
    router.push(`/${note.id}`);
  };

  const getNotePreview = (content: string | undefined) => {
    if (!content?.trim()) return "Untitled note";
    return content.trim().slice(0, 500);
  };

  const getWordCount = (content: string | undefined) => {
    if (!content?.trim()) return 0;
    return content.trim().split(/\s+/).length;
  };

  const notes =
    useLiveQuery(
      () => getDB().notes.orderBy("updatedAt").reverse().toArray(),
      []
    ) || [];

  const isLoading = notes === undefined;
  return (
    <>
      <div className="flex gap-3 mb-8" role="search">
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          disabled
          aria-label="Search notes"
        />
        <Button
          onClick={onCreateNew}
          size="default"
          aria-label="Create new note"
        >
          <PlusIcon className="size-4 mr-2" />
          New Note
        </Button>
      </div>
      <section className="mb-16" aria-label="Your notes">
        <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">No notes yet.</p>
            <Button onClick={onCreateNew} variant="outline">
              <PlusIcon className="size-4 mr-2" />
              Create your first note
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/${note.id}`}
                className={cn(
                  "group flex flex-col justify-between border bg-card hover:bg-accent p-4 h-[180px]",
                  "hover:border-ring"
                )}
              >
                <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
                  <h3 className="font-medium text-sm whitespace-pre-wrap break-words">
                    {getNotePreview(note.content)}
                  </h3>
                </div>
                <div className="flex items-center justify-between pt-4">
                  {note.updatedAt && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(note.updatedAt).toLocaleDateString()}
                      <span className="mx-2">•</span>
                      {getWordCount(note.content)} words
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
