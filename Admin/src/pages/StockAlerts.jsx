import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiBell, FiUser, FiPackage, FiCalendar, FiCheckCircle } from "react-icons/fi";

const StockAlerts = ({ url }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/stock-alerts`, { withCredentials: true });
      if (response.data.success) {
        setAlerts(response.data.alerts);
      }
    } catch (error) {
      toast.error("Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [url]);

  return (
    <div className="p-8 bg-[#f7f7f3] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight mb-2 uppercase">Stock Notifications</h1>
          <p className="text-gray-500 text-sm">Monitor customers waiting for restocked products.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert._id} className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm hover:shadow-xl transition-all group">
                   <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                         <FiBell size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                         {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                   </div>

                   <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                         <FiUser className="text-gray-400" />
                         <p className="text-sm font-medium text-gray-900">{alert.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <FiPackage className="text-gray-400" />
                         <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Product ID</p>
                            <p className="text-sm font-bold text-black">{alert.productId}</p>
                         </div>
                      </div>
                   </div>

                   <button className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-all flex items-center justify-center gap-2">
                      <FiCheckCircle /> Mark as Notified
                   </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiBell className="text-gray-300" size={30} />
                 </div>
                 <p className="text-gray-400 text-sm uppercase tracking-[0.2em]">No pending stock alerts</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAlerts;
