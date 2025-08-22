import { getDB, type NoteContent } from "./local-db";
import { generateSlug } from "./ids";

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
  const now = Date.now();
  const updatedNote: NoteContent = { id: slug, content, updatedAt: now };
  await db.notes.put(updatedNote);
  return updatedNote;
}

export async function createNewNote(): Promise<NoteContent> {
  const slug = generateSlug();
  const now = Date.now();
  const note: NoteContent = { id: slug, content: "", updatedAt: now };
  await getDB().notes.put(note);
  return note;
}
