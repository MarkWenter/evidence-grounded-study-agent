import type { VerificationResult } from "@/lib/types";

interface AnswerCardProps {
  answer: string;
  hasAsked: boolean;
  message?: string;
  model?: string;
  isError?: boolean;
  verification?: VerificationResult;
}

export default function AnswerCard({
  answer,
  hasAsked,
  message,
  model,
  isError = false,
  verification,
}: AnswerCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Answer</h2>
      {!hasAsked ? (
        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Ask a question to generate an evidence-grounded answer.
        </div>
      ) : null}

      {hasAsked ? (
        <div
          className={`mt-3 rounded-md border p-4 text-sm ${
            isError
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {model && !isError ? <p className="mb-2">Model: {model}</p> : null}
          <p className="whitespace-pre-wrap">{answer || message}</p>

          {verification ? (
            <div className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-slate-700">
              <p>Supported: {verification.supported ? "yes" : "no"}</p>
              <p>Confidence: {verification.confidence}</p>
              <p>Reason: {verification.reason}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
