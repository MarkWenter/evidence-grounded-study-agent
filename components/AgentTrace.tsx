import type { AgentTraceStep } from "@/lib/types";

interface AgentTraceProps {
  trace: AgentTraceStep[];
}

function getStatusStyle(status?: AgentTraceStep["status"]): string {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "skipped":
      return "bg-amber-100 text-amber-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800";
    case "error":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function AgentTrace({ trace }: AgentTraceProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Agent Trace</h2>

      {trace.length === 0 ? (
        <p className="mt-2 text-sm text-slate-600">
          Ask a question to see the agent workflow trace.
        </p>
      ) : null}

      {trace.length > 0 ? (
        <ol className="mt-4 space-y-3 text-sm text-slate-700">
          {trace.map((item) => (
            <li key={`${item.step}-${item.title}`} className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{item.step}. {item.title}</p>
                {item.status ? (
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                ) : null}
              </div>
              <p className="mt-1">{item.description}</p>
              {item.details ? <p className="mt-1 text-slate-600">{item.details}</p> : null}
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
