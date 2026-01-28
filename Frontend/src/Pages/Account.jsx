// src/Pages/Account.jsx
import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import Nav from "../component/Nav.jsx";

function Account() {
  const { userData } = useContext(userDataContext);
  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111]">
      <Nav />

      <main className="pt-[110px] px-6 md:px-16 lg:px-32">
        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-[42px] font-light tracking-wide">
            Account
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage your personal information
          </p>
        </div>

        {/* CARD */}
        <section className="max-w-3xl bg-white border border-gray-200 rounded-none p-12">
          <h2 className="text-lg tracking-widest font-medium mb-10">
            PROFILE DETAILS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20 text-sm">
            <div>
              <p className="uppercase text-gray-400 tracking-wider mb-2">
                Full Name
              </p>
              <p className="text-[15px]">{userData.name}</p>
            </div>

            <div>
              <p className="uppercase text-gray-400 tracking-wider mb-2">
                Email Address
              </p>
              <p className="text-[15px]">{userData.email}</p>
            </div>

            <div>
              <p className="uppercase text-gray-400 tracking-wider mb-2">
                User ID
              </p>
              <p className="text-[15px] break-all">{userData._id}</p>
            </div>

            <div>
              <p className="uppercase text-gray-400 tracking-wider mb-2">
                Account Type
              </p>
              <p className="text-[15px]">
                {userData.role || "Customer"}
              </p>
            </div>

            <div>
              <p className="uppercase text-gray-400 tracking-wider mb-2">
                Member Since
              </p>
              <p className="text-[15px]">
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Account;
