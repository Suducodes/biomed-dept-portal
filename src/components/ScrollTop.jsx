import { useEffect, useState } from "react";
import { Icon, icons } from "./Icons.jsx";

// Floating "back to top" button that appears after scrolling down.
export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="btn btn-primary fixed bottom-5 right-5 z-40 !h-11 !w-11 !rounded-full !px-0 shadow-lg transition-all duration-300"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0) scale(1)" : "translateY(16px) scale(0.8)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <Icon path={icons.arrowUp} size={20} />
    </button>
  );
}
