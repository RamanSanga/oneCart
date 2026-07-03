import React, { useState, useContext } from "react";
import axios from "axios";
import { authDataContext } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";

/**
 * Full-width dark editorial newsletter section.
 * Headline: "Receive the edit." (Playfair italic)
 * One-line email input + subscribe button.
 */
function Newsletter() {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const { serverUrl }       = useContext(authDataContext);
  const toast               = useToast();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/api/admin/newsletter/subscribe`, { email });
      if (res.data.success) {
        toast.success({ title: "You're on the list.", message: "Expect something special soon." });
        setEmail("");
      }
    } catch (err) {
      toast.error({ title: "Error", message: err.response?.data?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[var(--ink)] text-white px-6 md:px-10 lg:px-16 py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12">
        {/* headline */}
        <div className="space-y-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40">Newsletter</p>
          <h2 className="font-display font-light italic leading-tight text-white"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Receive the edit.
          </h2>
          <p className="text-[13px] font-light leading-relaxed text-white/50 max-w-[40ch]">
            Early access to new collections, private offers, and curated drops — delivered directly to you.
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="w-full md:max-w-sm">
          <div className="flex items-center border-b border-white/30 pb-3 gap-4 focus-within:border-white transition-colors">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent outline-none text-[13px] font-light text-white placeholder:text-white/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors shrink-0 disabled:opacity-40"
            >
              {loading ? "..." : "Subscribe →"}
            </button>
          </div>
          <p className="mt-3 text-[9px] text-white/25 tracking-wide">
            No spam. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
