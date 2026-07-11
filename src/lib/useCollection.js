import { useCallback, useEffect, useState } from "react";
import { list } from "./api.js";

// Fetch a table into component state, with loading/error + a refresh().
export function useCollection(table) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await list(table));
      setError(null);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, refresh, setRows };
}
