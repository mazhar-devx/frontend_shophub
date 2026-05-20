import { Calendar, Users, Award } from "lucide-react";

export default function Events() {
  const events = [
    { title: "Global Developer Hackathon", date: "May 25, 2026", desc: "Showcase your React & Redux prototypes globally.", icon: <Award className="w-5 h-5" /> },
    { title: "Weekly Supervision Webinar", date: "May 28, 2026", desc: "Live feedback session on React portfolio reviews.", icon: <Users className="w-5 h-5" /> },
    { title: "Career Placement Seminar", date: "June 02, 2026", desc: "Interact with corporate software recruiters.", icon: <Calendar className="w-5 h-5" /> }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-pink-900 to-rose-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-pink-400" />
          Events & Webinars
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          Participate in events, virtual workshops, hackathons, and placement drives.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
        <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Upcoming Events Timeline</h2>
        
        <div className="space-y-6">
          {events.map((e, idx) => (
            <div key={idx} className="flex gap-4 border-l-2 border-pink-500/30 pl-6 relative">
              <div className="absolute left-[-11px] top-1 w-5 h-5 rounded-full bg-pink-500 border-4 border-white dark:border-[#111] flex items-center justify-center"></div>
              <div className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-2xl hover:border-pink-500/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-pink-500">{e.icon}</div>
                  <h3 className="font-bold text-primary dark:text-white">{e.title}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{e.desc}</p>
                <span className="text-xs font-bold text-pink-500 block">{e.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
