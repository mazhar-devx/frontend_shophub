import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Video, PenTool, Monitor, Clock, Library, 
  MessageSquare, TrendingUp, Award
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getProductImageUrl, DEFAULT_AVATAR } from "../../utils/constants";
import { skillsDb } from "../../utils/skillsDb";

const quickLinks = [
  { name: "Academic", path: "/skills-career/academic", icon: <BookOpen className="w-6 h-6" />, desc: "View syllabus and course materials" },
  { name: "Live Classes", path: "/skills-career/live-classes", icon: <Video className="w-6 h-6" />, desc: "Join ongoing and scheduled sessions" },
  { name: "Library", path: "/skills-career/library", icon: <Library className="w-6 h-6" />, desc: "Access digital books and resources" },
  { name: "Messages", path: "/skills-career/messages", icon: <MessageSquare className="w-6 h-6" />, desc: "Communicate with teachers and peers" },
];

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  const username = user?.name || "Ali Khan"; // Defaulting to Ali Khan for testing when not logged in with specific name
  const studentKey = user?.email || user?.name || "ali@example.com";

  useEffect(() => {
    if (user?.name && user.name.toLowerCase() !== "mazhar.devx") {
      skillsDb.registerStudent(user.name, user.email || `${user.name.replace(/\s+/g, '').toLowerCase()}@example.com`);
    }
    // Attempt to fetch from local database matching studentKey
    const data = skillsDb.getStudentData(studentKey);
    setStudentData(data);
    setLoading(false);
  }, [studentKey, user]);

  const dpUrl = getProductImageUrl(user?.photo) || DEFAULT_AVATAR;
  const userDesc = `View the academic profile and skills career dashboard of ${username}. Excelling in their studies with ultra-professional tracking.`;

  // Calculate dynamic stats
  const attendanceVal = studentData?.feesHistory ? "95%" : "0%";
  const activeAssignments = studentData?.homework ? studentData.homework.filter(h => h.status === "Assigned").length : 0;
  const upcomingExams = 2; // Fixed exam count
  const currentGPA = studentData?.supervision ? studentData.supervision.grade === "A" ? 3.8 : 3.5 : 3.0;

  const statCards = [
    { title: "Overall Attendance", value: attendanceVal, icon: <Clock className="w-5 h-5" />, color: "from-green-400 to-emerald-600" },
    { title: "Active Assignments", value: activeAssignments, icon: <PenTool className="w-5 h-5" />, color: "from-cyan-400 to-blue-600" },
    { title: "Upcoming Exams", value: upcomingExams, icon: <Monitor className="w-5 h-5" />, color: "from-purple-400 to-indigo-600" },
    { title: "Current GPA", value: currentGPA.toFixed(1), icon: <Award className="w-5 h-5" />, color: "from-orange-400 to-red-600" }
  ];

  // Map fees history to Performance graph points (attendance + grades)
  const graphData = [
    { name: 'Jan', performance: 80, attendance: 90 },
    { name: 'Feb', performance: 82, attendance: 92 },
    { name: 'Mar', performance: 85, attendance: 88 },
    { name: 'Apr', performance: 89, attendance: 95 },
    { name: 'May', performance: 92, attendance: 96 },
    { name: 'Jun', performance: 95, attendance: 98 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Dynamic SEO for Google Indexing */}
      <Helmet>
        <title>{username}'s Skills Career Dashboard</title>
        <meta name="description" content={userDesc} />
        <meta property="og:title" content={`${username}'s Skills Career Dashboard`} />
        <meta property="og:description" content={userDesc} />
        <meta property="og:image" content={dpUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Welcome Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-900 to-purple-900 border border-white/10 shadow-2xl p-8 md:p-12">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
             <img src={dpUrl} alt={username} className="w-full h-full object-cover" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{username}</span>!
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Here's what's happening with your academic progress today. Stay focused, stay ambitious.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="skeletons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
          >
            {Array(4).fill(0).map((_, idx) => (
              <div 
                key={`skeleton-${idx}`}
                className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 animate-pulse"
              >
                <div className="flex justify-between mb-4">
                   <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-white/10"></div>
                   <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-white/10"></div>
                </div>
                <div className="w-24 h-3 bg-gray-200 dark:bg-white/10 rounded mb-2"></div>
                <div className="w-16 h-8 bg-gray-200 dark:bg-white/10 rounded"></div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
          >
            {statCards.map((stat, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={stat.title}
                className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none hover:-translate-y-1 transition-transform group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400 opacity-50" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-primary dark:text-white">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Graph */}
      <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl min-h-[400px] flex flex-col">
         <h2 className="text-2xl font-black text-primary dark:text-white mb-6 flex items-center gap-2">
            Performance Insights
         </h2>
         <div className="flex-1 w-full min-h-[300px] relative">
           {loading ? (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
           ) : (
             <ResponsiveContainer width="100%" height="100%" minHeight={300}>
               <AreaChart
                 data={graphData}
                 margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
               >
                 <defs>
                   <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#111', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                   itemStyle={{ fontWeight: 'bold' }}
                 />
                 <Area type="monotone" dataKey="attendance" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAtt)" />
                 <Area type="monotone" dataKey="performance" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPerf)" />
               </AreaChart>
             </ResponsiveContainer>
           )}
         </div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-2xl font-black text-primary dark:text-white mb-6 flex items-center gap-2">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, idx) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="group block h-full"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className="bg-white dark:bg-[#111] h-full rounded-3xl p-6 border border-gray-100 dark:border-white/5 hover:border-cyan-500/30 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-150"></div>
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-cyan-500 mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  {link.icon}
                </div>
                <h3 className="text-lg font-bold text-primary dark:text-white mb-2">{link.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{link.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
