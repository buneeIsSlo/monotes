"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/(notes)/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "@radix-ui/react-icons";
import { createNewNote } from "@/lib/local-notes";
import { getDB } from "@/lib/local-db";
import { useLiveQuery } from "dexie-react-hooks";
import { generateSlug } from "@/lib/ids";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const notes =
    useLiveQuery(
      () => getDB().notes.orderBy("updatedAt").reverse().toArray(),
      []
    ) || [];

  const isLoading = notes === undefined;

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

  return (
    <div className="bg-background p-2">
      <Navbar />
      <main className="flex">
        <section className="flex-1 md:max-w-4xl mx-auto pt-16 px-4">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-6">Monotes</h1>
            <p className="text-xl text-muted-foreground mb-8">
              A modern, distraction-free note-taking app
            </p>

            {/* Search and Create */}
            <div className="flex gap-3 mb-8">
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                disabled
              />
              <Button onClick={onCreateNew} size="default">
                <PlusIcon className="size-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="mb-16">
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
          </div>

          {/* SEO Content Section */}
          <section className="prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-2xl font-semibold mb-4">About Monotes</h2>
            <p className="text-muted-foreground mb-4">
              Monotes is a modern, distraction-free note-taking application
              designed for writers, developers, and anyone who values a clean,
              focused writing experience. Built with Next.js and featuring
              real-time cloud synchronization, Monotes helps you capture your
              thoughts and ideas without getting in your way.
            </p>
            <h3 className="text-xl font-semibold mb-3">Features</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Markdown support for rich text formatting</li>
              <li>Distraction-free writing mode</li>
              <li>Cloud synchronization across devices</li>
              <li>Fast, local-first architecture</li>
              <li>Dark mode support</li>
              <li>Keyboard shortcuts and Vim mode</li>
            </ul>
            <p className="text-muted-foreground">
              Start taking notes today and experience a new way of capturing and
              organizing your ideas. Whether you&apos;re writing documentation,
              keeping a journal, or brainstorming, Monotes provides the tools
              you need to stay productive and focused.
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}
