import type { AgentTraceStep } from "@/lib/types";

interface AgentTraceProps {
  trace: AgentTraceStep[];
}

function getStatusStyle(status?: AgentTraceStep["status"]): string {
  switch (status) {
    case "completed":
      return "ui-badge-success";
    case "skipped":
      return "ui-badge-warning";
    case "warning":
      return "ui-badge-warning";
    case "error":
      return "ui-badge-error";
    default:
      return "ui-badge";
  }
}

export default function AgentTrace({ trace }: AgentTraceProps) {
  return (
    <section className="ui-card">
      <h2 className="ui-section-title">Agent Trace</h2>

      {trace.length === 0 ? (
        <p className="ui-section-hint">
          Ask a question to see the agent workflow trace.
        </p>
      ) : null}

      {trace.length > 0 ? (
        <ol className="mt-4 space-y-3 text-sm text-slate-700">
          {trace.map((item) => (
            <li
              key={`${item.step}-${item.title}`}
              className="rounded-xl border border-blue-100 bg-blue-50/40 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-800">
                  {item.step}. {item.title}
                </p>
                {item.status ? (
                  <span className={getStatusStyle(item.status)}>
                    {item.status}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-slate-700">{item.description}</p>
              {item.details ? <p className="mt-1 text-slate-600">{item.details}</p> : null}
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
