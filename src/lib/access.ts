import { v4 as uuidv4 } from "uuid";
import { getDB, type NoteContent } from "./local-db";

export function generateAccessKey(): string {
  return uuidv4();
}

export async function storeNoteWithKey(
  noteId: string,
  accessKey: string,
  content: string = ""
): Promise<NoteContent> {
  const db = getDB();
  const now = Date.now();
  const note: NoteContent = {
    id: noteId,
    content,
    updatedAt: now,
    accessKey,
  };
  await db.notes.put(note);
  return note;
}

export async function hasAccess(
  noteId: string,
  urlKey: string | null
): Promise<boolean> {
  if (!noteId) return false;

  const db = getDB();
  const existingNote = await db.notes.get(noteId);

  // If note exists in IndexedDB, simply return true
  if (existingNote) return true;

  // If URL provides a valid key, create acces by storing the note
  if (urlKey && isValidAccessKey(urlKey)) {
    await storeNoteWithKey(noteId, urlKey);
    return true;
  }

  return false;
}

function isValidAccessKey(key: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(key);
}

export async function getStoredKey(noteId: string): Promise<string | null> {
  const db = getDB();
  const note = await db.notes.get(noteId);
  return note?.accessKey || null;
}
