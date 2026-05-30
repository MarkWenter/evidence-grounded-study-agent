"use client";

import { useEffect, useState } from "react";

import AgentTrace from "@/components/AgentTrace";
import AnswerCard from "@/components/AnswerCard";
import EvidenceList from "@/components/EvidenceList";
import QuestionPanel from "@/components/QuestionPanel";
import type { AskViewModel } from "@/components/QuestionPanel";
import UploadPanel from "@/components/UploadPanel";
import type { AgentTraceStep, EvidenceItem, VerificationResult } from "@/lib/types";

interface UploadedDocumentItem {
  id: string;
  fileName: string;
  uploadedAt: string;
  chunkCount: number;
}

export default function Home() {
  const [documents, setDocuments] = useState<UploadedDocumentItem[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState<boolean>(true);
  const [documentsMessage, setDocumentsMessage] = useState<string>("");
  const [retrievedEvidence, setRetrievedEvidence] = useState<EvidenceItem[]>([]);
  const [retrievedQuery, setRetrievedQuery] = useState<string>("");
  const [retrievalMessage, setRetrievalMessage] = useState<string>("");
  const [hasSearchedEvidence, setHasSearchedEvidence] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [answerMessage, setAnswerMessage] = useState<string>("");
  const [answerModel, setAnswerModel] = useState<string>("");
  const [hasAskedQuestion, setHasAskedQuestion] = useState<boolean>(false);
  const [answerError, setAnswerError] = useState<boolean>(false);
  const [agentTrace, setAgentTrace] = useState<AgentTraceStep[]>([]);
  const [verification, setVerification] = useState<VerificationResult | undefined>(undefined);

  async function loadDocuments() {
    try {
      const response = await fetch("/api/documents", { cache: "no-store" });
      const data = (await response.json()) as {
        documents?: UploadedDocumentItem[];
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message || "Failed to load uploaded documents.");
      }

      setDocuments(data.documents ?? []);
      if ((data.documents ?? []).length === 0) {
        setDocumentsMessage("No documents uploaded yet.");
      }
    } catch (error) {
      setDocuments([]);
      setDocumentsMessage(
        error instanceof Error
          ? error.message
          : "Failed to load uploaded documents.",
      );
    } finally {
      setDocumentsLoading(false);
    }
  }

  function refreshDocuments() {
    setDocumentsLoading(true);
    setDocumentsMessage("");
    void loadDocuments();
  }

  useEffect(() => {
    let cancelled = false;

    fetch("/api/documents", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as {
          documents?: UploadedDocumentItem[];
          message?: string;
        };

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to load uploaded documents.");
        }

        const items = data.documents ?? [];
        setDocuments(items);
        setDocumentsMessage(items.length === 0 ? "No documents uploaded yet." : "");
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setDocuments([]);
        setDocumentsMessage(
          error instanceof Error
            ? error.message
            : "Failed to load uploaded documents.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setDocumentsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Evidence-Grounded Study Agent
          </h1>
          <p className="mt-2 text-slate-600">
            A compound AI system for page-cited course material question answering.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <UploadPanel
            onUploadSuccess={() => {
              refreshDocuments();
            }}
          />
          <QuestionPanel
            onAnswered={(result: AskViewModel) => {
              setHasAskedQuestion(true);
              setHasSearchedEvidence(true);
              setRetrievedQuery(result.query);
              setRetrievedEvidence(result.evidence);
              setRetrievalMessage(result.message);
              setAnswer(result.answer);
              setAnswerMessage(result.message);
              setAnswerModel(result.model ?? "");
              setAgentTrace(result.agentTrace);
              setVerification(result.verification);
              setAnswerError(!result.answer && !!result.message);
            }}
          />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Uploaded Documents</h2>
          <p className="mt-2 text-sm text-slate-600">
            Stored from local JSON records in data/documents.json and data/chunks.json.
          </p>

          {documentsLoading ? (
            <p className="mt-4 text-sm text-slate-600">Loading documents...</p>
          ) : null}

          {!documentsLoading && documents.length > 0 ? (
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {documents.map((document) => (
                <li
                  key={document.id}
                  className="rounded-md border border-slate-200 bg-slate-50 p-3"
                >
                  <p>File: {document.fileName}</p>
                  <p>Uploaded at: {new Date(document.uploadedAt).toLocaleString()}</p>
                  <p>Chunk count: {document.chunkCount}</p>
                </li>
              ))}
            </ul>
          ) : null}

          {!documentsLoading && documents.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">{documentsMessage}</p>
          ) : null}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <AgentTrace trace={agentTrace} />
          <AnswerCard
            answer={answer}
            hasAsked={hasAskedQuestion}
            message={answerMessage}
            model={answerModel}
            isError={answerError}
            verification={verification}
          />
        </section>

        <section>
          <EvidenceList
            evidence={retrievedEvidence}
            hasSearched={hasSearchedEvidence}
            message={retrievalMessage}
            query={retrievedQuery}
          />
        </section>
      </main>
    </div>
  );
}
