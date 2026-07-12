import { useCollection } from "../lib/useCollection.js";
import { PageHeader, Loading, EmptyState, ErrorNote } from "../components/ui.jsx";
import { Icon, icons } from "../components/Icons.jsx";
import { fmtDate, relDate, label } from "../lib/format.js";

const TONE = {
  info: { ring: "var(--color-line)", text: "var(--color-mist)" },
  important: { ring: "var(--color-signal)", text: "var(--color-signal)" },
  emergency: { ring: "var(--color-alert)", text: "var(--color-alert)" },
};

export default function Announcements() {
  const { rows, loading, error } = useCollection("announcements");
  const active = rows.filter((a) => a.active);

  return (
    <div>
      <PageHeader
        icon={icons.megaphone}
        title="Announcements"
        subtitle="Latest updates, important alerts and emergency notices."
      />
      <ErrorNote error={error} />
      {loading ? (
        <Loading />
      ) : active.length === 0 ? (
        <EmptyState>No active announcements.</EmptyState>
      ) : (
        <div className="space-y-3">
          {active.map((a) => {
            const tone = TONE[a.severity] || TONE.info;
            return (
              <article key={a.id} className="glass p-4" style={{ borderColor: tone.ring }}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5" style={{ color: tone.text }}>
                    <Icon path={icons.megaphone} size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: tone.text }}>
                        {label("severity", a.severity)}
                      </span>
                      <span className="text-xs text-[var(--color-mist)]">· {relDate(a.published_at)}</span>
                    </div>
                    <p className="text-sm text-[var(--color-text)]">{a.message}</p>
                    <p className="mt-1 text-xs text-[var(--color-mist)]">{fmtDate(a.published_at)}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
