import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCollection } from "../lib/useCollection.js";
import { PageHeader, SearchInput, Tag } from "../components/ui.jsx";
import { Icon, icons } from "../components/Icons.jsx";
import { fmtDate, label } from "../lib/format.js";

// Global client-side search across notices, events and downloads.
export default function SearchPage() {
  const notices = useCollection("notices");
  const events = useCollection("events");
  const downloads = useCollection("downloads");
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    const hits = [];
    for (const n of notices.rows) {
      if ((n.title + " " + n.body).toLowerCase().includes(needle))
        hits.push({ id: "n" + n.id, kind: "Notice", icon: icons.bell, to: "/notices", title: n.title, meta: label("category", n.category), date: n.published_at });
    }
    for (const e of events.rows) {
      if ((e.title + " " + e.description).toLowerCase().includes(needle))
        hits.push({ id: "e" + e.id, kind: "Event", icon: icons.calendar, to: "/events", title: e.title, meta: label("type", e.type), date: e.event_date });
    }
    for (const d of downloads.rows) {
      if (d.title.toLowerCase().includes(needle))
        hits.push({ id: "d" + d.id, kind: "Download", icon: icons.doc, to: "/downloads", title: d.title, meta: label("category", d.category), date: d.uploaded_at });
    }
    return hits;
  }, [q, notices.rows, events.rows, downloads.rows]);

  return (
    <div>
      <PageHeader
        icon={icons.search}
        title="Search"
        subtitle="Search across notices, events and downloads."
      />
      <SearchInput value={q} onChange={setQ} placeholder="Type to search…" />

      {q.trim() === "" ? (
        <p className="text-sm text-[var(--color-mist)]">Start typing to search the portal.</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-[var(--color-mist)]">No matches for “{q}”.</p>
      ) : (
        <div className="space-y-2">
          <p className="mb-2 text-xs text-[var(--color-mist)]">{results.length} result{results.length > 1 ? "s" : ""}</p>
          {results.map((r) => (
            <Link key={r.id} to={r.to} className="card flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--color-ink-2)] text-[var(--color-signal)] ring-1 ring-[var(--color-line)]">
                <Icon path={r.icon} size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[var(--color-text)]">{r.title}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <Tag>{r.kind}</Tag>
                  <span className="text-xs text-[var(--color-mist)]">{r.meta} · {fmtDate(r.date)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
