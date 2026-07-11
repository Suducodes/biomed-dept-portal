import { Outlet } from "react-router-dom";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";
import EmergencyBanner from "./EmergencyBanner.jsx";
import { isLive } from "../lib/supabase.js";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      {!isLive && (
        <div className="bg-[color-mix(in_oklab,var(--color-signal)_16%,transparent)] px-4 py-1.5 text-center text-xs text-[var(--color-signal)]">
          Demo mode — showing sample content. Connect Supabase to go live.
        </div>
      )}
      <Nav />
      <EmergencyBanner />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
