import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function OurPolicy() {
  const navigate = useNavigate();

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#05060a] mt-24 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-white/70">

        {/* LEFT – BRAND + ADDRESS */}
        <div className="space-y-5">
          <h2 className="text-xl font-medium text-white tracking-tight">
            OneCart
          </h2>

          <p className="text-white/60 leading-relaxed max-w-sm font-light">
            OneCart is your all-in-one online shopping destination,
            offering premium fashion, reliable service, and a seamless
            shopping experience inspired by global brands.
          </p>

          <div className="text-white/60 leading-relaxed font-light">
            <p className="font-medium text-white mb-1">
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
          <h3 className="uppercase tracking-widest text-[10px] text-white/50 font-bold">
            Company
          </h3>

          <ul className="space-y-3 font-light text-white/55">
            <li
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-white transition-colors inline-block"
            >
              Home
            </li><br/>
            <li
              onClick={() => navigate("/collection")}
              className="cursor-pointer hover:text-white transition-colors inline-block"
            >
              Collections
            </li><br/>
            <li
              onClick={() => navigate("/about")}
              className="cursor-pointer hover:text-white transition-colors inline-block"
            >
              About Us
            </li><br/>
            <li
              onClick={() => navigate("/contact")}
              className="cursor-pointer hover:text-white transition-colors inline-block"
            >
              Contact Us
            </li><br/>
            <li
              onClick={() => navigate("/privacy")}
              className="cursor-pointer hover:text-white transition-colors inline-block"
            >
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* RIGHT – GET IN TOUCH */}
        <div className="space-y-5">
          <h3 className="uppercase tracking-widest text-[10px] text-white/50 font-bold">
            Get in Touch
          </h3>

          <div className="space-y-2 text-white/55 font-light">
            <p className="hover:text-white cursor-pointer transition-colors">📞 +91-9306532302</p>
            <p className="hover:text-white cursor-pointer transition-colors">✉️ contact@onecart.com</p>
            <p className="hover:text-white cursor-pointer transition-colors">✉️ support@onecart.com</p>
          </div>

          <div className="text-white/55 leading-relaxed pt-4 font-light">
            <p className="font-medium text-white mb-1">
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
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest font-bold text-white/40 gap-4">
          <p>© {new Date().getFullYear()} OneCart. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">India</span>
            <span className="hover:text-white cursor-pointer transition-colors">English</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default OurPolicy;
