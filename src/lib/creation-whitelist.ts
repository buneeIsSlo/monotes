// Manages sessionStorage whitelist for authorized note creation
// This prevents users from creating notes by entering random URLs

const WHITELIST_KEY = "monotes-creation-whitelist";

export function addToCreationWhitelist(slug: string): void {
  if (typeof window === "undefined") return;

  const whitelist = getCreationWhitelist();
  whitelist.add(slug);
  sessionStorage.setItem(WHITELIST_KEY, JSON.stringify(Array.from(whitelist)));
}

export function isInCreationWhitelist(slug: string): boolean {
  if (typeof window === "undefined") return false;

  const whitelist = getCreationWhitelist();
  return whitelist.has(slug);
}

export function removeFromCreationWhitelist(slug: string): void {
  if (typeof window === "undefined") return;

  const whitelist = getCreationWhitelist();
  whitelist.delete(slug);
  sessionStorage.setItem(WHITELIST_KEY, JSON.stringify(Array.from(whitelist)));
}

function getCreationWhitelist(): Set<string> {
  if (typeof window === "undefined") return new Set();

  const stored = sessionStorage.getItem(WHITELIST_KEY);
  if (!stored) return new Set();

  try {
    const arr = JSON.parse(stored) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}
