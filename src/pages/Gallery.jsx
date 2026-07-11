import { useMemo, useState } from "react";
import { useCollection } from "../lib/useCollection.js";
import { PageHeader, CategoryFilter, Loading, EmptyState, ErrorNote } from "../components/ui.jsx";
import { Icon, icons } from "../components/Icons.jsx";
import { label } from "../lib/format.js";

const TYPES = [
  { value: "photo", label: "Photos" },
  { value: "video", label: "Videos" },
];

export default function Gallery() {
  const { rows, loading, error } = useCollection("gallery_items");
  const [type, setType] = useState("all");
  const [active, setActive] = useState(null);

  const filtered = useMemo(
    () => rows.filter((g) => type === "all" || g.type === type),
    [rows, type]
  );

  return (
    <div>
      <PageHeader
        icon={icons.images}
        title="Gallery"
        subtitle="Event photos, videos and achievement posters."
      />
      <CategoryFilter options={TYPES} value={type} onChange={setType} allLabel="All" />
      <ErrorNote error={error} />

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState>No media yet.</EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((g) => (
            <button
              key={g.id}
              onClick={() => setActive(g)}
              className="glass group relative aspect-square overflow-hidden text-left"
            >
              <img src={g.media_url} alt={g.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {g.type === "video" && (
                <span className="absolute inset-0 grid place-items-center bg-black/30 text-white">▶</span>
              )}
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/85 to-transparent p-2 text-xs text-white">
                {g.title}
              </span>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
          onClick={() => setActive(null)}
        >
          <div className="glass max-w-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img src={active.media_url} alt={active.title} className="max-h-[75vh] w-full object-contain" />
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold text-white">{active.title}</p>
                <p className="text-xs text-[var(--color-mist)]">{label("type", active.type)}</p>
              </div>
              <button className="btn btn-ghost !px-2.5" onClick={() => setActive(null)} aria-label="Close">
                <Icon path={icons.close} size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
