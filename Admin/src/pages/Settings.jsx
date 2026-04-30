import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSave, FiAlertCircle, FiLayout, FiBell } from 'react-icons/fi';

const Settings = ({ url }) => {
  const [bannerText, setBannerText] = useState("");
  const [isBannerActive, setIsBannerActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/settings`, { withCredentials: true });
      if (response.data.success) {
        const banner = response.data.settings.find(s => s.key === "offer_banner");
        if (banner) {
          setBannerText(banner.value.text);
          setIsBannerActive(banner.value.active);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdateBanner = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/admin/settings/update`, {
        key: "offer_banner",
        value: { text: bannerText, active: isBannerActive }
      }, { withCredentials: true });
      
      if (response.data.success) {
        toast.success("Site settings updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-4xl">
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800">Site Configuration</h2>
        <p className="text-gray-500 mt-2">Manage global elements like promotional banners and system alerts.</p>
      </div>

      <div className="space-y-8">
        {/* PROMOTIONAL BANNER SECTION */}
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
             <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <FiLayout size={24} />
             </div>
             <div>
                <h3 className="text-lg font-semibold text-gray-900">Offer Banner</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Homepage Advertisement</p>
             </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Banner Message</p>
              <input 
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black/5 text-sm" 
                placeholder="E.g. Free shipping on all orders above ₹999!" 
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${isBannerActive ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                <span className="text-sm font-medium text-gray-700">Banner Visibility</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isBannerActive}
                  onChange={(e) => setIsBannerActive(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <button 
              onClick={handleUpdateBanner}
              disabled={loading}
              className="flex items-center gap-3 bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
            >
              <FiSave /> {loading ? "Updating..." : "Save Settings"}
            </button>
          </div>
        </div>

        {/* SYSTEM NOTIFICATIONS INFO */}
        <div className="bg-blue-50 p-8 rounded-[40px] border border-blue-100 flex gap-6">
          <div className="shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <FiBell size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-2">Automated Inventory Alerts</h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              When a product is restocked, the system automatically marks "Back in Stock" requests for follow-up. 
              Email integration is currently set to log notifications in the database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
