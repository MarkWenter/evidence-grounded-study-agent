import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ChunkRecord, DocumentRecord } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DOCUMENTS_PATH = path.join(DATA_DIR, "documents.json");
const CHUNKS_PATH = path.join(DATA_DIR, "chunks.json");

async function ensureDataFile(filePath: string): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeFile(filePath, "[]\n", "utf8");
  }
}

async function readJsonArray<T>(filePath: string, label: string): Promise<T[]> {
  await ensureDataFile(filePath);
  const raw = await readFile(filePath, "utf8");

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error(`${label} must contain a JSON array.`);
    }

    return parsed as T[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read ${label}: ${error.message}`);
    }

    throw new Error(`Failed to read ${label}: invalid JSON data.`);
  }
}

async function writeJsonArray<T>(filePath: string, records: T[]): Promise<void> {
  await ensureDataFile(filePath);
  await writeFile(filePath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
}

export async function readDocuments(): Promise<DocumentRecord[]> {
  return readJsonArray<DocumentRecord>(DOCUMENTS_PATH, "documents.json");
}

export async function writeDocuments(documents: DocumentRecord[]): Promise<void> {
  await writeJsonArray(DOCUMENTS_PATH, documents);
}

export async function appendDocument(document: DocumentRecord): Promise<void> {
  const documents = await readDocuments();
  documents.push(document);
  await writeDocuments(documents);
}

export async function readChunks(documentId?: string): Promise<ChunkRecord[]> {
  const chunks = await readJsonArray<ChunkRecord>(CHUNKS_PATH, "chunks.json");
  if (!documentId) {
    return chunks;
  }

  return chunks.filter((chunk) => chunk.documentId === documentId);
}

export async function writeChunks(chunks: ChunkRecord[]): Promise<void> {
  await writeJsonArray(CHUNKS_PATH, chunks);
}

export async function appendChunks(newChunks: ChunkRecord[]): Promise<void> {
  const chunks = await readChunks();
  chunks.push(...newChunks);
  await writeChunks(chunks);
}

export async function clearAllData(): Promise<void> {
  await writeDocuments([]);
  await writeChunks([]);
}
