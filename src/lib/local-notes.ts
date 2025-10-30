import { getDB, type NoteContent } from "./local-db";

export async function getNote(slug: string): Promise<NoteContent | null> {
  const db = getDB();
  const existingNote = await db.notes.get(slug);
  return existingNote ?? null;
}

export async function saveNote(
  slug: string,
  content: string
): Promise<NoteContent> {
  const db = getDB();
  const existingNote = await db.notes.get(slug);
  const now = Date.now();

  const updatedNote: NoteContent = existingNote
    ? { ...existingNote, content, updatedAt: now }
    : {
        id: slug,
        content,
        updatedAt: now,
        cloudStatus: "local",
      };

  await db.notes.put(updatedNote);
  return updatedNote;
}

export async function createNewNote(slug: string): Promise<NoteContent> {
  // Return an in-memory (ephemeral) note. Do not persist yet.
  return {
    id: slug,
    content: "",
    updatedAt: Date.now(),
    cloudStatus: "local",
  };
}

export async function listNotes(): Promise<NoteContent[]> {
  const db = getDB();
  // Return all persisted notes ordered by most recently updated first
  return db.notes.orderBy("updatedAt").reverse().toArray();
}
