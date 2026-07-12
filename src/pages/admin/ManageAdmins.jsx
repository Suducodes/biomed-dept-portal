import { useCallback, useEffect, useState } from "react";
import { supabase, isLive } from "../../lib/supabase.js";
import { useAuth } from "../../lib/auth.jsx";
import { Icon, icons } from "../../components/Icons.jsx";
import { Loading, EmptyState, ErrorNote } from "../../components/ui.jsx";
import { fmtDate } from "../../lib/format.js";

// Self-serve admin management: grant/revoke access by email via SECURITY
// DEFINER RPCs (see supabase/schema.sql) so no one needs SQL-editor access
// to add the next admin. The person being granted access must already have
// signed up at /#/admin themselves — this only promotes an existing account.
export default function ManageAdmins() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.rpc("list_admins");
      if (err) throw err;
      setAdmins(data || []);
      setError(null);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLive) refresh();
  }, [refresh]);

  if (!isLive) {
    return (
      <EmptyState>Connect Supabase to manage admins (see README).</EmptyState>
    );
  }

  async function grant(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error: err } = await supabase.rpc("grant_admin", {
        target_email: email.trim(),
        target_display_name: name.trim() || null,
      });
      if (err) throw err;
      setEmail("");
      setName("");
      await refresh();
    } catch (e2) {
      setError(e2.message || String(e2));
    } finally {
      setBusy(false);
    }
  }

  async function revoke(targetEmail) {
    if (!window.confirm(`Revoke admin access for ${targetEmail}?`)) return;
    setError(null);
    try {
      const { error: err } = await supabase.rpc("revoke_admin", { target_email: targetEmail });
      if (err) throw err;
      await refresh();
    } catch (e2) {
      setError(e2.message || String(e2));
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-title text-xl">Admins</h2>
      </div>

      <div className="card mb-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Grant access</h3>
        <p className="mb-3 text-xs text-[var(--color-mist)]">
          The person must already have an account — they sign up at{" "}
          <code className="text-[var(--color-signal)]">/#/admin</code> first, then you promote
          them here.
        </p>
        <form onSubmit={grant} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="label">Email</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@kpriet.ac.in" />
          </div>
          <div className="min-w-[160px] flex-1">
            <label className="label">Display name (optional)</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </div>
          <button className="btn btn-primary" disabled={busy}>
            <Icon path={icons.plus} size={16} /> {busy ? "Granting…" : "Grant admin"}
          </button>
        </form>
      </div>

      <ErrorNote error={error} />

      {loading ? (
        <Loading />
      ) : admins.length === 0 ? (
        <EmptyState>No admins found.</EmptyState>
      ) : (
        <div className="space-y-2">
          {admins.map((a) => {
            const isSelf = a.email === user?.email;
            return (
              <div key={a.id} className="card flex items-center gap-3 !py-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--color-ink-2)] text-[var(--color-signal)] ring-1 ring-[var(--color-line)]">
                  <Icon path={icons.shield} size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">
                    {a.display_name || a.email} {isSelf && <span className="text-xs text-[var(--color-mist)]">(you)</span>}
                  </p>
                  <p className="text-xs text-[var(--color-mist)]">{a.email} · admin since {fmtDate(a.created_at)}</p>
                </div>
                <button
                  className="btn btn-ghost !px-3 hover:!border-[var(--color-alert)] hover:!text-[var(--color-alert)] disabled:opacity-40"
                  onClick={() => revoke(a.email)}
                  disabled={isSelf}
                  title={isSelf ? "You can't revoke your own access" : "Revoke access"}
                >
                  <Icon path={icons.trash} size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
