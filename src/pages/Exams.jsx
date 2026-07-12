import { useCollection } from "../lib/useCollection.js";
import { PageHeader, Tag } from "../components/ui.jsx";
import { Icon, icons } from "../components/Icons.jsx";
import { fmtDate, relDate } from "../lib/format.js";
import { externalLinks } from "../data/subsites.js";

// Exam section = internal exam schedule (from calendar_events) + external links.
export default function Exams() {
  const { rows } = useCollection("calendar_events");
  const exams = rows
    .filter((c) => c.type === "internal_exam")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const links = [
    { title: "KPR Exam Cell", desc: "Timetables, hall tickets & exam notifications", url: externalLinks.kprExamCell, icon: icons.exam },
    { title: "Results Portal (COE)", desc: "Semester results & grade cards", url: externalLinks.results, icon: icons.doc },
  ];

  return (
    <div>
      <PageHeader
        icon={icons.exam}
        title="Exam Section"
        subtitle="Internal exam schedule, results and the KPR Exam Cell."
      />

      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        {links.map((l) => (
          <a key={l.title} href={l.url} target="_blank" rel="noreferrer" className="card flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-ink-2)] text-[var(--color-signal)] ring-1 ring-[var(--color-line)]">
              <Icon path={l.icon} size={24} />
            </span>
            <div>
              <p className="flex items-center gap-1 font-semibold text-[var(--color-text)]">{l.title} <Icon path={icons.external} size={13} /></p>
              <p className="text-sm text-[var(--color-mist)]">{l.desc}</p>
            </div>
          </a>
        ))}
      </section>

      <h2 className="section-title mb-3">Internal exam schedule</h2>
      {exams.length === 0 ? (
        <div className="card text-sm text-[var(--color-mist)]">No internal exams scheduled yet.</div>
      ) : (
        <div className="space-y-2">
          {exams.map((e) => (
            <div key={e.id} className="card flex items-center gap-3 !py-3">
              <Icon path={icons.calendar} size={18} />
              <div className="flex-1">
                <span className="font-medium text-[var(--color-text)]">{e.title}</span>
                {e.description && <span className="ml-2 text-sm text-[var(--color-mist)]">{e.description}</span>}
              </div>
              <Tag tone="signal">{fmtDate(e.date)}</Tag>
              <span className="text-xs text-[var(--color-signal)]">{relDate(e.date)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
