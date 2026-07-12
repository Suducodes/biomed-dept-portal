import { Link } from "react-router-dom";
import { Icon, icons } from "./Icons.jsx";
import { externalLinks, subsites } from "../data/subsites.js";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--color-line)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[var(--color-text)]">
            <Icon path={icons.heart} size={20} />
            <span className="font-bold">Biomedical Engineering</span>
          </div>
          <p className="text-sm text-[var(--color-mist)]">
            Department of Biomedical Engineering, KPR Institute of Engineering and
            Technology. Official notices, events and resources.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Quick links</h4>
          <ul className="space-y-2 text-sm text-[var(--color-mist)]">
            <li><Link to="/notices" className="hover:text-[var(--color-text)]">Notices</Link></li>
            <li><Link to="/events" className="hover:text-[var(--color-text)]">Events</Link></li>
            <li><Link to="/downloads" className="hover:text-[var(--color-text)]">Downloads</Link></li>
            <li><Link to="/calendar" className="hover:text-[var(--color-text)]">Academic Calendar</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Sub-sites</h4>
          <ul className="space-y-2 text-sm text-[var(--color-mist)]">
            {subsites.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--color-text)]">
                  {s.name} <Icon path={icons.external} size={13} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-[var(--color-text)]">External</h4>
          <ul className="space-y-2 text-sm text-[var(--color-mist)]">
            <li><a href={externalLinks.kprExamCell} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--color-text)]">KPR Exam Cell <Icon path={icons.external} size={13} /></a></li>
            <li><a href={externalLinks.results} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--color-text)]">Results <Icon path={icons.external} size={13} /></a></li>
            <li><a href={externalLinks.college} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--color-text)]">College Website <Icon path={icons.external} size={13} /></a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-line)] px-4 py-4 text-center text-xs text-[var(--color-mist)]">
        © {new Date().getFullYear()} Department of Biomedical Engineering, KPRIET · Built by BMESI
      </div>
    </footer>
  );
}
