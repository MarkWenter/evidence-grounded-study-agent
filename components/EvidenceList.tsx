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
    <section className="ui-card">
      <h2 className="ui-section-title">Evidence</h2>
      <p className="ui-section-hint">
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
            <p className="mb-3 text-sm text-slate-700">
              <span className="ui-badge">Query</span>
              <span className="ml-2">{query}</span>
            </p>
          ) : null}
          <ul className="space-y-3 text-sm text-slate-700">
            {evidence.map((item) => (
              <li
                key={item.chunkId}
                className="rounded-xl border border-blue-100 bg-blue-50/40 p-3"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {typeof item.rank === "number" ? (
                    <span className="ui-badge">Rank {item.rank}</span>
                  ) : null}
                  <span className="ui-badge">Score {formatScore(item.score)}</span>
                </div>
                <p className="font-medium text-slate-800">
                  {item.fileName} <span className="font-normal text-slate-600">Page {item.page}</span>
                </p>
                {item.matchedTerms && item.matchedTerms.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.matchedTerms.map((term) => (
                      <span key={`${item.chunkId}-${term}`} className="ui-pill">
                        {term}
                      </span>
                    ))}
                  </div>
                ) : null}
                {item.selectionReason ? (
                  <p className="mt-2 text-sm text-slate-600">Selection reason: {item.selectionReason}</p>
                ) : null}
                <p className="mt-2 rounded-lg border border-blue-100 bg-white p-2 text-slate-700">
                  Snippet: {item.textSnippet}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
