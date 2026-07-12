import { useEffect } from "react";
import { Icon, icons } from "./Icons.jsx";

// Centered modal dialog with backdrop blur + scale-in. Closes on backdrop
// click or Escape.
export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      style={{ animation: "pageIn .2s ease" }}
    >
      <div
        className="glass max-h-[85vh] w-full max-w-lg overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "pageIn .28s cubic-bezier(.2,.7,.2,1)" }}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-[var(--color-text)]">{title}</h3>
          <button className="btn btn-ghost !px-2.5" onClick={onClose} aria-label="Close">
            <Icon path={icons.close} size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Page heading block used at the top of every content page.
export function PageHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      {icon && (
        <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-ink-2)] text-[var(--color-signal)] ring-1 ring-[var(--color-line)]">
          <Icon path={icon} size={24} />
        </span>
      )}
      <div>
        <h1 className="font-display text-3xl font-semibold text-[var(--color-text)] sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[var(--color-mist)]">{subtitle}</p>}
      </div>
    </div>
  );
}

export function CategoryFilter({ options, value, onChange, allLabel = "All" }) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      <button
        className={"chip " + (value === "all" ? "chip-active" : "")}
        onClick={() => onChange("all")}
      >
        {allLabel}
      </button>
      {options.map((o) => (
        <button
          key={o.value}
          className={"chip " + (value === o.value ? "chip-active" : "")}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative mb-5">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-mist)]">
        <Icon path={icons.search} size={18} />
      </span>
      <input
        className="input pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function Loading({ label = "Loading…" }) {
  return (
    <div className="grid place-items-center py-20 text-sm text-[var(--color-mist)]">
      <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-signal)]" />
      {label}
    </div>
  );
}

export function EmptyState({ children = "Nothing here yet." }) {
  return (
    <div className="card grid place-items-center py-14 text-center text-sm text-[var(--color-mist)]">
      {children}
    </div>
  );
}

export function ErrorNote({ error }) {
  if (!error) return null;
  return (
    <div className="mb-4 rounded-lg border border-[var(--color-alert)]/40 bg-[var(--color-alert)]/10 px-4 py-3 text-sm text-[var(--color-alert)]">
      {error}
    </div>
  );
}

// Small colored tag.
export function Tag({ children, tone = "default" }) {
  const tones = {
    default: "border-[var(--color-line)] text-[var(--color-mist)]",
    signal: "border-[var(--color-signal)]/50 text-[var(--color-signal)]",
    alert: "border-[var(--color-alert)]/50 text-[var(--color-alert)]",
  };
  return (
    <span className={"inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium " + (tones[tone] || tones.default)}>
      {children}
    </span>
  );
}
