// src/admin/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/admin-sam8";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Couldn't sign in. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl tracking-wide text-mist-100 text-center mb-1">
          SAM<span className="text-marquee-500">CINEBD</span>
        </h1>
        <p className="text-center text-sm text-mist-500 mb-8">Admin Dashboard</p>

        <form onSubmit={handleSubmit} className="surface-card p-6 space-y-4">
          <div>
            <label className="block text-xs text-mist-500 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-ink-900 border border-ink-600 rounded-md px-3 py-2.5 text-sm text-mist-100 focus:border-marquee-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-mist-500 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-ink-900 border border-ink-600 rounded-md px-3 py-2.5 text-sm text-mist-100 focus:border-marquee-500 transition-colors"
            />
          </div>

          {error && <p className="text-xs text-signal-mature">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-pill bg-marquee-500 text-ink-950 font-semibold text-sm hover:bg-marquee-400 transition-colors disabled:opacity-50"
          >
            <LogIn size={15} />
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
