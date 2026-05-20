import { useState } from "react";
import { Calendar as CalendarIcon, Check, X, Clock } from "lucide-react";

export default function Attendance() {
  const daysInMonth = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    status: i === 12 ? "leave" : i === 18 ? "absent" : "present"
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-green-400" />
          Attendance Tracker
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          Keep tabs on your daily presence, absences, and approved leaves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar visualizer */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
           <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Current Month Log</h2>
           <div className="grid grid-cols-5 sm:grid-cols-7 gap-4">
             {daysInMonth.map((d) => (
               <div 
                 key={d.day} 
                 className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-bold text-sm relative border transition-all ${
                   d.status === "present" ? "bg-green-500/10 border-green-500/20 text-green-500" :
                   d.status === "leave" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                   "bg-red-500/10 border-red-500/20 text-red-500"
                 }`}
               >
                 <span>{d.day}</span>
                 <span className="text-[10px] uppercase font-bold mt-1 opacity-70">
                   {d.status === "present" ? "P" : d.status === "leave" ? "L" : "A"}
                 </span>
               </div>
             ))}
           </div>
        </div>

        {/* Attendance stats */}
        <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col justify-between">
           <div>
             <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Summary</h2>
             <div className="space-y-4">
               <div className="flex justify-between items-center bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                  <span className="text-sm font-bold text-green-600">Present</span>
                  <span className="font-bold text-green-600">28 Days</span>
               </div>
               <div className="flex justify-between items-center bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
                  <span className="text-sm font-bold text-yellow-600">Leave</span>
                  <span className="font-bold text-yellow-600">1 Day</span>
               </div>
               <div className="flex justify-between items-center bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                  <span className="text-sm font-bold text-red-600">Absent</span>
                  <span className="font-bold text-red-600">1 Day</span>
               </div>
             </div>
           </div>
           
           <div className="border-t border-gray-100 dark:border-white/5 pt-6 mt-6 text-center">
              <span className="text-xs font-bold text-gray-400 block mb-1">Attendance Percentage</span>
              <span className="text-4xl font-black text-primary dark:text-white">93.3%</span>
           </div>
        </div>
      </div>
    </div>
  );
}
