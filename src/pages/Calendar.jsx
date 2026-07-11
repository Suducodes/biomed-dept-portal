import { useMemo, useState } from "react";
import { useCollection } from "../lib/useCollection.js";
import { PageHeader, CategoryFilter, Loading, EmptyState, ErrorNote, Tag } from "../components/ui.jsx";
import { icons } from "../components/Icons.jsx";
import { fmtDate, relDate, label } from "../lib/format.js";

const TYPES = ["academic", "college", "internal_exam", "holiday"].map((v) => ({
  value: v,
  label: label("type", v),
}));

const DOT = {
  holiday: "var(--color-alert)",
  internal_exam: "var(--color-signal-2)",
  academic: "var(--color-signal)",
  college: "#818cf8",
};

export default function Calendar() {
  const { rows, loading, error } = useCollection("calendar_events");
  const [type, setType] = useState("all");

  const grouped = useMemo(() => {
    const f = rows
      .filter((c) => type === "all" || c.type === type)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const map = new Map();
    for (const c of f) {
      const key = new Date(c.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    }
    return [...map.entries()];
  }, [rows, type]);

  return (
    <div>
      <PageHeader
        icon={icons.calendar}
        title="Academic Calendar"
        subtitle="Department & college calendar, holidays and internal exam schedule."
      />
      <CategoryFilter options={TYPES} value={type} onChange={setType} />
      <ErrorNote error={error} />

      {loading ? (
        <Loading />
      ) : grouped.length === 0 ? (
        <EmptyState>No calendar entries.</EmptyState>
      ) : (
        <div className="space-y-8">
          {grouped.map(([month, items]) => (
            <section key={month}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-mist)]">{month}</h2>
              <div className="space-y-2">
                {items.map((c) => (
                  <div key={c.id} className="card flex items-center gap-4 !py-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[var(--color-ink-2)] ring-1 ring-[var(--color-line)]">
                      <span className="text-center leading-none">
                        <span className="block text-lg font-bold text-white">{new Date(c.date).getDate()}</span>
                        <span className="block text-[10px] text-[var(--color-mist)]">{new Date(c.date).toLocaleDateString("en-IN", { weekday: "short" })}</span>
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: DOT[c.type] }} />
                        <span className="font-medium text-white">{c.title}</span>
                        <Tag>{label("type", c.type)}</Tag>
                      </div>
                      {c.description && <p className="mt-0.5 text-sm text-[var(--color-mist)]">{c.description}</p>}
                    </div>
                    <span className="shrink-0 text-xs text-[var(--color-signal)]">{relDate(c.date)}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
