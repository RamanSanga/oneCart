import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiTag, FiCalendar, FiDollarSign } from 'react-icons/fi';

const Coupons = ({ url }) => {
  const [coupons, setCoupons] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    expiryDate: '',
    description: ''
  });

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${url}/api/coupon/list`, { withCredentials: true });
      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/coupon/add`, formData, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message);
        setShowAdd(false);
        setFormData({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', expiryDate: '', description: '' });
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add coupon");
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await axios.delete(`${url}/api/coupon/delete/${id}`, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCoupons();
      }
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800">Coupon Management</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow-lg"
        >
          <FiPlus /> {showAdd ? "Close Form" : "Create Coupon"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={onSubmitHandler} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl mb-12 animate-in fade-in slide-in-from-top-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Coupon Code</p>
              <input 
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                value={formData.code}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black/5" 
                placeholder="E.g. SAVE20" 
                required 
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Discount Type</p>
              <select 
                onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                value={formData.discountType}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black/5"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Discount Value</p>
              <input 
                onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                value={formData.discountValue}
                type="number" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black/5" 
                placeholder="20" 
                required 
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Min Order Amount (₹)</p>
              <input 
                onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                value={formData.minOrderAmount}
                type="number" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black/5" 
                placeholder="500" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expiry Date</p>
              <input 
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                value={formData.expiryDate}
                type="date" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black/5" 
                required 
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</p>
              <input 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                value={formData.description}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black/5" 
                placeholder="Get 20% off on all items" 
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-lg disabled:opacity-50">
            {loading ? "Creating..." : "Save Coupon"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coupons.map((item) => (
          <div key={item._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-gray-50 p-4 rounded-2xl text-gray-950">
                <FiTag size={24} />
              </div>
              <button 
                onClick={() => deleteCoupon(item._id)}
                className="text-gray-300 hover:text-red-500 transition-colors p-2"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{item.code}</h3>
            <p className="text-sm text-gray-500 mb-6">{item.description}</p>
            
            <div className="space-y-3 pt-6 border-t border-gray-50">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-gray-400">Discount</span>
                <span className="text-gray-950">{item.discountType === 'percentage' ? `${item.discountValue}%` : `₹${item.discountValue}`}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-gray-400">Min Order</span>
                <span className="text-gray-950">₹{item.minOrderAmount}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-gray-400">Expires</span>
                <span className="text-gray-950">{new Date(item.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coupons;
