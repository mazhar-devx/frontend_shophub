import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FileText, Download, Calendar } from "lucide-react";
import { skillsDb } from "../../utils/skillsDb";

export default function Academic() {
  const { user } = useSelector((state) => state.auth);
  const username = user?.name || "Ali Khan";

  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const data = skillsDb.getStudentData(username);
    if (data && data.academic) {
      setResources(data.academic);
    }
    setLoading(false);
  }, [username]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-400" />
          Academic Resources
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          Access your syllabus, study material, and guides shared directly by the administration.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
        <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Shared Syllabus & Guides</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
             <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
             <p className="font-bold">No academic materials shared yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res) => (
              <div key={res.id} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-2xl flex items-center justify-between hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary dark:text-white">{res.title}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5" /> Shared on {res.date} | {res.type}
                    </p>
                  </div>
                </div>
                <a href={res.url} className="p-3 bg-white dark:bg-white/5 hover:bg-blue-500 hover:text-white border border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-300 rounded-xl transition-all shadow-sm">
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
