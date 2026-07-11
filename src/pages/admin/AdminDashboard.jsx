import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { create, update, remove } from "../../lib/api.js";
import { useCollection } from "../../lib/useCollection.js";
import { useAuth } from "../../lib/auth.jsx";
import { isLive } from "../../lib/supabase.js";
import { SCHEMA, TABLE_ORDER } from "./adminSchema.js";
import RecordForm from "./RecordForm.jsx";
import { Icon, icons } from "../../components/Icons.jsx";
import { Loading, EmptyState, ErrorNote } from "../../components/ui.jsx";
import { fmtDate } from "../../lib/format.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [table, setTable] = useState(TABLE_ORDER[0]);
  const [editing, setEditing] = useState(null); // record | "new" | null
  const { rows, loading, error, refresh } = useCollection(table);

  const schema = SCHEMA[table];

  async function handleSubmit(payload) {
    if (editing === "new") await create(table, payload);
    else await update(table, editing.id, payload);
    setEditing(null);
    await refresh();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    await remove(table, id);
    await refresh();
  }

  function switchTable(t) {
    setTable(t);
    setEditing(null);
  }

  async function logout() {
    await signOut();
    navigate("/admin");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-[var(--color-mist)]">
            {isLive ? `Signed in${user?.email ? " as " + user.email : ""}` : "Demo mode — changes are not saved"}
          </p>
        </div>
        {isLive && (
          <button className="btn btn-ghost" onClick={logout}>
            <Icon path={icons.logout} size={16} /> Sign out
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Section switcher */}
        <nav className="flex flex-wrap gap-2 lg:flex-col">
          {TABLE_ORDER.map((t) => (
            <button
              key={t}
              onClick={() => switchTable(t)}
              className={
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                (t === table
                  ? "bg-[color-mix(in_oklab,var(--color-signal)_18%,transparent)] text-white"
                  : "text-[var(--color-mist)] hover:text-white")
              }
            >
              <Icon path={SCHEMA[t].icon} size={16} /> {SCHEMA[t].label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div>
          {editing ? (
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold text-white">
                {editing === "new" ? "New" : "Edit"} {schema.label.replace(/s$/, "")}
              </h2>
              <RecordForm schema={schema} record={editing === "new" ? null : editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="section-title text-xl">{schema.label}</h2>
                <button className="btn btn-primary" onClick={() => setEditing("new")}>
                  <Icon path={icons.plus} size={16} /> Add
                </button>
              </div>

              <ErrorNote error={error} />
              {loading ? (
                <Loading />
              ) : rows.length === 0 ? (
                <EmptyState>No entries yet. Click “Add” to create one.</EmptyState>
              ) : (
                <div className="space-y-2">
                  {rows.map((r) => (
                    <div key={r.id} className="card flex items-center gap-3 !py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">{r[schema.titleField] || "(untitled)"}</p>
                        <p className="text-xs text-[var(--color-mist)]">
                          {[r.category, r.type, r.severity].filter(Boolean).join(" · ")}
                          {r.published_at && ` · ${fmtDate(r.published_at)}`}
                          {r.event_date && ` · ${fmtDate(r.event_date)}`}
                          {r.date && ` · ${fmtDate(r.date)}`}
                        </p>
                      </div>
                      <button className="btn btn-ghost !px-2.5" onClick={() => setEditing(r)} aria-label="Edit">
                        <Icon path={icons.edit} size={16} />
                      </button>
                      <button className="btn btn-ghost !px-2.5 hover:!border-[var(--color-alert)] hover:!text-[var(--color-alert)]" onClick={() => handleDelete(r.id)} aria-label="Delete">
                        <Icon path={icons.trash} size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
