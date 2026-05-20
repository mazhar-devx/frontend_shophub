import { Monitor, ShieldAlert, Award, Clock } from "lucide-react";

export default function OnlineExam() {
  const exams = [
    { title: "React State Management Finals", duration: "60 mins", marks: "100 Marks", status: "Open" },
    { title: "Javascript ES6 & Web Design", duration: "45 mins", marks: "50 Marks", status: "Closed" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-cyan-900 to-teal-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <Monitor className="w-8 h-8 text-cyan-400" />
          Online Exams Portal
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          Attempt examinations online under strict timer supervision. Ensure you have a stable network.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
        <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Active Exams Calendar</h2>

        <div className="space-y-4">
          {exams.map((ex, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-cyan-500/30 transition-all">
              <div>
                <h3 className="text-lg font-bold text-primary dark:text-white mb-2">{ex.title}</h3>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {ex.duration}</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {ex.marks}</span>
                </div>
              </div>
              <div>
                {ex.status === "Open" ? (
                  <button className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-all shadow-md shadow-cyan-500/10 flex items-center gap-2">
                     Start Exam <Monitor className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-gray-200 dark:bg-white/10 text-gray-400 rounded-xl text-xs font-bold flex items-center gap-1">
                     Closed <ShieldAlert className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
