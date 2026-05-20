import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MessageSquare, Send, Paperclip, XCircle, Image, Video } from "lucide-react";
import { skillsDb } from "../../utils/skillsDb";

export default function Messages() {
  const { user } = useSelector((state) => state.auth);
  const studentKey = user?.email || user?.name || "ali@example.com";

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  
  // Send state
  const [text, setText] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("Image");

  const loadMessages = () => {
    const data = skillsDb.getStudentData(studentKey);
    if (data && data.messages) {
      setMessages(data.messages);
    }
  };

  useEffect(() => {
    loadMessages();
    setLoading(false);
  }, [studentKey]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("File is too large. Please select an image or video under 4MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result);
      if (file.type.startsWith("video/")) {
        setFileType("Video");
      } else {
        setFileType("Image");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = () => {
    setFileUrl("");
    setFileType("Image");
    const fileInput = document.getElementById("student-file-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() && !fileUrl.trim()) return;
    
    skillsDb.addMessage(studentKey, "student", text, fileUrl ? fileType : null, fileUrl || null);
    setText("");
    handleClearFile();
    loadMessages();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-cyan-400" />
          Supervisor Inbox
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          Directly message your Skills & Career admin (mazhar.devx) and exchange document logs.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto flex flex-col h-[550px]">
        {/* Chats queue */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 border border-gray-50 dark:border-white/5 bg-gray-50 dark:bg-black/10 rounded-2xl mb-4 custom-scrollbar">
           {loading ? (
             <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
           ) : messages.length === 0 ? (
             <p className="text-gray-400 text-center py-12">No messages. Type below to start chat with Admin.</p>
           ) : (
             messages.map((m, idx) => {
               const isMe = m.sender === "student";
               return (
                 <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                   <div className={`max-w-[70%] p-3.5 rounded-2xl text-sm ${
                     isMe ? 'bg-cyan-500 text-white rounded-tr-none' : 'bg-white/10 dark:bg-white/5 text-primary dark:text-white border border-gray-100 dark:border-white/10 rounded-tl-none'
                   }`}>
                      {m.text && <p className="mb-2 font-medium">{m.text}</p>}
                      {m.fileUrl && (
                        <div className="border border-white/15 rounded-lg overflow-hidden bg-black/40 p-2">
                           <p className="text-[10px] text-gray-300 font-bold mb-1">{m.fileType}</p>
                           {m.fileType === "Image" ? (
                             <img src={m.fileUrl} alt="Document" className="max-h-32 rounded object-cover" />
                           ) : (
                             <video src={m.fileUrl} controls className="max-h-32 rounded" />
                           )}
                        </div>
                      )}
                   </div>
                   <span className="text-[10px] text-gray-400 mt-1">{m.time}</span>
                 </div>
               );
             })
           )}
        </div>

        {/* Sender Controls */}
        <form onSubmit={handleSend} className="space-y-4 border-t border-gray-100 dark:border-white/10 pt-4">
           {/* File preview if exists */}
           {fileUrl && (
             <div className="relative inline-block border border-white/15 rounded-xl overflow-hidden bg-black/40 p-2 max-w-xs animate-in fade-in zoom-in-95 duration-200">
               {fileType === "Image" ? (
                 <img src={fileUrl} alt="Preview" className="max-h-24 rounded-lg object-cover" />
               ) : (
                 <video src={fileUrl} className="max-h-24 rounded-lg" controls />
               )}
               <button
                 type="button"
                 onClick={handleClearFile}
                 className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-red-500/80 rounded-full text-white transition-all cursor-pointer"
                 title="Remove file"
               >
                 <XCircle className="w-4 h-4" />
               </button>
               <div className="mt-1 text-[10px] text-gray-400 font-bold px-1 flex items-center gap-1">
                 {fileType === "Image" ? <Image className="w-3 h-3 text-cyan-400" /> : <Video className="w-3 h-3 text-purple-400" />}
                 Selected {fileType}
               </div>
             </div>
           )}

           <div className="flex gap-2 items-center">
              <label className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 dark:text-gray-300 hover:text-primary dark:hover:text-white rounded-xl font-bold cursor-pointer transition-all border border-gray-200 dark:border-white/10 flex items-center justify-center">
                 <Paperclip className="w-5 h-5" />
                 <input
                   type="file"
                   id="student-file-upload"
                   accept="image/*,video/*"
                   onChange={handleFileChange}
                   className="hidden"
                 />
              </label>

              <input 
                type="text" 
                placeholder="Type a message to your supervisor (mazhar.devx)..." 
                value={text}
                onChange={e => setText(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-primary dark:text-white text-sm focus:outline-none focus:border-cyan-500"
              />

              <button type="submit" className="p-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-colors cursor-pointer flex items-center justify-center">
                <Send className="w-5 h-5" />
              </button>
           </div>
        </form>
      </div>

    </div>
  );
}
