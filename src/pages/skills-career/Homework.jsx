import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BookOpen, Calendar, CheckCircle } from "lucide-react";
import { skillsDb } from "../../utils/skillsDb";

export default function Homework() {
  const { user } = useSelector((state) => state.auth);
  const studentKey = user?.email || user?.name || "ali@example.com";

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const data = skillsDb.getStudentData(studentKey);
    if (data && data.homework) {
      setTasks(data.homework);
    }
    setLoading(false);
  }, [studentKey]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-400" />
          Homework Tasks
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          Complete and submit assignments uploaded by your supervisor.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
        <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Your Assignments</h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
             <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
             <p className="font-bold">No assignments assigned yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-indigo-500/30 transition-all">
                <div>
                  <h3 className="text-lg font-bold text-primary dark:text-white mb-1">{task.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{task.desc}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Assigned: {task.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-bold">
                    {task.status}
                  </span>
                  <button className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all">
                    Submit Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
