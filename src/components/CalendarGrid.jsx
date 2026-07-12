import { useMemo, useState } from "react";
import { Icon, icons } from "./Icons.jsx";
import { label } from "../lib/format.js";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Type → accent color for event dots.
export const TYPE_COLOR = {
  holiday: "var(--color-alert)",
  internal_exam: "var(--color-signal-2)",
  academic: "var(--color-signal)",
  college: "#818cf8",
};

const keyOf = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
};
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Month-grid calendar with event dots, a live "today" marker, and a
// selectable day that drives the agenda panel alongside it.
export default function CalendarGrid({ events = [] }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(new Date(today));

  const byDay = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      const k = keyOf(e.date);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(e);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build a 6-row grid of Date objects (leading/trailing days from siblings).
  const cells = [];
  for (let i = 0; i < firstDow; i++) {
    cells.push(new Date(year, month, i - firstDow + 1));
  }
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) {
    cells.push(new Date(year, month, daysInMonth + (cells.length % 7)));
  }

  const step = (delta) => setCursor(new Date(year, month + delta, 1));
  const goToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(new Date(today));
  };

  const selectedEvents = byDay.get(keyOf(selected)) || [];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      {/* Calendar */}
      <div className="card card-flat !p-4 sm:!p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">{MONTHS[month]}</h2>
            <p className="text-xs text-[var(--color-mist)]">{year}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="btn btn-ghost !px-2.5" onClick={() => step(-1)} aria-label="Previous month">
              <Icon path={icons.chevronLeft} size={16} />
            </button>
            <button className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={goToday}>Today</button>
            <button className="btn btn-ghost !px-2.5" onClick={() => step(1)} aria-label="Next month">
              <Icon path={icons.chevronRight} size={16} />
            </button>
          </div>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mist)]">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            const inMonth = date.getMonth() === month;
            const isToday = sameDay(date, today);
            const isSelected = sameDay(date, selected);
            const dayEvents = byDay.get(keyOf(date)) || [];
            return (
              <button
                key={i}
                onClick={() => setSelected(new Date(date))}
                className={
                  "group relative flex min-h-[62px] flex-col rounded-lg border p-1.5 text-left transition-all sm:min-h-[76px] " +
                  (isSelected
                    ? "border-[var(--color-signal)] bg-[color-mix(in_oklab,var(--color-signal)_14%,transparent)]"
                    : "border-transparent hover:border-[var(--color-line)] hover:bg-[var(--glass-hi)]") +
                  (inMonth ? "" : " opacity-35")
                }
              >
                <span
                  className={
                    "grid h-6 w-6 place-items-center rounded-full text-xs font-medium " +
                    (isToday
                      ? "bg-[var(--color-signal)] font-bold text-[#04120c]"
                      : "text-[var(--color-text)]")
                  }
                >
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-1 pt-1">
                    {dayEvents.slice(0, 4).map((e, k) => (
                      <span
                        key={k}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: TYPE_COLOR[e.type] || "var(--color-signal)" }}
                        title={e.title}
                      />
                    ))}
                    {dayEvents.length > 4 && (
                      <span className="text-[9px] leading-none text-[var(--color-mist)]">+{dayEvents.length - 4}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 border-t border-[var(--color-line)] pt-3">
          {Object.entries(TYPE_COLOR).map(([t, c]) => (
            <span key={t} className="inline-flex items-center gap-1.5 text-[11px] text-[var(--color-mist)]">
              <span className="h-2 w-2 rounded-full" style={{ background: c }} /> {label("type", t)}
            </span>
          ))}
        </div>
      </div>

      {/* Agenda for the selected day */}
      <div className="card card-flat">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-mist)]">
          {sameDay(selected, today) ? "Today" : selected.toLocaleDateString("en-IN", { weekday: "long" })}
        </p>
        <p className="mb-4 text-lg font-bold text-[var(--color-text)]">
          {selected.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        {selectedEvents.length === 0 ? (
          <p className="text-sm text-[var(--color-mist)]">No events on this day.</p>
        ) : (
          <div className="space-y-2">
            {selectedEvents.map((e) => (
              <div key={e.id} className="rounded-lg border border-[var(--color-line)] bg-[var(--color-ink-2)] p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: TYPE_COLOR[e.type] || "var(--color-signal)" }} />
                  <span className="text-sm font-medium text-[var(--color-text)]">{e.title}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 pl-4">
                  <span className="text-[11px] text-[var(--color-mist)]">{label("type", e.type)}</span>
                  {e.description && <span className="text-[11px] text-[var(--color-mist)]">· {e.description}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
