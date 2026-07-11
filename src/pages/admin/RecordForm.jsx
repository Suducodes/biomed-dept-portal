import { useState } from "react";
import { uploadFile } from "../../lib/api.js";
import { Icon, icons } from "../../components/Icons.jsx";
import { ErrorNote } from "../../components/ui.jsx";

const toInputDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d - off).toISOString().slice(0, 16);
};

function initialValues(fields, record) {
  const v = {};
  for (const f of fields) {
    if (record && record[f.name] != null) {
      v[f.name] = f.type === "date" ? toInputDate(record[f.name]) : record[f.name];
    } else if (f.default === "now") {
      v[f.name] = toInputDate(new Date().toISOString());
    } else if (f.default != null) {
      v[f.name] = f.default;
    } else if (f.type === "select") {
      // Default to the first option so an untouched dropdown saves its
      // visible value rather than an empty string.
      v[f.name] = f.options[0].value;
    } else {
      v[f.name] = f.type === "checkbox" ? false : "";
    }
  }
  return v;
}

// Generic create/edit form driven by a table's field config.
export default function RecordForm({ schema, record, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => initialValues(schema.fields, record));
  const [uploading, setUploading] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  async function handleFile(field, file) {
    if (!file) return;
    setErr(null);
    setUploading((u) => ({ ...u, [field.name]: true }));
    try {
      const url = await uploadFile(field.bucket, file);
      set(field.name, url);
    } catch (e) {
      setErr(`Upload failed: ${e.message || e}`);
    } finally {
      setUploading((u) => ({ ...u, [field.name]: false }));
    }
  }

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const payload = {};
      for (const f of schema.fields) {
        let val = values[f.name];
        if (f.type === "date" && val) val = new Date(val).toISOString();
        if (val === "") val = null;
        payload[f.name] = val;
      }
      await onSubmit(payload);
    } catch (e2) {
      setErr(e2.message || String(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {schema.fields.map((f) => (
        <div key={f.name}>
          <label className="label">
            {f.label || f.name.replace(/_/g, " ")}
            {f.required && <span className="text-[var(--color-alert)]"> *</span>}
          </label>

          {f.type === "text" && (
            <input className="input" value={values[f.name] || ""} onChange={(e) => set(f.name, e.target.value)} required={f.required} />
          )}

          {f.type === "textarea" && (
            <textarea className="input min-h-24" value={values[f.name] || ""} onChange={(e) => set(f.name, e.target.value)} required={f.required} />
          )}

          {f.type === "select" && (
            <select className="input" value={values[f.name] || f.options[0].value} onChange={(e) => set(f.name, e.target.value)}>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}

          {f.type === "date" && (
            <input type="datetime-local" className="input" value={values[f.name] || ""} onChange={(e) => set(f.name, e.target.value)} required={f.required} />
          )}

          {f.type === "checkbox" && (
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" checked={!!values[f.name]} onChange={(e) => set(f.name, e.target.checked)} />
              {f.label || f.name}
            </label>
          )}

          {f.type === "file" && (
            <div className="flex items-center gap-3">
              <label className="btn btn-ghost cursor-pointer">
                <Icon path={icons.upload} size={16} />
                {uploading[f.name] ? "Uploading…" : "Choose file"}
                <input type="file" className="hidden" onChange={(e) => handleFile(f, e.target.files?.[0])} />
              </label>
              {values[f.name] && (
                <a href={values[f.name]} target="_blank" rel="noreferrer" className="truncate text-xs text-[var(--color-signal)] hover:underline">
                  Uploaded ✓
                </a>
              )}
            </div>
          )}
        </div>
      ))}

      <ErrorNote error={err} />
      <div className="flex gap-2">
        <button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
