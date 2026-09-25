import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth-context.jsx";

export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) {
    return <div className="min-h-screen grid place-items-center text-ink/50">Loading…</div>;
  }
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen grid place-items-center text-center px-6">
        <div>
          <h1 className="font-display font-bold text-2xl">Access restricted</h1>
          <p className="text-ink/60 mt-2">Your account doesn't have permission to view this page.</p>
        </div>
      </div>
    );
  }
  return children;
}
