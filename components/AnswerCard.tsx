import type { AnswerMode, VerificationResult } from "@/lib/types";

interface AnswerCardProps {
  answer: string;
  hasAsked: boolean;
  message?: string;
  model?: string;
  mode?: AnswerMode;
  isError?: boolean;
  verification?: VerificationResult;
}

export default function AnswerCard({
  answer,
  hasAsked,
  message,
  model,
  mode,
  isError = false,
  verification,
}: AnswerCardProps) {
  const modeLabel =
    mode === "assessment_safe" ? "Assessment-safe Hint Mode" : "Study Mode";

  return (
    <section className="ui-card">
      <h2 className="ui-section-title">Answer</h2>
      {!hasAsked ? (
        <div className="ui-card-muted mt-3 text-sm text-slate-600">
          Ask a question to generate an evidence-grounded answer.
        </div>
      ) : null}

      {hasAsked ? (
        <div
          className={`mt-3 rounded-xl border p-4 text-sm ${
            isError
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-blue-100 bg-blue-50/40 text-slate-700"
          }`}
        >
          {model && !isError ? (
            <p className="mb-2">
              <span className="ui-badge">Model</span>
              <span className="ui-mono ml-2 text-slate-700">{model}</span>
            </p>
          ) : null}
          {mode ? (
            <p className="mb-2">
              <span className="ui-badge">Mode</span>
              <span className="ml-2 text-slate-700">{modeLabel}</span>
            </p>
          ) : null}
          <p className="whitespace-pre-wrap">{answer || message}</p>

          {verification ? (
            <div className="mt-3 rounded-lg border border-blue-100 bg-white p-3 text-slate-700">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={verification.supported ? "ui-badge-success" : "ui-badge-error"}>
                  Supported: {verification.supported ? "yes" : "no"}
                </span>
                <span className="ui-badge">Confidence: {verification.confidence}</span>
              </div>
              {typeof verification.evidenceCount === "number" ? (
                <p className="mt-1">Evidence count: {verification.evidenceCount}</p>
              ) : null}
              {typeof verification.averageEvidenceScore === "number" ? (
                <p className="mt-1">Average evidence score: {verification.averageEvidenceScore.toFixed(2)}</p>
              ) : null}
              {typeof verification.citationPresent === "boolean" ? (
                <p className="mt-1">Citation present: {verification.citationPresent ? "yes" : "no"}</p>
              ) : null}
              {verification.ruleApplied ? <p className="mt-1">Rule applied: {verification.ruleApplied}</p> : null}
              <p className="mt-2 text-slate-600">Reason: {verification.reason}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
