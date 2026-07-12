import { Link } from "react-router-dom";
import { useCollection } from "../lib/useCollection.js";
import PosterCarousel from "../components/PosterCarousel.jsx";
import Reveal from "../components/Reveal.jsx";
import CountUp from "../components/CountUp.jsx";
import EcgTrace from "../components/EcgTrace.jsx";
import { Icon, icons } from "../components/Icons.jsx";
import { Tag } from "../components/ui.jsx";
import { useSpotlight } from "../lib/useSpotlight.js";
import { fmtDate, relDate, label, isNew, countdown } from "../lib/format.js";
import { subsites, externalLinks } from "../data/subsites.js";

function Hero({ nextEvent }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] p-8 sm:p-12">
      {/* floating gradient orbs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-signal), transparent 70%)" }} />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-signal-2), transparent 70%)" }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-60">
        <EcgTrace height={130} />
      </div>
      <div className="relative max-w-2xl">
        <span className="chip mb-4">
          <span className="pulse-dot mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]" />
          Department of Biomedical Engineering · KPRIET
        </span>
        <h1 className="font-display text-4xl font-bold leading-[1.05] text-[var(--color-text)] sm:text-6xl">
          The department, <span className="text-gradient text-glow">in one place.</span>
        </h1>
        <p className="mt-4 text-base text-[var(--color-mist)] sm:text-lg">
          Notices, announcements, events, achievements and academic resources —
          published by the department, always up to date.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link to="/notices" className="btn btn-primary">
            <Icon path={icons.bell} size={18} /> Latest notices
          </Link>
          <Link to="/calendar" className="btn btn-ghost">
            <Icon path={icons.calendar} size={18} /> Academic calendar
          </Link>
          {nextEvent && countdown(nextEvent.event_date) && (
            <Link to="/events" className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-line)] px-3 py-2 text-xs text-[var(--color-mist)] transition-colors hover:border-[var(--color-signal)] hover:text-[var(--color-text)]">
              <Icon path={icons.clock} size={14} />
              <span className="font-medium text-[var(--color-text)]">{nextEvent.title}</span>
              <span className="text-[var(--color-signal)]">{countdown(nextEvent.event_date)}</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function StatBand({ stats }) {
  const onMove = useSpotlight();
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 80}>
          <div className="card spotlight h-full" onMouseMove={onMove}>
            <div className="mb-2 flex items-center gap-2 text-[var(--color-mist)]">
              <Icon path={s.icon} size={18} />
              <span className="text-xs font-medium uppercase tracking-wide">{s.label}</span>
            </div>
            <div className="text-3xl font-extrabold text-[var(--color-text)]">
              <CountUp value={s.value} />
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function CarouselCard({ title, to, items, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="section-title">{title}</h3>
        <Link to={to} className="text-xs text-[var(--color-signal)] hover:underline">View all →</Link>
      </div>
      <PosterCarousel items={items} />
    </Reveal>
  );
}

function SubSites() {
  const onMove = useSpotlight();
  return (
    <section>
      <Reveal>
        <h2 className="section-title mb-1 text-xl">Department Sub-sites</h2>
        <p className="mb-4 text-sm text-[var(--color-mist)]">Dedicated portals that live alongside this one.</p>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2">
        {subsites.map((s, i) => (
          <Reveal key={s.name} delay={i * 90}>
            <a href={s.url} target="_blank" rel="noreferrer" className="card spotlight group flex h-full items-start gap-4" onMouseMove={onMove}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-ink-2)] ring-1 ring-[var(--color-line)] transition-transform group-hover:scale-110" style={{ color: s.accent }}>
                <Icon path={icons[s.icon] || icons.external} size={26} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--color-text)]">{s.name}</span>
                  <Icon path={icons.external} size={14} />
                </div>
                <p className="text-xs font-medium" style={{ color: s.accent }}>{s.tagline}</p>
                <p className="mt-1 text-sm text-[var(--color-mist)]">{s.description}</p>
              </div>
            </a>
          </Reveal>
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
  const downloads = useCollection("downloads");

  const now = Date.now();
  const latestNotices = notices.rows.slice(0, 5);
  const futureEvents = events.rows
    .filter((e) => new Date(e.event_date) >= new Date(now))
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  const nextEvent = futureEvents[0];
  const upcomingDates = calendar.rows
    .filter((c) => new Date(c.date) >= new Date(now - 86400000))
    .slice(0, 4);

  const stats = [
    { label: "Notices", value: notices.rows.length, icon: icons.bell },
    { label: "Upcoming events", value: futureEvents.length, icon: icons.calendar },
    { label: "Achievements", value: achievements.rows.length, icon: icons.trophy },
    { label: "Resources", value: downloads.rows.length, icon: icons.doc },
  ];

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
      <Hero nextEvent={nextEvent} />

      <StatBand stats={stats} />

      <section className="grid gap-6 md:grid-cols-3">
        <CarouselCard title="Achievements" to="/achievements" items={achievementSlides} delay={0} />
        <CarouselCard title="Events" to="/events" items={eventSlides} delay={90} />
        <CarouselCard title="Announcements" to="/announcements" items={announceSlides} delay={180} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
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
                    <span className="font-semibold text-[var(--color-text)]">{n.title}</span>
                    <Tag>{label("category", n.category)}</Tag>
                    {isNew(n.published_at) && <Tag tone="signal">NEW</Tag>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-mist)]">{n.body}</p>
                </div>
                <span className="shrink-0 text-xs text-[var(--color-mist)]">{relDate(n.published_at)}</span>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal className="space-y-6" delay={120}>
          <div>
            <h2 className="section-title mb-3 text-xl">Important dates</h2>
            <div className="card card-flat space-y-3">
              {upcomingDates.length === 0 && <p className="text-sm text-[var(--color-mist)]">No upcoming dates.</p>}
              {upcomingDates.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--color-ink-2)] text-[var(--color-signal)] ring-1 ring-[var(--color-line)]">
                    <Icon path={icons.calendar} size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--color-text)]">{c.title}</p>
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
              <p className="flex items-center gap-1 text-sm font-semibold text-[var(--color-text)]">KPR Exam Cell <Icon path={icons.external} size={13} /></p>
              <p className="text-xs text-[var(--color-mist)]">Timetables, hall tickets & results</p>
            </div>
          </a>
        </Reveal>
      </section>

      <SubSites />
    </div>
  );
}
