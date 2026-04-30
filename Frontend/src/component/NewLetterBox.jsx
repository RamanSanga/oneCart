import React, { useState, useContext } from "react";
import axios from "axios";
import { authDataContext } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";
import { FiMail, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/api/admin/newsletter/subscribe`, { email });
      if (res.data.success) {
        toast.success({ title: "Subscribed!", message: "You're on the list for exclusive offers." });
        setEmail("");
      }
    } catch (err) {
      toast.error({ title: "Oops!", message: err.response?.data?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative w-full mt-32 overflow-hidden rounded-[40px] mx-auto max-w-[95%] border border-white/10 bg-[#05060a] shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,215,128,0.10),transparent_24%),linear-gradient(135deg,#040406_0%,#0b0d11_45%,#05060a_100%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_45%,transparent_60%)] bg-size-[220%_100%] animate-[shimmer_10s_linear_infinite]" />

      {/* CONTENT */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28 text-center text-white"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.35em] text-white/58 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.9)]" />
          OneCart Insider
        </motion.div>

        <motion.h2 variants={itemVariants} className="mt-8 text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.045em] leading-[0.98] mb-6">
          Unlock 20% Off Your <br className="hidden md:block" /> First Premium Order
        </motion.h2>

        <motion.p variants={itemVariants} className="text-white/54 text-sm md:text-base max-w-2xl mx-auto mb-12 leading-8 font-light">
          Join our curated list of fashion enthusiasts and receive early access to seasonal drops, private sales, and an instant welcome offer, wrapped in a quiet, black premium layout.
        </motion.p>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="max-w-2xl mx-auto relative group">
           <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white/5 backdrop-blur-xl border border-white/10 p-3 sm:p-2 rounded-[1.75rem] focus-within:border-white/25 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <div className="hidden sm:flex pl-3 text-white/40">
                <FiMail size={20} />
              </div>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-transparent border-none outline-none text-sm py-4 sm:py-3 px-4 sm:px-0 text-white placeholder:text-white/30"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-white text-black px-8 py-4 sm:py-3 rounded-[1.2rem] sm:rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join Now"}
                {!loading && <FiArrowRight />}
              </button>
           </div>
        </motion.form>

        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[9px] tracking-widest uppercase text-white/28">
          <span className="rounded-full border border-white/10 bg-white/4 px-3 py-2">Private sales</span>
          <span className="rounded-full border border-white/10 bg-white/4 px-3 py-2">Early access</span>
          <span className="rounded-full border border-white/10 bg-white/4 px-3 py-2">Instant welcome offer</span>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-8 text-[9px] tracking-widest uppercase text-white/30">
          *First-time customers only · Automatically applied at checkout
        </motion.p>
      </motion.div>
    </section>
  );
}

export default Newsletter;
