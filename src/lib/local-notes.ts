import { getDB, type NoteContent } from "./local-db";
import { generateSlug } from "./ids";
import { generateAccessKey, storeNoteWithKey } from "./access";

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
  if (!existingNote) {
    throw new Error(
      "Cannot save note without access key. Note must exist first."
    );
  }

  const now = Date.now();
  const updatedNote: NoteContent = { ...existingNote, content, updatedAt: now };
  await db.notes.put(updatedNote);
  return updatedNote;
}

export async function createNewNote(): Promise<NoteContent> {
  const slug = generateSlug();
  const accessKey = generateAccessKey();
  const note = await storeNoteWithKey(slug, accessKey);
  return note;
}
