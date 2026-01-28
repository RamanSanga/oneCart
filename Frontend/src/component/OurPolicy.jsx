import React from "react";
import { useNavigate } from "react-router-dom";

function OurPolicy() {
  const navigate = useNavigate();

  return (
    <footer className="white mt-2">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-gray-700">

        {/* LEFT – BRAND + ADDRESS */}
        <div className="space-y-5">
          <h2 className="text-xl font-medium text-gray-900">
            OneCart
          </h2>

          <p className="text-gray-600 leading-relaxed max-w-sm">
            OneCart is your all-in-one online shopping destination,
            offering premium fashion, reliable service, and a seamless
            shopping experience inspired by global brands.
          </p>

          <div className="text-gray-600 leading-relaxed">
            <p className="font-medium text-gray-700 mb-1">
              Manufacturer
            </p>
            <p>
              OneCart Fashion Private Limited<br />
              Industrial Area, Model Town<br />
              Hisar, Haryana – 125001<br />
              India
            </p>
          </div>
        </div>

        {/* MIDDLE – COMPANY LINKS */}
        <div className="space-y-5">
          <h3 className="uppercase tracking-wide text-gray-900 font-medium">
            Company
          </h3>

          <ul className="space-y-2">
            <li
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-black transition"
            >
              Home
            </li>
            <li
              onClick={() => navigate("/collection")}
              className="cursor-pointer hover:text-black transition"
            >
              Collections
            </li>
            <li
              onClick={() => navigate("/about")}
              className="cursor-pointer hover:text-black transition"
            >
              About Us
            </li>
            <li
              onClick={() => navigate("/contact")}
              className="cursor-pointer hover:text-black transition"
            >
              Contact Us
            </li>
            <li
              onClick={() => navigate("/privacy")}
              className="cursor-pointer hover:text-black transition"
            >
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* RIGHT – GET IN TOUCH */}
        <div className="space-y-5">
          <h3 className="uppercase tracking-wide text-gray-900 font-medium">
            Get in Touch
          </h3>

          <div className="space-y-2 text-gray-600">
            <p>📞 +91-9306532302</p>
            <p>✉️ contact@onecart.com</p>
            <p>✉️ support@onecart.com</p>
          </div>

          <div className="text-gray-600 leading-relaxed pt-4">
            <p className="font-medium text-gray-700 mb-1">
              Registered Office
            </p>
            <p>
              OneCart Retail India Pvt. Ltd.<br />
              Corporate Office – Tower A<br />
              Sector 18, Hisar<br />
              Haryana – 125001, India
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} OneCart. All rights reserved.</p>
          <div className="flex gap-6">
            <span>India</span>
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default OurPolicy;
