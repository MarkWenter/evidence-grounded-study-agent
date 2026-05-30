import type { EvidenceItem } from "@/lib/types";

interface EvidenceListProps {
  evidence: EvidenceItem[];
  hasSearched: boolean;
  message?: string;
  query?: string;
}

function formatScore(score?: number): string {
  if (typeof score !== "number") {
    return "N/A";
  }

  return score.toFixed(2);
}

export default function EvidenceList({
  evidence,
  hasSearched,
  message,
  query,
}: EvidenceListProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Evidence</h2>
      <p className="mt-2 text-sm text-slate-600">
        Retrieved source evidence from local chunks.
      </p>

      {!hasSearched ? (
        <p className="mt-4 text-sm text-slate-600">
          No answer request has been run yet. Enter a question and click Generate Answer.
        </p>
      ) : null}

      {hasSearched && evidence.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          {message || "No relevant evidence found from uploaded materials."}
        </p>
      ) : null}

      {hasSearched && evidence.length > 0 ? (
        <div className="mt-4">
          {query ? (
            <p className="mb-3 text-sm text-slate-700">Query: {query}</p>
          ) : null}
          <ul className="space-y-3 text-sm text-slate-700">
            {evidence.map((item) => (
              <li
                key={item.chunkId}
                className="rounded-md border border-slate-200 bg-slate-50 p-3"
              >
                <p>
                  File: {item.fileName} | Page: {item.page}
                </p>
                <p>Score: {formatScore(item.score)}</p>
                <p className="mt-2">Snippet: {item.textSnippet}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
