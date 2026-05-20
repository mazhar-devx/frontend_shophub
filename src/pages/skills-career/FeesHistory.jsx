import { useState, useEffect } from "react";
import { DollarSign, Download, Calendar, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from "../../services/api";

export default function FeesHistory() {
  const [loading, setLoading] = useState(true);
  const [feesData, setFeesData] = useState([]);
  const [pendingDues, setPendingDues] = useState(0.0);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const res = await api.get("/skills-career/fees");
        if (res.data?.status === 'success') {
          setFeesData(res.data.data.feesHistory);
          setPendingDues(res.data.data.pendingDues);
        }
      } catch (error) {
        // Fallback to empty state gracefully if endpoint doesn't exist
        setFeesData([]);
        setPendingDues(0.0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFees();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-emerald-400" />
          Fees & Transactions
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          Track your financial history, download invoices, and view custom fee allocations added by the administration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl min-h-[350px] flex flex-col">
           <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Fee Analytics</h2>
           <div className="flex-1 w-full relative">
             {loading ? (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
             ) : feesData.length === 0 ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <DollarSign className="w-12 h-12 mb-4 opacity-50" />
                  <p className="font-bold">No fee history found.</p>
               </div>
             ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={feesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                   <Tooltip 
                     cursor={{fill: 'rgba(255,255,255,0.05)'}}
                     contentStyle={{ backgroundColor: '#111', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                   />
                   <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             )}
           </div>
        </div>

        {/* Right Column: Summary */}
        <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col justify-center">
           <div className="text-center">
             <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 text-emerald-500">
               <DollarSign className="w-8 h-8" />
             </div>
             <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">Pending Dues</p>
             
             {loading ? (
               <div className="h-12 w-32 bg-gray-200 dark:bg-white/10 rounded-lg mx-auto mb-6 animate-pulse"></div>
             ) : (
               <p className="text-5xl font-black text-primary dark:text-white mb-6">${pendingDues.toFixed(2)}</p>
             )}

             <button 
               className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
               disabled={loading || pendingDues === 0}
             >
               Pay Now Securely
             </button>
           </div>
        </div>

      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary dark:text-white">Recent Transactions</h2>
          <button className="text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-1" disabled={loading || feesData.length === 0}>
            <Download className="w-4 h-4" /> Download Statement
          </button>
        </div>
        
        <div className="overflow-x-auto min-h-[200px] relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse w-full"></div>
              ))}
            </div>
          ) : feesData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
              <p>No transactions yet.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm">
                  <th className="pb-3 px-4 font-medium">Month</th>
                  <th className="pb-3 px-4 font-medium">Date Paid</th>
                  <th className="pb-3 px-4 font-medium">Amount</th>
                  <th className="pb-3 px-4 font-medium">Status</th>
                  <th className="pb-3 px-4 font-medium text-right">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {feesData.map((fee, idx) => (
                  <tr key={idx} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-bold text-primary dark:text-white flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" /> {fee.month}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {fee.status === 'Paid' ? fee.datePaid || '-' : '-'}
                    </td>
                    <td className="py-4 px-4 font-bold text-primary dark:text-white">${fee.amount.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1 ${
                        fee.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {fee.status === 'Paid' && <CheckCircle className="w-3 h-3" />} {fee.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-emerald-500 transition-colors" disabled={fee.status !== 'Paid'}>
                        <Download className={`w-4 h-4 ${fee.status !== 'Paid' ? 'opacity-30' : ''}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
    </div>
  );
}
