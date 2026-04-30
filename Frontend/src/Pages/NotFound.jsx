import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../Context/UserContext";

function NotFound() {
  const navigate = useNavigate();
  const { userData } = useContext(userDataContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <section className="min-h-screen bg-[#05060a] text-white flex items-center">
      <div className="w-full px-6 md:px-20">
        <div className="max-w-6xl">

          <p className="text-xs tracking-[0.45em] uppercase text-white/40 mb-8">
            Error 404
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-[96px] font-light leading-[1.05] tracking-tight">
            Page not found.
          </h1>

          <p className="mt-10 max-w-2xl text-lg md:text-xl text-white/60 leading-relaxed">
            {userData
              ? "This destination is no longer available. Let’s take you back to the collection."
              : "This page doesn’t exist. Discover our latest collection instead."}
          </p>

          <div className="mt-16 flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => navigate("/")}
              className="px-12 py-4 border border-white/15 text-sm tracking-[0.35em] uppercase hover:bg-white hover:text-black transition"
            >
              Explore Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-12 py-4 border border-white/15 text-sm tracking-[0.35em] uppercase hover:border-white transition"
            >
              Go Back
            </button>
          </div>

          {!userData && (
            <p className="mt-20 text-sm text-white/40">
              New here? <span onClick={() => navigate("/signup")} className="underline cursor-pointer hover:text-white">Create an account</span> to unlock a personalized experience.
            </p>
          )}

          <p className="mt-24 text-xs tracking-[0.4em] uppercase text-white/25">
            OneCart · Crafted Experiences
          </p>

        </div>
      </div>
    </section>
  );
}

export default NotFound;
