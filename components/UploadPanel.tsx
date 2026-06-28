"use client";

import { useState } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadPanelProps {
  onUploadSuccess?: () => void;
}

interface UploadResult {
  fileName: string;
  chunkCount: number;
  message: string;
}

export default function UploadPanel({ onUploadSuccess }: UploadPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState<string>(
    "Select a PDF and upload it for page-level parsing.",
  );
  const [result, setResult] = useState<UploadResult | null>(null);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setStatus("error");
      setMessage("Please select a PDF file first.");
      setResult(null);
      return;
    }

    setStatus("uploading");
    setMessage("Uploading and parsing PDF...");
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        success: boolean;
        message: string;
        chunkCount?: number;
        document?: { fileName?: string };
      };

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Upload failed.");
      }

      const fileName = data.document?.fileName ?? selectedFile.name;
      const chunkCount = data.chunkCount ?? 0;

      setStatus("success");
      setMessage(data.message || "PDF uploaded and parsed successfully.");
      setResult({
        fileName,
        chunkCount,
        message: data.message || "PDF uploaded and parsed successfully.",
      });
      setSelectedFile(null);
      onUploadSuccess?.();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload and parse PDF.",
      );
      setResult(null);
    }
  }

  return (
    <section className="ui-card">
      <h2 className="ui-section-title">Upload lecture PDF</h2>
      <p className="ui-section-hint">
        Upload a PDF to extract page-level text and store chunk metadata locally.
      </p>
      <form
        onSubmit={(event) => {
          void handleUpload(event);
        }}
        className="mt-4 rounded-xl border border-dashed border-sky-200 bg-sky-50/40 p-6 text-sm text-slate-700"
      >
        <label className="ui-label block" htmlFor="pdf-file">
          Choose PDF file
        </label>
        <input
          id="pdf-file"
          type="file"
          accept="application/pdf,.pdf"
          className="ui-input mt-2"
          onChange={(event) => {
            const nextFile = event.target.files?.[0] ?? null;
            setSelectedFile(nextFile);
            setStatus("idle");
            setResult(null);
            setMessage("Select a PDF and upload it for page-level parsing.");
          }}
        />

        <button
          type="submit"
          disabled={status === "uploading" || !selectedFile}
          className="ui-button-primary mt-4"
        >
          {status === "uploading" ? "Uploading..." : "Upload PDF"}
        </button>

        <p className="ui-status-line">
          <span className="ui-badge">Status</span>
          <span className="font-medium capitalize">{status}</span>
        </p>
        <p className="mt-1 text-sm text-slate-700">{message}</p>

        {result ? (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p className="font-medium">File: {result.fileName}</p>
            <p className="mt-1">Extracted pages/chunks: {result.chunkCount}</p>
          </div>
        ) : null}
      </form>
    </section>
  );
}
