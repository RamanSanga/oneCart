import { useContext, useState } from "react";
import googleIcon from "../assets/google.png";
import heroWomen from "../assets/hero_women.jpg";
import { Link, useNavigate } from "react-router-dom";
import { authDataContext } from "../Context/AuthContext";
import { userDataContext } from "../Context/UserContext";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";

export default function LoginPage() {
  const [form, setForm]             = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]  = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error,        setError]    = useState("");

  const { serverUrl }   = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const navigate        = useNavigate();

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${serverUrl}/api/auth/login`, { email: form.email, password: form.password }, { withCredentials: true });
      await getCurrentUser();
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user   = result.user;
      await axios.post(`${serverUrl}/api/auth/googlelogin`, { name: user.displayName, email: user.email }, { withCredentials: true });
      await getCurrentUser();
      navigate("/");
    } catch (err) {
      setError(err.message || "Google login failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--cream)] text-[var(--ink)]">
      {/* ── LEFT IMAGE ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src={heroWomen} alt="OneCart editorial" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[var(--ink)]/20" />
        <div className="absolute bottom-12 left-10">
          <p className="text-white text-[10px] font-semibold uppercase tracking-[0.25em] mb-2">OneCart</p>
          <p className="text-white font-display font-light italic text-2xl leading-snug">
            Your wardrobe,<br />elevated.
          </p>
        </div>
      </div>

      {/* ── RIGHT FORM ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-sm">
          {/* back to home */}
          <Link to="/" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors mb-12 block">
            ← OneCart
          </Link>

          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-4">Welcome back</p>
          <h1 className="font-display font-light text-[var(--ink)] mb-10 leading-tight"
              style={{ fontSize: "clamp(28px, 3.5vw, 40px)" }}>
            Sign in to your account.
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-2">Email</label>
              <input
                name="email" type="email" required
                value={form.email} onChange={handleChange}
                placeholder="name@example.com"
                className="input-underline"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)]">Password</label>
                <button type="button" onClick={() => setShowPassword(p => !p)}
                        className="text-[9px] font-medium text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                name="password" type={showPassword ? "text" : "password"} required
                value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="input-underline"
              />
            </div>

            {error && <p className="text-[11px] text-red-500">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-[var(--ink)] text-white text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[var(--ink-80)] transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[9px] font-medium text-[var(--ink-30)] uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Google */}
          <button
            type="button" onClick={googleLogin} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 border border-[var(--border-md)] text-[11px] font-medium text-[var(--ink-60)] hover:text-[var(--ink)] hover:border-[var(--border-strong)] transition-colors disabled:opacity-50"
          >
            <img src={googleIcon} className="w-4 h-4" alt="Google" />
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <p className="mt-10 text-[12px] font-light text-[var(--ink-60)]">
            No account?{" "}
            <Link to="/signup" className="font-medium text-[var(--ink)] border-b border-[var(--ink)] pb-0.5 hover:text-[var(--ink-60)] transition-colors">
              Create one →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
