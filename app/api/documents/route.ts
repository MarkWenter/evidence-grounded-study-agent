import { NextResponse } from "next/server";

import { readChunks, readDocuments } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [documents, chunks] = await Promise.all([readDocuments(), readChunks()]);

    const chunkCountMap = chunks.reduce((acc, chunk) => {
      const count = acc.get(chunk.documentId) ?? 0;
      acc.set(chunk.documentId, count + 1);
      return acc;
    }, new Map<string, number>());

    const documentsWithCounts = documents
      .map((document) => ({
        ...document,
        chunkCount: chunkCountMap.get(document.id) ?? 0,
      }))
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

    return NextResponse.json({ documents: documentsWithCounts });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load documents.";

    return NextResponse.json(
      {
        documents: [],
        message,
      },
      { status: 500 },
    );
  }
}
