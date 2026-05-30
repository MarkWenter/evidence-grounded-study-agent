import type { ChunkRecord } from "./types";

export interface RawPageText {
  page: number;
  text: string;
}

export function createPageChunks(
  documentId: string,
  fileName: string,
  rawTextByPage: RawPageText[],
): ChunkRecord[] {
  // Step 2 strategy: one page maps to one chunk.
  return rawTextByPage.map((pageRecord) => ({
    id: `${documentId}-p${pageRecord.page}`,
    documentId,
    fileName,
    page: pageRecord.page,
    text: pageRecord.text,
  }));
}
