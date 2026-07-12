import { useMemo, useState } from "react";
import { useCollection } from "../lib/useCollection.js";
import { PageHeader, CategoryFilter, Loading, EmptyState, ErrorNote, Tag } from "../components/ui.jsx";
import { Icon, icons } from "../components/Icons.jsx";
import CalendarGrid, { TYPE_COLOR } from "../components/CalendarGrid.jsx";
import { relDate, label } from "../lib/format.js";

const TYPES = ["academic", "college", "internal_exam", "holiday"].map((v) => ({
  value: v,
  label: label("type", v),
}));

export default function Calendar() {
  const { rows, loading, error } = useCollection("calendar_events");
  const [type, setType] = useState("all");
  const [view, setView] = useState("month"); // "month" | "list"

  const filtered = useMemo(
    () => rows.filter((c) => type === "all" || c.type === type),
    [rows, type]
  );

  const grouped = useMemo(() => {
    const f = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));
    const map = new Map();
    for (const c of f) {
      const key = new Date(c.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          icon={icons.calendar}
          title="Academic Calendar"
          subtitle="Department & college calendar, holidays and internal exam schedule."
        />
        {/* View switch */}
        <div className="flex rounded-lg border border-[var(--color-line)] p-0.5">
          {[
            { v: "month", icon: icons.grid, lbl: "Month" },
            { v: "list", icon: icons.list, lbl: "List" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setView(o.v)}
              className={
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors " +
                (view === o.v
                  ? "bg-[color-mix(in_oklab,var(--color-signal)_18%,transparent)] text-[var(--color-text)]"
                  : "text-[var(--color-mist)] hover:text-[var(--color-text)]")
              }
            >
              <Icon path={o.icon} size={14} /> {o.lbl}
            </button>
          ))}
        </div>
      </div>

      <CategoryFilter options={TYPES} value={type} onChange={setType} />
      <ErrorNote error={error} />

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState>No calendar entries.</EmptyState>
      ) : view === "month" ? (
        <CalendarGrid events={filtered} />
      ) : (
        <div className="space-y-8">
          {grouped.map(([month, items]) => (
            <section key={month}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-mist)]">{month}</h2>
              <div className="space-y-2">
                {items.map((c) => (
                  <div key={c.id} className="card card-flat flex items-center gap-4 !py-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[var(--color-ink-2)] ring-1 ring-[var(--color-line)]">
                      <span className="text-center leading-none">
                        <span className="block text-lg font-bold text-[var(--color-text)]">{new Date(c.date).getDate()}</span>
                        <span className="block text-[10px] text-[var(--color-mist)]">{new Date(c.date).toLocaleDateString("en-IN", { weekday: "short" })}</span>
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: TYPE_COLOR[c.type] }} />
                        <span className="font-medium text-[var(--color-text)]">{c.title}</span>
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
