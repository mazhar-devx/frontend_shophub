import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Calendar, FileText, DollarSign, Mail, 
  CheckCircle, XCircle, BookOpen
} from "lucide-react";
import api from "../../services/api";

export default function SkillsManagement() {
  const [activeTab, setActiveTab] = useState("liveClasses");
  const [loading, setLoading] = useState(true);
  
  const [data, setData] = useState({
    liveClasses: [],
    leaveRequests: [],
    attachments: [],
    fees: []
  });

  const tabs = [
    { id: "liveClasses", label: "Live Classes", icon: <Video className="w-4 h-4" /> },
    { id: "leave", label: "Leave Requests", icon: <Calendar className="w-4 h-4" /> },
    { id: "academic", label: "Academic & Attachments", icon: <FileText className="w-4 h-4" /> },
    { id: "fees", label: "Fees History", icon: <DollarSign className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/skills-career/admin/${activeTab}`);
        if (res.data?.status === 'success') {
          setData(prev => ({ ...prev, [activeTab]: res.data.data }));
        }
      } catch (error) {
        // Graceful fallback if backend endpoints don't exist yet
        setData(prev => ({ ...prev, [activeTab]: [] }));
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, [activeTab]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-cyan-400" />
          Skills & Career Master Panel
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          Top Admin access granted. Manage student interactions, live classes, leave requests, attachments, and fees specifically for each user.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/30" 
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[500px] relative">
        {loading && (
           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* Live Classes Tab */}
          {activeTab === "liveClasses" && (
            <motion.div
              key="liveClasses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Active Live Sessions</h2>
                <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                  <Video className="w-4 h-4" /> Start New Class
                </button>
              </div>
              
              {data.liveClasses.length === 0 && !loading ? (
                 <div className="text-center py-12 text-gray-400 bg-black/20 rounded-2xl border border-white/5">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-bold">No students currently available for live classes.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.liveClasses.map(student => (
                    <div key={student.id} className="bg-black/20 p-4 rounded-2xl flex justify-between items-center border border-white/5 hover:border-cyan-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{student.name}</p>
                          <p className="text-xs text-gray-400">{student.email}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors">
                        Invite to Call
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Leave Requests Tab */}
          {activeTab === "leave" && (
            <motion.div
              key="leave"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Leave Applications</h2>
              
              {data.leaveRequests.length === 0 && !loading ? (
                 <div className="text-center py-12 text-gray-400 bg-black/20 rounded-2xl border border-white/5">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-bold">No pending leave requests.</p>
                 </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 text-sm">
                        <th className="pb-3 px-4">Student</th>
                        <th className="pb-3 px-4">Date</th>
                        <th className="pb-3 px-4">Reason</th>
                        <th className="pb-3 px-4">Status</th>
                        <th className="pb-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.leaveRequests.map(req => (
                        <tr key={req.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-4 px-4 font-bold text-white">{req.student}</td>
                          <td className="py-4 px-4 text-gray-300">{req.date}</td>
                          <td className="py-4 px-4 text-gray-300">{req.reason}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 flex justify-end gap-2">
                            {req.status === 'Pending' && (
                              <>
                                <button className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"><CheckCircle className="w-4 h-4" /></button>
                                <button className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"><XCircle className="w-4 h-4" /></button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Academic & Attachments Tab */}
          {activeTab === "academic" && (
            <motion.div
              key="academic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Student Submissions</h2>
                <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Send Specific Attachment
                </button>
              </div>

              {data.attachments.length === 0 && !loading ? (
                 <div className="text-center py-12 text-gray-400 bg-black/20 rounded-2xl border border-white/5">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-bold">No recent submissions or attachments.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.attachments.map(att => (
                    <div key={att.id} className="bg-black/30 rounded-2xl overflow-hidden border border-white/5 group hover:border-purple-500/30 transition-all">
                      <div className="h-32 bg-gray-800 flex items-center justify-center relative">
                        <img src={att.url} alt="Attachment" className="w-full h-full object-cover opacity-50" />
                        <span className="absolute px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white font-bold">{att.type}</span>
                      </div>
                      <div className="p-4">
                        <p className="font-bold text-white mb-1">{att.student}</p>
                        <p className="text-sm text-gray-400 mb-3">{att.desc}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{att.time}</span>
                          <button className="text-cyan-400 hover:text-cyan-300 font-bold">Review</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Fees History Tab */}
          {activeTab === "fees" && (
            <motion.div
              key="fees"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Fees Management</h2>
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Add Fee Record
                </button>
              </div>
              <p className="text-gray-400 mb-6">Add specific fees for individual students. These will be reflected instantly on their personal Dashboards via the advanced graph system.</p>
              
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-center py-12">
                <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-300">No recent transactions</h3>
                <p className="text-sm text-gray-500">Select a student to view or add fee records.</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
