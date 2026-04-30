import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import { FiArrowRight, FiTag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PromoSection = () => {
  const [banner, setBanner] = useState({ text: "", active: false });
  const [coupon, setCoupon] = useState(null);
  const { serverUrl } = useContext(authDataContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Banner
        const bannerRes = await axios.get(`${serverUrl}/api/admin/settings/public`);
        if (bannerRes.data.success) {
          const b = bannerRes.data.settings.find(s => s.key === "offer_banner");
          if (b) setBanner(b.value);
        }

        // Fetch Top Coupon
        const couponRes = await axios.get(`${serverUrl}/api/coupon/public-list`);
        if (couponRes.data.success && couponRes.data.coupons.length > 0) {
          setCoupon(couponRes.data.coupons[0]); // Take the latest/first coupon
        }
      } catch (e) { /* ignore */ }
    };
    fetchData();
  }, [serverUrl]);

  if (!banner.active || !banner.text) return null;

  return (
    <div className="my-20">
      <div className="relative overflow-hidden rounded-[40px] bg-[#05060a] text-white p-12 md:p-20 shadow-[0_40px_120px_rgba(0,0,0,0.45)] group border border-white/10">
        {/* DECORATIVE ELEMENTS */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-white/8 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-yellow-300/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="h-px w-8 bg-white/30" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 flex items-center gap-2">
                <FiTag className="text-white" /> Limited Time Event
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6 leading-[1.1]">
              {banner.text}
            </h2>

            {coupon && (
              <div className="flex flex-wrap gap-6 mb-10">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Use Code</p>
                  <p className="text-xl font-bold tracking-widest text-white">{coupon.code}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-semibold text-white/80">Save ₹{coupon.discountValue}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">On orders above ₹{coupon.minOrderAmount}</p>
                </div>
              </div>
            )}
            
            <p className="text-white/45 text-sm md:text-base max-w-lg mb-10 font-light leading-relaxed">
              Experience the pinnacle of premium fashion with our exclusive seasonal offers. Carefully curated for those who seek nothing but the extraordinary.
            </p>

            <Link 
              to="/collection"
              className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-all hover:gap-6 shadow-xl"
            >
              Explore Collection <FiArrowRight size={18} />
            </Link>
          </div>

           <div className="hidden lg:block w-1/3">
             <div className="aspect-4/5 rounded-4xl border border-white/10 overflow-hidden relative rotate-3 group-hover:rotate-0 transition-transform duration-700 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
               <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
                alt="Fashion" 
                loading="lazy"
                className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PromoSection;
