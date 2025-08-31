import Dexie, { Table } from "dexie";

export interface NoteContent {
  id: string;
  content: string;
  updatedAt: number;
  accessKey: string;
}

class MonotesLocalDB extends Dexie {
  notes!: Table<NoteContent, string>;

  constructor() {
    super("monotes-db");
    this.version(1).stores({
      notes: "id,updatedAt,accessKey",
    });
  }
}

let indexDBInstance: MonotesLocalDB | null = null;
export function getDB(): MonotesLocalDB {
  if (!indexDBInstance) indexDBInstance = new MonotesLocalDB();
  return indexDBInstance;
}
