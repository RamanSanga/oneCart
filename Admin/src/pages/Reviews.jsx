import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiTrash2, FiMessageSquare, FiStar, FiUser, FiClock } from 'react-icons/fi';

const Reviews = ({ url }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/reviews`, { withCredentials: true });
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const response = await axios.delete(`${url}/api/admin/review/delete/${id}`, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchReviews();
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading reviews...</div>;

  return (
    <div className="p-8 w-full">
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800">Review Moderation</h2>
        <p className="text-gray-500 mt-2">Manage and monitor customer feedback across the store.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">User</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Rating</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Comment</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reviews.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-xs">
                      {item.userName?.charAt(0) || <FiUser />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.userName}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex text-orange-400 gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FiStar key={s} size={14} fill={s <= item.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm text-gray-600 line-clamp-2 max-w-md">{item.comment}</p>
                </td>
                <td className="px-8 py-6 text-sm text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => deleteReview(item._id)}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {reviews.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic">
            No reviews found to moderate.
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
