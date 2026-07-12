import { useTheme } from "../lib/theme.jsx";
import { Icon, icons } from "./Icons.jsx";

// Animated sun/moon toggle. Icons cross-fade + rotate on switch.
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      onClick={toggle}
      className="btn btn-ghost !px-2.5 relative"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      <span className="relative grid h-[18px] w-[18px] place-items-center">
        <span
          className="absolute transition-all duration-300"
          style={{
            opacity: dark ? 1 : 0,
            transform: dark ? "rotate(0) scale(1)" : "rotate(-90deg) scale(0.4)",
          }}
        >
          <Icon path={icons.moon} size={18} />
        </span>
        <span
          className="absolute transition-all duration-300"
          style={{
            opacity: dark ? 0 : 1,
            transform: dark ? "rotate(90deg) scale(0.4)" : "rotate(0) scale(1)",
          }}
        >
          <Icon path={icons.sun} size={18} />
        </span>
      </span>
    </button>
  );
}
