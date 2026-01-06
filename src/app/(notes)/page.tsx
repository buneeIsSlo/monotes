import type { Metadata } from "next";
import Navbar from "@/app/(notes)/navbar";
import NotesSearchList from "./notes-search-list";

export const metadata: Metadata = {
  title: "Monotes - Modern Distraction-Free Note Taking App",
  description:
    "A modern, distraction-free note-taking application with markdown support, cloud synchronization, and a clean writing experience. Built for writers, developers, and anyone who values focused productivity.",
  keywords: [
    "note taking",
    "markdown editor",
    "distraction free writing",
    "cloud notes",
    "productivity app",
    "writing app",
  ],
  openGraph: {
    title: "Monotes - Modern Note Taking App",
    description:
      "A distraction-free note-taking application with markdown support and cloud sync.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="bg-background p-2">
      <Navbar />
      <main className="flex">
        <section className="flex-1 md:max-w-4xl mx-auto py-16 px-4">
          {/* Hero Section */}
          <header className="mb-12">
            <h1 className="text-5xl font-bold mb-6">Monotes</h1>
            <p className="text-xl text-muted-foreground mb-8">
              A modern, distraction-free note-taking app
            </p>
          </header>

          {/* Your Notes Section */}
          <NotesSearchList />

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
            <h2 className="text-2xl font-semibold mb-3">Features</h2>
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
