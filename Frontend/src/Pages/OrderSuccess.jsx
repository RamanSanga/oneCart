import React from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center">

        {/* SUCCESS ICON */}
        <div className="mx-auto mb-10 w-20 h-20 rounded-full border border-green-200 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
          Order Confirmed
        </h1>

        {/* SUBTEXT */}
        <p className="text-gray-500 text-sm md:text-base mb-12 leading-relaxed">
          Thank you for your purchase. Your order has been placed successfully
          and is now being processed.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">

          {/* VIEW ORDERS */}
          <button
            onClick={() => navigate("/orders")}
            className="px-8 py-3 border border-black text-sm tracking-wide hover:bg-black hover:text-white transition"
          >
            View My Orders
          </button>

          {/* CONTINUE SHOPPING */}
          <button
            onClick={() => navigate("/collection")}
            className="px-8 py-3 border border-gray-300 text-sm tracking-wide hover:border-black transition"
          >
            Continue Shopping
          </button>

          {/* HOME */}
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-black text-white text-sm tracking-wide hover:opacity-90 transition"
          >
            Go to Home
          </button>

        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;
