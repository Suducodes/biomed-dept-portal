import { useMemo, useState } from "react";
import { useCollection } from "../lib/useCollection.js";
import { PageHeader, CategoryFilter, SearchInput, Loading, EmptyState, ErrorNote, Tag, Modal } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { Icon, icons } from "../components/Icons.jsx";
import { fmtDate, relDate, label, isNew } from "../lib/format.js";

const CATEGORIES = ["academic", "circular", "placement", "internship", "workshop"].map((v) => ({
  value: v,
  label: label("category", v),
}));

export default function Notices() {
  const { rows, loading, error } = useCollection("notices");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [active, setActive] = useState(null);

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
          {filtered.map((n, i) => (
            <Reveal key={n.id} delay={Math.min(i, 6) * 50}>
              <article className="card cursor-pointer" onClick={() => setActive(n)}>
                <div className="flex flex-wrap items-start gap-2">
                  {n.is_pinned && (
                    <span className="mt-0.5 text-[var(--color-signal)]" title="Pinned">
                      <Icon path={icons.pin} size={16} />
                    </span>
                  )}
                  <h3 className="flex-1 text-base font-semibold text-[var(--color-text)]">{n.title}</h3>
                  {isNew(n.published_at) && <Tag tone="signal">NEW</Tag>}
                  <Tag tone="signal">{label("category", n.category)}</Tag>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-mist)]">{n.body}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-mist)]">
                  <span>{fmtDate(n.published_at)} · {relDate(n.published_at)}</span>
                  <span className="text-[var(--color-signal)]">Read more →</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title}>
        {active && (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Tag tone="signal">{label("category", active.category)}</Tag>
              {active.is_pinned && <Tag>Pinned</Tag>}
              {isNew(active.published_at) && <Tag tone="signal">NEW</Tag>}
              <span className="text-xs text-[var(--color-mist)]">{fmtDate(active.published_at)}</span>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--color-text)]">{active.body}</p>
            {active.attachment_url && (
              <a href={active.attachment_url} target="_blank" rel="noreferrer" className="btn btn-primary mt-5">
                <Icon path={icons.download} size={16} /> Download attachment
              </a>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
