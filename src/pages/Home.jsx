import { Link } from "react-router-dom";
import { useCollection } from "../lib/useCollection.js";
import PosterCarousel from "../components/PosterCarousel.jsx";
import { Icon, icons } from "../components/Icons.jsx";
import { Tag } from "../components/ui.jsx";
import { fmtDate, relDate, label } from "../lib/format.js";
import { subsites, externalLinks } from "../data/subsites.js";

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] p-8 sm:p-12">
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-40" viewBox="0 0 1200 160" preserveAspectRatio="none">
        <path className="ecg-line" d="M0 100 H250 l30 -70 l40 120 l35 -150 l30 90 l25 -30 H1200"
          fill="none" stroke="var(--color-signal)" strokeWidth="2.5" />
      </svg>
      <div className="relative max-w-2xl">
        <span className="chip mb-4">Department of Biomedical Engineering · KPRIET</span>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          The department, <span className="text-[var(--color-signal)]">in one place.</span>
        </h1>
        <p className="mt-4 text-base text-[var(--color-mist)] sm:text-lg">
          Notices, announcements, events, achievements and academic resources —
          published by the department, always up to date.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/notices" className="btn btn-primary">
            <Icon path={icons.bell} size={18} /> Latest notices
          </Link>
          <Link to="/calendar" className="btn btn-ghost">
            <Icon path={icons.calendar} size={18} /> Academic calendar
          </Link>
        </div>
      </div>
    </section>
  );
}

function CarouselCard({ title, to, items }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="section-title">{title}</h3>
        <Link to={to} className="text-xs text-[var(--color-signal)] hover:underline">View all →</Link>
      </div>
      <PosterCarousel items={items} />
    </div>
  );
}

function SubSites() {
  return (
    <section>
      <h2 className="section-title mb-1 text-xl">Department Sub-sites</h2>
      <p className="mb-4 text-sm text-[var(--color-mist)]">Dedicated portals that live alongside this one.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {subsites.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="card group flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-ink-2)] ring-1 ring-[var(--color-line)]" style={{ color: s.accent }}>
              <Icon path={icons[s.icon] || icons.external} size={26} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{s.name}</span>
                <Icon path={icons.external} size={14} />
              </div>
              <p className="text-xs font-medium" style={{ color: s.accent }}>{s.tagline}</p>
              <p className="mt-1 text-sm text-[var(--color-mist)]">{s.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const notices = useCollection("notices");
  const events = useCollection("events");
  const achievements = useCollection("achievements");
  const announcements = useCollection("announcements");
  const calendar = useCollection("calendar_events");

  const latestNotices = notices.rows.slice(0, 5);
  const upcomingDates = calendar.rows
    .filter((c) => new Date(c.date) >= new Date(Date.now() - 86400000))
    .slice(0, 4);

  const achievementSlides = achievements.rows
    .filter((a) => a.image_url)
    .map((a) => ({ src: a.image_url, title: a.title, caption: label("type", a.type) }));
  const eventSlides = events.rows
    .filter((e) => e.poster_url)
    .map((e) => ({ src: e.poster_url, title: e.title, caption: fmtDate(e.event_date) }));
  const announceSlides = announcements.rows
    .filter((a) => a.active)
    .map((a) => ({
      src:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='800' height='500' fill='#0a0e17'/><text x='40' y='90' fill='#34d399' font-family='Inter' font-size='24'>${label("severity", a.severity).toUpperCase()}</text></svg>`
        ),
      title: a.message,
      caption: relDate(a.published_at),
    }));

  return (
    <div className="space-y-12">
      <Hero />

      <section className="grid gap-6 md:grid-cols-3">
        <CarouselCard title="Achievements" to="/achievements" items={achievementSlides} />
        <CarouselCard title="Events" to="/events" items={eventSlides} />
        <CarouselCard title="Announcements" to="/announcements" items={announceSlides} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title text-xl">Latest notices</h2>
            <Link to="/notices" className="text-xs text-[var(--color-signal)] hover:underline">All notices →</Link>
          </div>
          <div className="space-y-3">
            {latestNotices.map((n) => (
              <Link key={n.id} to="/notices" className="card flex items-start gap-3">
                {n.is_pinned && <span className="mt-0.5 text-[var(--color-signal)]"><Icon path={icons.pin} size={16} /></span>}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">{n.title}</span>
                    <Tag>{label("category", n.category)}</Tag>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-mist)]">{n.body}</p>
                </div>
                <span className="shrink-0 text-xs text-[var(--color-mist)]">{relDate(n.published_at)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="section-title mb-3 text-xl">Important dates</h2>
            <div className="card space-y-3">
              {upcomingDates.length === 0 && <p className="text-sm text-[var(--color-mist)]">No upcoming dates.</p>}
              {upcomingDates.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--color-ink-2)] text-[var(--color-signal)] ring-1 ring-[var(--color-line)]">
                    <Icon path={icons.calendar} size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{c.title}</p>
                    <p className="text-xs text-[var(--color-mist)]">{fmtDate(c.date)}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--color-signal)]">{relDate(c.date)}</span>
                </div>
              ))}
            </div>
          </div>

          <a href={externalLinks.kprExamCell} target="_blank" rel="noreferrer" className="card flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-ink-2)] text-[var(--color-signal-2)] ring-1 ring-[var(--color-line)]">
              <Icon path={icons.exam} size={20} />
            </span>
            <div>
              <p className="flex items-center gap-1 text-sm font-semibold text-white">KPR Exam Cell <Icon path={icons.external} size={13} /></p>
              <p className="text-xs text-[var(--color-mist)]">Timetables, hall tickets & results</p>
            </div>
          </a>
        </div>
      </section>

      <SubSites />
    </div>
  );
}
