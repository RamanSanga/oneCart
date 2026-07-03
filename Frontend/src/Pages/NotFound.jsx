import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userDataContext } from "../Context/UserContext";

function NotFound() {
  const navigate    = useNavigate();
  const { userData } = useContext(userDataContext);

  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <section className="min-h-screen bg-[var(--cream)] text-[var(--ink)] flex items-end pb-24 px-6 md:px-10 lg:px-16"
             style={{ paddingTop: "var(--nav-height)" }}>
      <div className="max-w-[1440px] w-full">
        <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--ink-40)] mb-8">404</p>
        <h1 className="font-display font-light leading-[1.0] tracking-tight text-[var(--ink)] mb-10"
            style={{ fontSize: "clamp(56px, 10vw, 160px)" }}>
          Not found.
        </h1>
        <p className="text-[14px] font-light text-[var(--ink-60)] max-w-[48ch] mb-12 leading-relaxed">
          {userData
            ? "This page no longer exists. Let's take you back to where you were."
            : "This page doesn't exist. Explore our latest collections instead."}
        </p>

        <div className="flex flex-wrap gap-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white bg-[var(--ink)] px-8 py-4 hover:bg-[var(--ink-80)] transition-colors"
          >
            Go to Homepage
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink-60)] border border-[var(--border-md)] px-8 py-4 hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors"
          >
            Go Back
          </button>
        </div>

        <p className="mt-24 text-[9px] font-medium uppercase tracking-[0.25em] text-[var(--ink-20)]">
          OneCart · You'll be redirected shortly.
        </p>
      </div>
    </section>
  );
}

export default NotFound;
