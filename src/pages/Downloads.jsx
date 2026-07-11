import { useMemo, useState } from "react";
import { useCollection } from "../lib/useCollection.js";
import { PageHeader, CategoryFilter, SearchInput, Loading, EmptyState, ErrorNote, Tag } from "../components/ui.jsx";
import { Icon, icons } from "../components/Icons.jsx";
import { fmtDate, label } from "../lib/format.js";

const CATEGORIES = ["circular", "timetable", "syllabus", "notes", "lab_manual", "form"].map((v) => ({
  value: v,
  label: label("category", v),
}));

export default function Downloads() {
  const { rows, loading, error } = useCollection("downloads");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter((d) => cat === "all" || d.category === cat)
      .filter((d) => !needle || d.title.toLowerCase().includes(needle));
  }, [rows, cat, q]);

  return (
    <div>
      <PageHeader
        icon={icons.doc}
        title="Downloads"
        subtitle="Circulars, timetables, syllabi, notes, lab manuals and forms."
      />
      <SearchInput value={q} onChange={setQ} placeholder="Search downloads…" />
      <CategoryFilter options={CATEGORIES} value={cat} onChange={setCat} />
      <ErrorNote error={error} />

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState>No files match your filters.</EmptyState>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((d) => (
            <div key={d.id} className="card flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--color-ink-2)] text-[var(--color-signal)] ring-1 ring-[var(--color-line)]">
                <Icon path={icons.doc} size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">{d.title}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <Tag>{label("category", d.category)}</Tag>
                  <span className="text-xs text-[var(--color-mist)]">{fmtDate(d.uploaded_at)}</span>
                </div>
              </div>
              <a
                href={d.file_url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost !px-3"
                aria-label={`Download ${d.title}`}
              >
                <Icon path={icons.download} size={16} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
