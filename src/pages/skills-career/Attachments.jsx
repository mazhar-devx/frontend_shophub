import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { File, Image, Video, Download } from "lucide-react";
import { skillsDb } from "../../utils/skillsDb";

export default function Attachments() {
  const { user } = useSelector((state) => state.auth);
  const username = user?.name || "Ali Khan";

  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const data = skillsDb.getStudentData(username);
    const media = [];
    
    // Gather files from academic
    if (data?.academic) {
      data.academic.forEach(a => {
        media.push({ title: a.title, type: a.type, url: a.url, date: a.date });
      });
    }

    // Gather files from messages
    if (data?.messages) {
      data.messages.forEach(m => {
        if (m.fileUrl) {
          media.push({ title: m.text || "Shared Media", type: m.fileType, url: m.fileUrl, date: "Recent" });
        }
      });
    }

    setAttachments(media);
  }, [username]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-teal-900 to-cyan-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <File className="w-8 h-8 text-teal-400" />
          Attachments & Media Vault
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          All images, videos, and doc uploads shared between you and administration.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
        <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Shared Documents & Media</h2>

        {attachments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
             <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
             <p className="font-bold">No attachments shared yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attachments.map((item, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden hover:border-teal-500/30 transition-all flex flex-col justify-between">
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                      {item.type === "Image" ? <Image className="w-5 h-5" /> : 
                       item.type === "Video" ? <Video className="w-5 h-5" /> : <File className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-primary dark:text-white text-sm line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-gray-400">{item.date} | {item.type}</p>
                    </div>
                  </div>
                  
                  {item.url && item.url !== "#" && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-white/5 bg-black/40">
                      {item.type === "Image" ? (
                        <img src={item.url} alt={item.title} className="w-full h-32 object-cover" />
                      ) : item.type === "Video" ? (
                        <video src={item.url} controls className="w-full h-32 object-cover" />
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="px-5 py-4 bg-gray-100/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
                  <span className="text-xs font-bold text-teal-500">{item.type}</span>
                  <a href={item.url} download className="text-gray-400 hover:text-teal-500 transition-colors flex items-center gap-1 text-xs font-bold">
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
