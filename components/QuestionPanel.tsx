"use client";

import { useState } from "react";

import type {
  AgentTraceStep,
  EvidenceItem,
  VerificationResult,
} from "@/lib/types";

type AskStatus = "idle" | "loading" | "success" | "error";

export interface AskViewModel {
  query: string;
  answer: string;
  evidence: EvidenceItem[];
  agentTrace: AgentTraceStep[];
  verification?: VerificationResult;
  model?: string;
  message: string;
}

interface QuestionPanelProps {
  onAnswered?: (result: AskViewModel) => void;
}

export default function QuestionPanel({ onAnswered }: QuestionPanelProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AskStatus>("idle");
  const [message, setMessage] = useState(
    "Enter a question to generate an evidence-grounded answer.",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setStatus("error");
      setMessage("Please enter a question before generating an answer.");
      onAnswered?.({
        query: "",
        answer: "",
        evidence: [],
        agentTrace: [],
        verification: {
          supported: false,
          confidence: "low",
          reason: "Please enter a question before generating an answer.",
        },
        message: "Please enter a question before generating an answer.",
      });
      return;
    }

    setStatus("loading");
    setMessage("Generating grounded answer from retrieved evidence...");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: trimmedQuery,
          topK: 5,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        query?: string;
        answer?: string;
        evidence?: EvidenceItem[];
        agentTrace?: AgentTraceStep[];
        verification?: VerificationResult;
        model?: string;
        message: string;
      };

      if (!response.ok || !data.success) {
        const errorMessage = data.message || "Answer generation request failed.";

        setStatus("error");
        setMessage(errorMessage);
        onAnswered?.({
          query: data.query ?? trimmedQuery,
          answer: data.answer ?? "",
          evidence: data.evidence ?? [],
          agentTrace: data.agentTrace ?? [],
          verification: data.verification,
          model: data.model,
          message: errorMessage,
        });
        return;
      }

      const result: AskViewModel = {
        query: data.query ?? trimmedQuery,
        answer: data.answer ?? "",
        evidence: data.evidence ?? [],
        agentTrace: data.agentTrace ?? [],
        verification: data.verification,
        model: data.model,
        message: data.message,
      };

      setStatus("success");
      setMessage(data.message);
      onAnswered?.(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate grounded answer.";

      setStatus("error");
      setMessage(errorMessage);
      onAnswered?.({
        query: trimmedQuery,
        answer: "",
        evidence: [],
        agentTrace: [],
        verification: {
          supported: false,
          confidence: "low",
          reason: errorMessage,
        },
        message: errorMessage,
      });
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Ask a question</h2>
      <p className="mt-2 text-sm text-slate-600">
        Generate an evidence-grounded answer from uploaded materials.
      </p>
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        className="mt-4"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (status !== "idle") {
                setStatus("idle");
                setMessage("Enter a question to generate an evidence-grounded answer.");
              }
            }}
            placeholder="Example: What is a compound AI system?"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {status === "loading" ? "Generating..." : "Generate Answer"}
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-700">Status: {status}</p>
        <p className="mt-1 text-sm text-slate-700">{message}</p>
      </form>
    </section>
  );
}
