import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Calendar, FileText, DollarSign, Mail, 
  CheckCircle, XCircle, BookOpen, Users, Send, AlertTriangle, Image, Paperclip
} from "lucide-react";
import { skillsDb } from "../../utils/skillsDb";

export default function SkillsManagement() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const isMazharDevx = user && (
    user.name?.toLowerCase().trim() === 'mazhar.devx' ||
    user.vendorName?.toLowerCase().trim() === 'mazhar.devx' ||
    user.email?.toLowerCase().trim() === 'mazhar.devx'
  );

  // Guard: Strictly allow only mazhar.devx
  useEffect(() => {
    if (user && !isMazharDevx) {
      navigate("/");
    }
  }, [user, navigate, isMazharDevx]);

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("messages");
  const [studentData, setStudentData] = useState(null);

  // Form states
  const [messageText, setMessageText] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("Image");

  const [liveTopic, setLiveTopic] = useState("");
  const [liveTime, setLiveTime] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [homeworkDesc, setHomeworkDesc] = useState("");

  const [feeMonth, setFeeMonth] = useState("Jan");
  const [feeAmount, setFeeAmount] = useState("");
  const [feeStatus, setFeeStatus] = useState("Paid");

  const [academicTitle, setAcademicTitle] = useState("");
  const [academicType, setAcademicType] = useState("PDF");
  const [academicUrl, setAcademicUrl] = useState("");

  useEffect(() => {
    const list = skillsDb.getStudents();
    setStudents(list);
    if (list.length > 0) {
      setSelectedStudent(list[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const data = skillsDb.getStudentData(selectedStudent.name);
      setStudentData(data);
    }
  }, [selectedStudent, activeTab]);

  const reloadData = () => {
    if (selectedStudent) {
      setStudentData(skillsDb.getStudentData(selectedStudent.name));
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() && !fileUrl.trim()) return;
    
    skillsDb.addMessage(selectedStudent.name, "admin", messageText, fileUrl ? fileType : null, fileUrl || null);
    setMessageText("");
    setFileUrl("");
    reloadData();
  };

  const handleCreateLiveClass = (e) => {
    e.preventDefault();
    if (!liveTopic || !liveTime) return;
    skillsDb.addLiveClass(selectedStudent.name, liveTopic, liveTime, liveUrl || "https://zoom.us");
    setLiveTopic("");
    setLiveTime("");
    setLiveUrl("");
    reloadData();
    alert("Live class assigned to student!");
  };

  const handleAssignHomework = (e) => {
    e.preventDefault();
    if (!homeworkTitle) return;
    skillsDb.addHomework(selectedStudent.name, homeworkTitle, homeworkDesc);
    setHomeworkTitle("");
    setHomeworkDesc("");
    reloadData();
    alert("Homework assigned to student!");
  };

  const handleAddFee = (e) => {
    e.preventDefault();
    if (!feeAmount) return;
    skillsDb.addFeeRecord(selectedStudent.name, feeMonth, feeAmount, feeStatus);
    setFeeAmount("");
    reloadData();
    alert("Fee record added!");
  };

  const handleAddAcademic = (e) => {
    e.preventDefault();
    if (!academicTitle) return;
    skillsDb.addAcademicAttachment(selectedStudent.name, academicTitle, academicType, academicUrl || "#");
    setAcademicTitle("");
    setAcademicUrl("");
    reloadData();
    alert("Academic document/attachment shared!");
  };

  const handleLeaveDecision = (reqId, decision) => {
    const updatedLeaves = studentData.leaveRequests.map(r => 
      r.id === reqId ? { ...r, status: decision } : r
    );
    const updated = { ...studentData, leaveRequests: updatedLeaves };
    skillsDb.saveStudentData(selectedStudent.name, updated);
    reloadData();
  };

  if (!user || !isMazharDevx) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-black/10 rounded-3xl border border-red-500/20">
         <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
         <h1 className="text-3xl font-black text-white mb-2">Access Denied</h1>
         <p className="text-gray-400 max-w-md">This master control panel is restricted strictly to the top admin Identity: <span className="text-red-400 font-bold">mazhar.devx</span>.</p>
      </div>
    );
  }

  const tabs = [
    { id: "messages", label: "Direct Inbox & Files", icon: <Mail className="w-4 h-4" /> },
    { id: "liveClasses", label: "Live Classes", icon: <Video className="w-4 h-4" /> },
    { id: "leave", label: "Leave Requests", icon: <Calendar className="w-4 h-4" /> },
    { id: "academic", label: "Academic Resources", icon: <FileText className="w-4 h-4" /> },
    { id: "homework", label: "Homework Tasks", icon: <BookOpen className="w-4 h-4" /> },
    { id: "fees", label: "Fees Invoicing", icon: <DollarSign className="w-4 h-4" /> },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
      
      {/* Sidebar: Users List */}
      <div className="xl:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col h-[750px]">
        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
          <Users className="w-5 h-5 text-cyan-400" />
          Active Students
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {students.map((student) => {
            const isSelected = selectedStudent?.name === student.name;
            return (
              <button
                key={student.name}
                onClick={() => setSelectedStudent(student)}
                className={`w-full p-4 rounded-2xl text-left transition-all border flex items-center gap-4 ${
                  isSelected 
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400 shadow-lg shadow-cyan-500/5" 
                    : "bg-white/5 border-transparent hover:bg-white/10"
                }`}
              >
                <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full object-cover border border-white/20" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{student.name}</p>
                  <p className="text-xs text-gray-400 truncate">{student.email}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Panel */}
      <div className="xl:col-span-3 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col h-[750px]">
        {selectedStudent ? (
          <>
            {/* Upper Selected Info */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedStudent.name}</h2>
                  <p className="text-sm text-gray-400">Managing career curriculum</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
                   Interactive Mode
                 </span>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 border-b border-white/10">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                    activeTab === t.id
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Dynamic tab contents */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
              <AnimatePresence mode="wait">
                
                {/* Tab: Messages / Attachment Sender */}
                {activeTab === "messages" && (
                  <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full justify-between">
                     {/* Chat logs */}
                     <div className="flex-1 overflow-y-auto space-y-4 max-h-[300px] border border-white/5 bg-black/10 rounded-2xl p-4 mb-4">
                       {studentData?.messages.length === 0 ? (
                         <p className="text-gray-500 text-center py-12">No messages exchanged yet.</p>
                       ) : (
                         studentData?.messages.map((m, idx) => {
                           const isAdmin = m.sender === "admin";
                           return (
                             <div key={idx} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[70%] p-3.5 rounded-2xl text-sm ${
                                  isAdmin ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'
                                }`}>
                                   {m.text && <p className="mb-2">{m.text}</p>}
                                   {m.fileUrl && (
                                     <div className="border border-white/15 rounded-lg overflow-hidden bg-black/40 p-2">
                                        <p className="text-[10px] text-gray-400 font-bold mb-1">{m.fileType}</p>
                                        {m.fileType === "Image" ? (
                                          <img src={m.fileUrl} alt="Sent" className="max-h-32 rounded object-cover" />
                                        ) : (
                                          <video src={m.fileUrl} controls className="max-h-32 rounded" />
                                        )}
                                     </div>
                                   )}
                                </div>
                                <span className="text-[10px] text-gray-500 mt-1">{m.time}</span>
                             </div>
                           );
                         })
                       )}
                     </div>

                     {/* Sender controls */}
                     <form onSubmit={handleSendMessage} className="space-y-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Type a direct message to this student..." 
                            value={messageText}
                            onChange={e => setMessageText(e.target.value)}
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                          <button type="submit" className="p-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-colors">
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-white/5 pt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Media Type:</span>
                            <select 
                              value={fileType} 
                              onChange={e => setFileType(e.target.value)}
                              className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white"
                            >
                              <option value="Image">📸 Image</option>
                              <option value="Video">🎥 Video</option>
                            </select>
                          </div>
                          <input 
                            type="text" 
                            placeholder="Attach media URL (optional)" 
                            value={fileUrl}
                            onChange={e => setFileUrl(e.target.value)}
                            className="col-span-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                     </form>
                  </motion.div>
                )}

                {/* Tab: Live Classes */}
                {activeTab === "liveClasses" && (
                  <motion.div key="liveClasses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <form onSubmit={handleCreateLiveClass} className="space-y-4 bg-black/20 p-6 rounded-3xl border border-white/5">
                       <h3 className="text-lg font-bold text-white flex items-center gap-2">
                         <Video className="w-5 h-5 text-cyan-400" /> Assign Live Class Link
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Class Topic" 
                            value={liveTopic}
                            onChange={e => setLiveTopic(e.target.value)}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                            required
                          />
                          <input 
                            type="text" 
                            placeholder="Time (e.g. Tomorrow at 3:00 PM)" 
                            value={liveTime}
                            onChange={e => setLiveTime(e.target.value)}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                            required
                          />
                       </div>
                       <input 
                         type="text" 
                         placeholder="Zoom / Google Meet URL" 
                         value={liveUrl}
                         onChange={e => setLiveUrl(e.target.value)}
                         className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                       />
                       <button type="submit" className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors">
                         Publish Class
                       </button>
                    </form>

                    <div className="bg-black/10 rounded-3xl p-6 border border-white/5">
                       <h4 className="font-bold text-white mb-4">Active Schedules</h4>
                       {studentData?.liveClasses.length === 0 ? (
                         <p className="text-sm text-gray-500">No classes active.</p>
                       ) : (
                         studentData?.liveClasses.map(c => (
                           <div key={c.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 mb-3">
                              <div>
                                <p className="font-bold text-white">{c.topic}</p>
                                <p className="text-xs text-gray-400">{c.time}</p>
                              </div>
                              <span className="text-xs text-cyan-400 font-bold">Active Link Assigned</span>
                           </div>
                         ))
                       )}
                    </div>
                  </motion.div>
                )}

                {/* Tab: Leave requests */}
                {activeTab === "leave" && (
                  <motion.div key="leave" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                     <h3 className="text-lg font-bold text-white mb-4">Leave Management</h3>
                     {studentData?.leaveRequests.length === 0 ? (
                       <p className="text-sm text-gray-500">No applications sent by this student.</p>
                     ) : (
                       studentData?.leaveRequests.map(r => (
                         <div key={r.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div>
                              <p className="font-bold text-white">{r.date}</p>
                              <p className="text-sm text-gray-400">{r.reason}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {r.status === "Pending" ? (
                                <>
                                  <button onClick={() => handleLeaveDecision(r.id, "Approved")} className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-xl transition-all"><CheckCircle className="w-5 h-5" /></button>
                                  <button onClick={() => handleLeaveDecision(r.id, "Rejected")} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-all"><XCircle className="w-5 h-5" /></button>
                                </>
                              ) : (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'Approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                  {r.status}
                                </span>
                              )}
                            </div>
                         </div>
                       ))
                     )}
                  </motion.div>
                )}

                {/* Tab: Academic */}
                {activeTab === "academic" && (
                  <motion.div key="academic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                     <form onSubmit={handleAddAcademic} className="space-y-4 bg-black/20 p-6 rounded-3xl border border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-400" /> Share Academic Attachment
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <input 
                             type="text" 
                             placeholder="Document Title" 
                             value={academicTitle}
                             onChange={e => setAcademicTitle(e.target.value)}
                             className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                             required
                           />
                           <select 
                             value={academicType}
                             onChange={e => setAcademicType(e.target.value)}
                             className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                           >
                             <option value="PDF">PDF</option>
                             <option value="Doc">Word Doc</option>
                             <option value="Video">Video Link</option>
                           </select>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Document Resource URL" 
                          value={academicUrl}
                          onChange={e => setAcademicUrl(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                        />
                        <button type="submit" className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors">
                          Share Attachment
                        </button>
                     </form>

                     <div className="bg-black/10 rounded-3xl p-6 border border-white/5">
                        <h4 className="font-bold text-white mb-4">Shared Resources</h4>
                        {studentData?.academic.length === 0 ? (
                          <p className="text-sm text-gray-500">No resources shared.</p>
                        ) : (
                          studentData?.academic.map(doc => (
                            <div key={doc.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 mb-3">
                               <div>
                                 <p className="font-bold text-white">{doc.title}</p>
                                 <p className="text-xs text-gray-400">{doc.date} | {doc.type}</p>
                               </div>
                               <span className="text-xs text-purple-400 font-bold">Shared</span>
                            </div>
                          ))
                        )}
                     </div>
                  </motion.div>
                )}

                {/* Tab: Homework */}
                {activeTab === "homework" && (
                  <motion.div key="homework" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                     <form onSubmit={handleAssignHomework} className="space-y-4 bg-black/20 p-6 rounded-3xl border border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-indigo-400" /> Assign Homework
                        </h3>
                        <input 
                          type="text" 
                          placeholder="Homework Title" 
                          value={homeworkTitle}
                          onChange={e => setHomeworkTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                          required
                        />
                        <textarea 
                          placeholder="Instructions & Tasks description..." 
                          value={homeworkDesc}
                          onChange={e => setHomeworkDesc(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none h-24"
                        />
                        <button type="submit" className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors">
                          Assign Homework
                        </button>
                     </form>

                     <div className="bg-black/10 rounded-3xl p-6 border border-white/5">
                        <h4 className="font-bold text-white mb-4">Assigned Homework List</h4>
                        {studentData?.homework.length === 0 ? (
                          <p className="text-sm text-gray-500">No homework tasks assigned.</p>
                        ) : (
                          studentData?.homework.map(h => (
                            <div key={h.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 mb-3">
                               <div>
                                 <p className="font-bold text-white">{h.title}</p>
                                 <p className="text-xs text-gray-400">{h.date} | {h.status}</p>
                               </div>
                               <span className="text-xs text-indigo-400 font-bold">Assigned</span>
                            </div>
                          ))
                        )}
                     </div>
                  </motion.div>
                )}

                {/* Tab: Fees */}
                {activeTab === "fees" && (
                  <motion.div key="fees" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                     <form onSubmit={handleAddFee} className="space-y-4 bg-black/20 p-6 rounded-3xl border border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-emerald-400" /> Allocate Custom Fee Invoicing
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <select 
                             value={feeMonth}
                             onChange={e => setFeeMonth(e.target.value)}
                             className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                           >
                             <option value="Jan">January</option>
                             <option value="Feb">February</option>
                             <option value="Mar">March</option>
                             <option value="Apr">April</option>
                             <option value="May">May</option>
                             <option value="Jun">June</option>
                           </select>
                           <input 
                             type="number" 
                             placeholder="Amount ($)" 
                             value={feeAmount}
                             onChange={e => setFeeAmount(e.target.value)}
                             className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                             required
                           />
                           <select 
                             value={feeStatus}
                             onChange={e => setFeeStatus(e.target.value)}
                             className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                           >
                             <option value="Paid">Paid</option>
                             <option value="Pending">Pending</option>
                           </select>
                        </div>
                        <button type="submit" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors">
                          Post Fee Record
                        </button>
                     </form>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
             <p className="text-gray-400">Select a student from the active list to manage their program.</p>
          </div>
        )}
      </div>

    </div>
  );
}
