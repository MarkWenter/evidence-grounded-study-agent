import { NextResponse } from "next/server";

import { parsePdfToChunks } from "@/lib/pdfParser";
import { appendChunks, appendDocument } from "@/lib/storage";

export const runtime = "nodejs";

function badRequest(message: string) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploaded = formData.get("file");

    if (!(uploaded instanceof File)) {
      return badRequest("No PDF file was provided.");
    }

    const fileName = uploaded.name?.trim();
    if (!fileName) {
      return badRequest("The uploaded file must include a file name.");
    }

    const isPdf =
      uploaded.type === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return badRequest("Only PDF files are supported in this step.");
    }

    const arrayBuffer = await uploaded.arrayBuffer();
    const parsed = await parsePdfToChunks(arrayBuffer, fileName);

    await appendDocument(parsed.document);
    await appendChunks(parsed.chunks);

    return NextResponse.json({
      success: true,
      document: parsed.document,
      chunkCount: parsed.chunks.length,
      message: "PDF uploaded and parsed successfully.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to upload and parse PDF.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
