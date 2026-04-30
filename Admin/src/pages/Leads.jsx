import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiMail, FiDownload, FiTrash2, FiUserCheck } from "react-icons/fi";

const Leads = ({ url }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/leads`, { withCredentials: true });
      if (response.data.success) {
        setLeads(response.data.leads);
      }
    } catch (error) {
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [url]);

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Date\n"
      + leads.map(l => `${l.email},${new Date(l.createdAt).toLocaleString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "onecart_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 bg-[#f7f7f3] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-light tracking-tight mb-2 uppercase">Newsletter Leads</h1>
            <p className="text-gray-500 text-sm">Manage your marketing audience and export subscribers.</p>
          </div>
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition shadow-xl"
          >
            <FiDownload /> Export CSV
          </button>
        </div>

        <div className="bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-sm">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50 border-b border-black/5">
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Subscriber</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Joined Date</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {loading ? (
                    <tr><td colSpan="4" className="py-20 text-center"><div className="animate-spin h-6 w-6 border-b-2 border-black mx-auto"></div></td></tr>
                 ) : leads.length > 0 ? (
                    leads.map((lead) => (
                       <tr key={lead._id} className="border-b border-black/[0.02] hover:bg-gray-50/50 transition-colors">
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                   <FiMail size={16} />
                                </div>
                                <span className="text-sm font-medium text-gray-900">{lead.email}</span>
                             </div>
                          </td>
                          <td className="px-10 py-6 text-sm text-gray-500">
                             {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-10 py-6">
                             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                                <FiUserCheck size={10} /> Active
                             </span>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                <FiTrash2 size={16} />
                             </button>
                          </td>
                       </tr>
                    ))
                 ) : (
                    <tr><td colSpan="4" className="py-20 text-center text-gray-400 text-xs uppercase tracking-widest italic">No subscribers yet</td></tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;
