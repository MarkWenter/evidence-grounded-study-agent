import { NextResponse } from "next/server";

import { retrieveRelevantChunks } from "@/lib/retriever";
import { readChunks } from "@/lib/storage";

export const runtime = "nodejs";

const DEFAULT_TOP_K = 5;
const MAX_TOP_K = 20;

interface RetrieveRequestBody {
  query?: unknown;
  topK?: unknown;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RetrieveRequestBody;
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          message: "Query is required.",
        },
        { status: 400 },
      );
    }

    const requestedTopK =
      typeof body.topK === "number" && Number.isFinite(body.topK)
        ? Math.floor(body.topK)
        : DEFAULT_TOP_K;

    const topK = Math.min(Math.max(requestedTopK, 1), MAX_TOP_K);

    const chunks = await readChunks();
    if (chunks.length === 0) {
      return NextResponse.json({
        success: true,
        query,
        evidence: [],
        totalChunksSearched: 0,
        message: "No chunks available. Upload a PDF first.",
      });
    }

    const evidence = await retrieveRelevantChunks(query, chunks, topK);

    return NextResponse.json({
      success: true,
      query,
      evidence,
      totalChunksSearched: chunks.length,
      message:
        evidence.length > 0
          ? "Retrieved relevant evidence."
          : "No relevant evidence found from uploaded materials.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to retrieve evidence.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
