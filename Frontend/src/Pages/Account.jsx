import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { userDataContext } from "../Context/UserContext.jsx";
import OurPolicy from "../component/OurPolicy";

export default function Account() {
  const { userData } = useContext(userDataContext);
  if (!userData) return null;

  const fields = [
    { label: "Full Name",     value: userData.name },
    { label: "Email",         value: userData.email },
    { label: "Account Type",  value: userData.role || "Customer" },
    { label: "Member Since",  value: new Date(userData.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
  ];

  return (
    <div className="min-h-screen bg-[var(--cream)]" style={{ paddingTop: "var(--nav-height)" }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-14">

        {/* Header */}
        <div className="border-b border-[var(--border)] pb-8 mb-12">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-2">OneCart</p>
          <h1 className="font-display font-light text-[var(--ink)]" style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
            Your Account
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar nav */}
          <aside className="lg:col-span-3">
            <div className="sticky space-y-1" style={{ top: "calc(var(--nav-height) + 24px)" }}>
              {[
                { label: "Profile",    path: "/account" },
                { label: "Orders",     path: "/order" },
                { label: "Wishlist",   path: "/wishlist" },
              ].map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-[12px] font-medium text-[var(--ink-60)] hover:text-[var(--ink)] py-2.5 border-b border-[var(--border)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </aside>

          {/* Profile detail */}
          <main className="lg:col-span-9">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-8">Profile Details</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              {fields.map(f => (
                <div key={f.label} className="border-b border-[var(--border)] pb-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-2">{f.label}</p>
                  <p className="text-[14px] font-light text-[var(--ink)]">{f.value}</p>
                </div>
              ))}

              {/* User ID — smaller, less prominent */}
              <div className="sm:col-span-2 border-b border-[var(--border)] pb-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-2">User ID</p>
                <p className="text-[11px] font-mono text-[var(--ink-30)] break-all">#{userData._id}</p>
              </div>
            </div>

            <p className="mt-10 text-[12px] font-light text-[var(--ink-40)]">
              To update your details, please{" "}
              <Link to="/contact" className="text-[var(--ink)] underline underline-offset-2 hover:text-[var(--ink-60)] transition-colors">
                contact us
              </Link>.
            </p>
          </main>
        </div>
      </div>
      <OurPolicy />
    </div>
  );
}
