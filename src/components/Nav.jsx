import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Icon, icons } from "./Icons.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const links = [
  { to: "/notices", label: "Notices" },
  { to: "/announcements", label: "Announcements" },
  { to: "/events", label: "Events" },
  { to: "/achievements", label: "Achievements" },
  { to: "/calendar", label: "Calendar" },
  { to: "/exams", label: "Exams" },
  { to: "/downloads", label: "Downloads" },
  { to: "/gallery", label: "Gallery" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
    (isActive
      ? "text-[var(--color-text)] bg-[color-mix(in_oklab,var(--color-signal)_18%,transparent)]"
      : "text-[var(--color-mist)] hover:text-[var(--color-text)]");

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-ink)_88%,transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-ink-2)] text-[var(--color-signal)] ring-1 ring-[var(--color-line)]">
            <Icon path={icons.heart} size={22} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-[var(--color-text)]">Biomedical Engineering</span>
            <span className="block text-[11px] text-[var(--color-mist)]">Department Portal · KPRIET</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <ThemeToggle />
          <Link to="/search" className="btn btn-ghost !px-2.5" aria-label="Search">
            <Icon path={icons.search} size={18} />
          </Link>
          <Link to="/admin" className="btn btn-primary hidden sm:inline-flex">
            Admin
          </Link>
          <button
            className="btn btn-ghost !px-2.5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <Icon path={open ? icons.close : icons.menu} size={18} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-[var(--color-line)] px-4 py-3 lg:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/admin" className="btn btn-primary mt-2" onClick={() => setOpen(false)}>
            Admin Login
          </Link>
        </nav>
      )}
    </header>
  );
}
