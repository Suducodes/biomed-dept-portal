import { useCollection } from "../lib/useCollection.js";
import { Icon, icons } from "./Icons.jsx";

// Site-wide strip: shows the newest active "emergency" announcement.
export default function EmergencyBanner() {
  const { rows } = useCollection("announcements");
  const emergency = rows.find((a) => a.active && a.severity === "emergency");
  if (!emergency) return null;

  return (
    <div className="border-b border-[var(--color-alert)]/40 bg-[var(--color-alert)]/12">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-alert)]">
        <Icon path={icons.megaphone} size={18} />
        <span className="font-semibold uppercase tracking-wide">Emergency</span>
        <span className="text-[#ffd9df]">{emergency.message}</span>
      </div>
    </div>
  );
}
