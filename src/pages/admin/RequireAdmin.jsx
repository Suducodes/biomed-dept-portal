import { Navigate } from "react-router-dom";
import { useAuth } from "../../lib/auth.jsx";
import { isLive } from "../../lib/supabase.js";
import { Loading } from "../../components/ui.jsx";

// Gate: only signed-in admins reach children. In demo mode (no Supabase),
// the dashboard is open so it can be previewed.
export default function RequireAdmin({ children }) {
  const { loading, user, isAdmin } = useAuth();
  if (!isLive) return children;
  if (loading) return <Loading label="Checking access…" />;
  if (!user || !isAdmin) return <Navigate to="/admin" replace />;
  return children;
}
