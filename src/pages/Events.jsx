import { useMemo, useState } from "react";
import { useCollection } from "../lib/useCollection.js";
import { PageHeader, CategoryFilter, Loading, EmptyState, ErrorNote, Tag } from "../components/ui.jsx";
import { Icon, icons } from "../components/Icons.jsx";
import { fmtDate, relDate, label } from "../lib/format.js";

const TYPES = ["symposium", "workshop", "guest_lecture", "conference", "competition"].map((v) => ({
  value: v,
  label: label("type", v),
}));

function EventCard({ e }) {
  const upcoming = new Date(e.event_date) >= new Date();
  return (
    <article className="card overflow-hidden !p-0">
      {e.poster_url && (
        <div className="aspect-[16/9] w-full overflow-hidden border-b border-[var(--color-line)]">
          <img src={e.poster_url} alt={e.title} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Tag tone="signal">{label("type", e.type)}</Tag>
          <Tag tone={upcoming ? "signal" : "default"}>{upcoming ? "Upcoming" : "Past"}</Tag>
        </div>
        <h3 className="text-base font-semibold text-white">{e.title}</h3>
        <p className="mt-1 text-sm text-[var(--color-mist)]">{e.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--color-mist)]">
          <span className="inline-flex items-center gap-1"><Icon path={icons.calendar} size={14} /> {fmtDate(e.event_date)} · {relDate(e.event_date)}</span>
          {e.venue && <span>📍 {e.venue}</span>}
        </div>
      </div>
    </article>
  );
}

export default function Events() {
  const { rows, loading, error } = useCollection("events");
  const [type, setType] = useState("all");

  const { upcoming, past } = useMemo(() => {
    const f = rows.filter((e) => type === "all" || e.type === type);
    const now = new Date();
    return {
      upcoming: f.filter((e) => new Date(e.event_date) >= now).sort((a, b) => new Date(a.event_date) - new Date(b.event_date)),
      past: f.filter((e) => new Date(e.event_date) < now).sort((a, b) => new Date(b.event_date) - new Date(a.event_date)),
    };
  }, [rows, type]);

  return (
    <div>
      <PageHeader
        icon={icons.calendar}
        title="Events"
        subtitle="Symposiums, workshops, guest lectures, conferences and competitions."
      />
      <CategoryFilter options={TYPES} value={type} onChange={setType} />
      <ErrorNote error={error} />

      {loading ? (
        <Loading />
      ) : upcoming.length + past.length === 0 ? (
        <EmptyState>No events to show.</EmptyState>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <h2 className="section-title mb-3">Upcoming</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((e) => <EventCard key={e.id} e={e} />)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="section-title mb-3">Past</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((e) => <EventCard key={e.id} e={e} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
