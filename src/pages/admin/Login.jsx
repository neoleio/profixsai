import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth-context.jsx";
import Logotype from "../../components/site/Logotype.jsx";

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    return <Navigate to={location.state?.from?.pathname || "/admin"} replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) navigate(location.state?.from?.pathname || "/admin", { replace: true });
    else setError("Invalid email or password.");
  }

  return (
    <div className="min-h-screen bg-ink grid place-items-center px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07] grayscale pointer-events-none"
        style={{ backgroundImage: "url(/assets/repair-macro-2.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
        aria-hidden="true"
      />
      <div className="w-full max-w-sm relative">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <img src="/assets/logo.png" alt="ProFixSAI logo" className="w-11 h-11 rounded-full object-cover" />
          <Logotype size="xl" />
        </div>
        <form onSubmit={onSubmit} className="bg-white rounded-card p-7 flex flex-col gap-4">
          <div>
            <h1 className="font-display font-semibold text-lg">Staff Login</h1>
            <p className="text-sm text-ink/50 mt-0.5">Sign in to manage repairs.</p>
          </div>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink/80">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink/80">Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
          </label>
          {error && <p className="text-sm text-brand-red">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary mt-1 disabled:opacity-60">
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
