import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AlertCircle, FileText, CheckCircle } from "lucide-react";
import { skillsDb } from "../../utils/skillsDb";

export default function Supervision() {
  const { user } = useSelector((state) => state.auth);
  const username = user?.name || "Ali Khan";

  const [loading, setLoading] = useState(true);
  const [supervision, setSupervision] = useState(null);

  useEffect(() => {
    const data = skillsDb.getStudentData(username);
    if (data && data.supervision) {
      setSupervision(data.supervision);
    }
    setLoading(false);
  }, [username]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-blue-400" />
          Academic Supervision
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          View custom notes, academic performance advice, and curriculum reviews allocated by your supervisor.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
        <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Supervisor Assessment</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !supervision ? (
          <div className="text-center py-12 text-gray-400">
             <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
             <p className="font-bold">No supervision records allocated yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 font-bold text-lg">
                {supervision.grade}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Assigned Grade</p>
                <p className="text-lg font-black text-primary dark:text-white">Curriculum Score: {supervision.grade}</p>
              </div>
            </div>

            <div className="border border-gray-100 dark:border-white/10 p-6 rounded-2xl bg-gray-50/50 dark:bg-black/10">
              <h3 className="font-bold text-primary dark:text-white mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-500" /> Remarks & Feedback
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "{supervision.remarks}"
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-cyan-500">
              <CheckCircle className="w-4 h-4" /> Review Updated by Admin
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
