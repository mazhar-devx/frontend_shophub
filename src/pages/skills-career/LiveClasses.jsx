import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Video, ExternalLink, Calendar } from "lucide-react";
import { skillsDb } from "../../utils/skillsDb";

export default function LiveClasses() {
  const { user } = useSelector((state) => state.auth);
  const username = user?.name || "Ali Khan";

  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const data = skillsDb.getStudentData(username);
    if (data && data.liveClasses) {
      setClasses(data.liveClasses);
    }
    setLoading(false);
  }, [username]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-red-900 to-rose-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <Video className="w-8 h-8 text-rose-400" />
          Live Interactive Classes
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          Join scheduled interactive lectures and Q&A sessions with career supervisors.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
        <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Upcoming Class Links</h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
             <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
             <p className="font-bold">No active live classes scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map((c) => (
              <div key={c.id} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-rose-500/30 transition-all">
                <div>
                  <h3 className="text-lg font-bold text-primary dark:text-white mb-2">{c.topic}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {c.time}
                  </p>
                </div>
                <a 
                  href={c.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full sm:w-auto px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2"
                >
                  Join Call <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
