import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid place-items-center py-24 text-center">
      <p className="text-5xl font-extrabold text-[var(--color-signal)]">404</p>
      <p className="mt-2 text-lg text-white">Page not found</p>
      <p className="mt-1 text-sm text-[var(--color-mist)]">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary mt-6">Back to home</Link>
    </div>
  );
}
