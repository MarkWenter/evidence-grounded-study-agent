import { randomUUID } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { PDFParse } from "pdf-parse";

import { createPageChunks } from "./chunker";
import type { ChunkRecord, DocumentRecord } from "./types";

const EMPTY_PAGE_PLACEHOLDER = "[No extractable text on this page]";
const PDF_WORKER_PATH = pathToFileURL(
  path.join(process.cwd(), "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs"),
).toString();

PDFParse.setWorker(PDF_WORKER_PATH);

export interface ParsePdfResult {
  document: DocumentRecord;
  chunks: ChunkRecord[];
  pageCount: number;
  emptyPageCount: number;
}

export async function parsePdfToChunks(
  pdfData: ArrayBuffer,
  fileName: string,
): Promise<ParsePdfResult> {
  const parser = new PDFParse({ data: Buffer.from(pdfData) });
  const parsed = await parser.getText({ pageJoiner: "" }).finally(async () => {
    await parser.destroy();
  });

  const documentId = randomUUID();
  const uploadedAt = new Date().toISOString();
  let emptyPageCount = 0;

  const pages = parsed.pages.map((pageText) => {
    const text = pageText.text.replace(/\s+/g, " ").trim();

    if (!text) {
      emptyPageCount += 1;
    }

    return {
      page: pageText.num,
      text: text || EMPTY_PAGE_PLACEHOLDER,
    };
  });

  const document: DocumentRecord = {
    id: documentId,
    fileName,
    uploadedAt,
  };

  const chunks = createPageChunks(documentId, fileName, pages);

  return {
    document,
    chunks,
    pageCount: parsed.total,
    emptyPageCount,
  };
}
