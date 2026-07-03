import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheck } from "react-icons/fi";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-6 text-center"
      style={{ paddingTop: "var(--nav-height)" }}
    >
      <div className="max-w-sm w-full">
        {/* icon */}
        <div className="w-14 h-14 border border-[var(--border-md)] flex items-center justify-center mx-auto mb-10 text-[var(--ink-40)]">
          <FiCheck size={22} strokeWidth={1.5} />
        </div>

        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-4">OneCart</p>

        <h1
          className="font-display font-light text-[var(--ink)] mb-4 leading-tight"
          style={{ fontSize: "clamp(26px, 4vw, 42px)" }}
        >
          Order confirmed.
        </h1>

        <p className="text-[13px] font-light text-[var(--ink-60)] leading-relaxed mb-12 max-w-[36ch] mx-auto">
          Thank you for your purchase. Your order is now being prepared and you'll receive a confirmation shortly.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/order")}
            className="w-full py-4 bg-[var(--ink)] text-white text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[var(--ink-80)] transition-colors"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/collection")}
            className="w-full py-4 border border-[var(--border-md)] text-[var(--ink)] text-[10px] font-semibold uppercase tracking-[0.2em] hover:border-[var(--ink)] transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <p className="mt-10 text-[10px] text-[var(--ink-30)] uppercase tracking-widest">
          Need help? <Link to="/contact" className="underline hover:text-[var(--ink)] transition-colors">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
