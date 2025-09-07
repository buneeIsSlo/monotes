import { v4 as uuidv4 } from "uuid";
import { getDB, type NoteContent } from "./local-db";

export function generateAccessKey(): string {
  return uuidv4();
}

// In-memory registry of temporary keys created client-side before first save.
// This allows access on the initial redirect from `/` without persisting.
const tempAccessKeys: Map<string, string> = new Map();

export function registerTempKey(noteId: string, key: string): void {
  tempAccessKeys.set(noteId, key);
}

export function getTempKey(noteId: string): string | undefined {
  return tempAccessKeys.get(noteId);
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

  // If the note exists, require the provided key to match exactly
  if (existingNote) {
    if (!urlKey) return true;
    return existingNote.accessKey === urlKey;
  }

  // If the note does not exist yet, allow access only if the key matches
  // a locally registered temporary key (and is structurally valid)
  const tempKey = getTempKey(noteId);
  return !!tempKey && tempKey === urlKey && isValidAccessKey(urlKey);
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
