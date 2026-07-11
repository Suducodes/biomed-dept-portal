import { useMemo, useState } from "react";
import { useCollection } from "../lib/useCollection.js";
import { PageHeader, CategoryFilter, SearchInput, Loading, EmptyState, ErrorNote, Tag } from "../components/ui.jsx";
import { Icon, icons } from "../components/Icons.jsx";
import { fmtDate, relDate, label } from "../lib/format.js";

const CATEGORIES = ["academic", "circular", "placement", "internship", "workshop"].map((v) => ({
  value: v,
  label: label("category", v),
}));

export default function Notices() {
  const { rows, loading, error } = useCollection("notices");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter((n) => cat === "all" || n.category === cat)
      .filter((n) => !needle || (n.title + " " + n.body).toLowerCase().includes(needle))
      .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
  }, [rows, cat, q]);

  return (
    <div>
      <PageHeader
        icon={icons.bell}
        title="Notices"
        subtitle="Academic notices, circulars, placement & internship announcements, workshops."
      />
      <SearchInput value={q} onChange={setQ} placeholder="Search notices…" />
      <CategoryFilter options={CATEGORIES} value={cat} onChange={setCat} />

      <ErrorNote error={error} />
      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState>No notices match your filters.</EmptyState>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <article key={n.id} className="card">
              <div className="flex flex-wrap items-start gap-2">
                {n.is_pinned && (
                  <span className="mt-0.5 text-[var(--color-signal)]" title="Pinned">
                    <Icon path={icons.pin} size={16} />
                  </span>
                )}
                <h3 className="flex-1 text-base font-semibold text-white">{n.title}</h3>
                <Tag tone="signal">{label("category", n.category)}</Tag>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-mist)]">{n.body}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-mist)]">
                <span>{fmtDate(n.published_at)} · {relDate(n.published_at)}</span>
                {n.attachment_url && (
                  <a href={n.attachment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[var(--color-signal)] hover:underline">
                    <Icon path={icons.download} size={14} /> Attachment
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
