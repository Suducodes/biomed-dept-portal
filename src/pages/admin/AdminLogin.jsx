import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth.jsx";
import { isLive } from "../../lib/supabase.js";
import { PageHeader, ErrorNote } from "../../components/ui.jsx";
import { Icon, icons } from "../../components/Icons.jsx";

export default function AdminLogin() {
  const { user, isAdmin, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isLive && user && isAdmin) navigate("/admin/dashboard", { replace: true });
  }, [user, isAdmin, navigate]);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/admin/dashboard", { replace: true });
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setMsg("Account created. Ask an existing admin to grant you access, then sign in.");
        setMode("signin");
      }
    } catch (e2) {
      setErr(e2.message || String(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <PageHeader icon={icons.logout} title="Admin Access" subtitle="Sign in to manage department content." />

      {!isLive && (
        <div className="mb-4 rounded-lg border border-[var(--color-signal)]/40 bg-[var(--color-signal)]/10 px-4 py-3 text-sm text-[var(--color-signal)]">
          Demo mode — Supabase isn't connected. You can open the{" "}
          <button className="underline" onClick={() => navigate("/admin/dashboard")}>dashboard preview</button>{" "}
          directly. Changes won't be saved.
        </div>
      )}

      <form onSubmit={submit} className="card space-y-4">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!isLive} placeholder="you@kpriet.ac.in" />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={!isLive} placeholder="••••••••" />
        </div>

        <ErrorNote error={err} />
        {msg && <p className="text-sm text-[var(--color-signal)]">{msg}</p>}

        <button className="btn btn-primary w-full" disabled={busy || !isLive}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>

        <p className="text-center text-xs text-[var(--color-mist)]">
          {mode === "signin" ? "First-time admin? " : "Already have an account? "}
          <button type="button" className="text-[var(--color-signal)] hover:underline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} disabled={!isLive}>
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
}
