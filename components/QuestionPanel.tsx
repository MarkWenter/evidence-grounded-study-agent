"use client";

import { useState } from "react";

import type {
  AgentTraceStep,
  AnswerMode,
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
  mode?: AnswerMode;
  model?: string;
  message: string;
}

interface QuestionPanelProps {
  onAnswered?: (result: AskViewModel) => void;
}

export default function QuestionPanel({ onAnswered }: QuestionPanelProps) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<AnswerMode>("study");
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
        mode,
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
          mode,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        query?: string;
        answer?: string;
        evidence?: EvidenceItem[];
        agentTrace?: AgentTraceStep[];
        verification?: VerificationResult;
        mode?: AnswerMode;
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
          mode: data.mode ?? mode,
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
        mode: data.mode ?? mode,
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
        mode,
        message: errorMessage,
      });
    }
  }

  return (
    <section className="ui-card">
      <h2 className="ui-section-title">Ask a question</h2>
      <p className="ui-section-hint">
        Generate an evidence-grounded answer from uploaded materials.
      </p>
      <div className="ui-card-muted mt-4 text-sm text-slate-700">
        <p className="font-medium text-slate-800">Response mode</p>
        <div className="mt-2 flex flex-col gap-2">
          <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2">
            <input
              type="radio"
              name="answer-mode"
              value="study"
              checked={mode === "study"}
              onChange={() => {
                setMode("study");
              }}
              className="mt-0.5 h-4 w-4 accent-blue-600"
            />
            <span className="font-medium">Study Mode</span>
          </label>
          <p className="text-xs text-slate-600">Provides direct evidence-grounded explanations.</p>

          <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2">
            <input
              type="radio"
              name="answer-mode"
              value="assessment_safe"
              checked={mode === "assessment_safe"}
              onChange={() => {
                setMode("assessment_safe");
              }}
              className="mt-0.5 h-4 w-4 accent-blue-600"
            />
            <span className="font-medium">Assessment-safe Hint Mode</span>
          </label>
          <p className="text-xs text-slate-600">
            Provides hints, guiding questions, and relevant pages instead of direct final answers.
          </p>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        className="mt-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
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
            className="ui-input w-full"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="ui-button-primary shrink-0"
          >
            {status === "loading" ? "Generating..." : "Generate Answer"}
          </button>
        </div>
        <p className="ui-status-line">
          <span className="ui-badge">Status</span>
          <span className="font-medium capitalize">{status}</span>
        </p>
        <p className="mt-1 text-sm text-slate-700">{message}</p>
      </form>
    </section>
  );
}
