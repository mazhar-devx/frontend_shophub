import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Calendar, AlertCircle, PlusCircle, CheckCircle } from "lucide-react";
import { skillsDb } from "../../utils/skillsDb";

export default function Leave() {
  const { user } = useSelector((state) => state.auth);
  const username = user?.name || "Ali Khan";

  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);

  // Form states
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const loadLeaves = () => {
    const data = skillsDb.getStudentData(username);
    if (data && data.leaveRequests) {
      setLeaves(data.leaveRequests);
    }
  };

  useEffect(() => {
    loadLeaves();
    setLoading(false);
  }, [username]);

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    if (!date || !reason) return;
    skillsDb.addLeaveRequest(username, date, reason);
    setDate("");
    setReason("");
    loadLeaves();
    alert("Leave application sent to admin!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      
      {/* Leave Application Form */}
      <div className="lg:col-span-1 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-3xl p-6 h-fit shadow-xl">
         <h2 className="text-xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-purple-500" /> Apply for Leave
         </h2>
         <form onSubmit={handleSubmitLeave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Select Date</label>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-primary dark:text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Reason Description</label>
              <textarea 
                placeholder="Explain the reason for your absence..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-primary dark:text-white h-24 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <button type="submit" className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20">
              Submit Request
            </button>
         </form>
      </div>

      {/* Leave Logs */}
      <div className="lg:col-span-2 space-y-6">
         <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
           <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
             <Calendar className="w-8 h-8 text-purple-400" /> Leave Applications
           </h1>
           <p className="text-white/70 relative z-10">Track the status of your sent leave approvals.</p>
         </div>

         <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
           <h3 className="font-bold text-primary dark:text-white mb-6">Leave Requests Queue</h3>
           
           {loading ? (
             <div className="flex justify-center items-center py-12">
               <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
           ) : leaves.length === 0 ? (
             <p className="text-sm text-gray-500 py-6 text-center">You haven't requested any leaves yet.</p>
           ) : (
             <div className="space-y-4">
               {leaves.map(req => (
                 <div key={req.id} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-2xl flex justify-between items-center hover:border-purple-500/30 transition-all">
                    <div>
                      <p className="font-bold text-primary dark:text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" /> {req.date}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{req.reason}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      req.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {req.status}
                    </span>
                 </div>
               ))}
             </div>
           )}
         </div>
      </div>

    </div>
  );
}
