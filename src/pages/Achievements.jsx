import { useMemo, useState } from "react";
import { useCollection } from "../lib/useCollection.js";
import { PageHeader, CategoryFilter, Loading, EmptyState, ErrorNote, Tag } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { icons } from "../components/Icons.jsx";
import { fmtDate, label } from "../lib/format.js";

const TYPES = ["student", "faculty", "placement", "award", "project"].map((v) => ({
  value: v,
  label: label("type", v),
}));

export default function Achievements() {
  const { rows, loading, error } = useCollection("achievements");
  const [type, setType] = useState("all");

  const filtered = useMemo(
    () => rows.filter((a) => type === "all" || a.type === type),
    [rows, type]
  );

  return (
    <div>
      <PageHeader
        icon={icons.trophy}
        title="Achievements"
        subtitle="Student & faculty achievements, placements, awards and project wins."
      />
      <CategoryFilter options={TYPES} value={type} onChange={setType} />
      <ErrorNote error={error} />

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState>No achievements to show.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <Reveal key={a.id} delay={Math.min(i, 6) * 60}>
              <article className="card overflow-hidden !p-0">
                {a.image_url && (
                  <div className="aspect-[16/10] w-full overflow-hidden border-b border-[var(--color-line)]">
                    <img src={a.image_url} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <Tag tone="signal">{label("type", a.type)}</Tag>
                  <h3 className="mt-2 text-base font-semibold text-[var(--color-text)]">{a.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-mist)]">{a.description}</p>
                  <p className="mt-3 text-xs text-[var(--color-mist)]">{fmtDate(a.date)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
