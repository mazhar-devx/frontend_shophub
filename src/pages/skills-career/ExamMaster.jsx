import { Monitor, BookOpen, Clock, FileCheck } from "lucide-react";

export default function ExamMaster() {
  const materials = [
    { title: "React Core Concepts Study Guide", desc: "Covers hooks, lifecycle, Virtual DOM, and contexts.", pages: "12 Pages", type: "PDF" },
    { title: "Redux State Flow Cheat Sheet", desc: "Actions, Reducers, Middlewares, and Store structures.", pages: "2 Pages", type: "Doc" },
    { title: "Fullstack Architecture Blueprint", desc: "REST APIs, database schemas, and client-server workflows.", pages: "5 Pages", type: "PDF" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-purple-900 to-violet-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <Monitor className="w-8 h-8 text-violet-400" />
          Exam Master Vault
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          Preparation guidelines, reference docs, and revision material to master your online examinations.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
        <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Revision Guides</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((m, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-violet-500/30 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-primary dark:text-white mb-1">{m.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{m.desc}</p>
              </div>
              <div className="flex justify-between items-center text-xs font-bold border-t border-gray-100 dark:border-white/5 pt-4">
                <span className="text-violet-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {m.pages}
                </span>
                <button className="text-gray-400 hover:text-violet-500 transition-colors flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" /> Download Guide
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
