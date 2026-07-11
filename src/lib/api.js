import { supabase, isLive } from "./supabase.js";
import { sampleData } from "../data/sampleData.js";

// Per-table config: which column to order by (desc) when listing.
export const TABLES = {
  announcements: { order: "published_at" },
  notices: { order: "published_at" },
  events: { order: "event_date" },
  achievements: { order: "date" },
  calendar_events: { order: "date", asc: true },
  downloads: { order: "uploaded_at" },
  gallery_items: { order: "id" },
};

// In demo mode we keep an in-memory, mutable clone so the admin panel's
// create/edit/delete still work for previewing (resets on reload).
const demoStore = structuredClone(sampleData);
const uid = () => "x" + Math.random().toString(36).slice(2, 9);

function sortRows(rows, cfg) {
  const col = cfg.order;
  return [...rows].sort((a, b) => {
    const av = a[col] ?? "";
    const bv = b[col] ?? "";
    if (av === bv) return 0;
    const cmp = av < bv ? -1 : 1;
    return cfg.asc ? cmp : -cmp;
  });
}

export async function list(table) {
  const cfg = TABLES[table];
  if (!cfg) throw new Error(`Unknown table: ${table}`);

  if (!isLive) {
    return sortRows(demoStore[table] || [], cfg);
  }

  let q = supabase.from(table).select("*").order(cfg.order, { ascending: !!cfg.asc });
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function create(table, row) {
  if (!isLive) {
    const record = { id: uid(), ...row };
    demoStore[table] = [record, ...(demoStore[table] || [])];
    return record;
  }
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function update(table, id, patch) {
  if (!isLive) {
    demoStore[table] = (demoStore[table] || []).map((r) =>
      r.id === id ? { ...r, ...patch } : r
    );
    return demoStore[table].find((r) => r.id === id);
  }
  const { data, error } = await supabase
    .from(table)
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function remove(table, id) {
  if (!isLive) {
    demoStore[table] = (demoStore[table] || []).filter((r) => r.id !== id);
    return;
  }
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

// Upload a file to a Storage bucket and return its public URL.
export async function uploadFile(bucket, file) {
  if (!isLive) {
    // Demo: hand back a local object URL so previews work without a backend.
    return URL.createObjectURL(file);
  }
  const path = `${Date.now()}-${file.name.replace(/[^\w.\-]+/g, "_")}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
