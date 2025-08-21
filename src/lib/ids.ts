import { customAlphabet } from "nanoid";

// URL-safe base62 slug, 10 chars
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid10 = customAlphabet(alphabet, 10);

export function generateSlug(): string {
  return nanoid10();
}
