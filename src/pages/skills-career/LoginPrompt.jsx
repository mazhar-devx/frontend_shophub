import { Link } from "react-router-dom";
import { BookOpen, Shield, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPrompt() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)]">
          <BookOpen className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-primary dark:text-white mb-6 tracking-tight">
          Your Future, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">Elevated.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Access your personalized academic dashboard. Track attendance, submit assignments, take online exams, and manage your career journey all in one ultra-professional space.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link 
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-primary dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2 group"
          >
            Login to Access <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t border-gray-200 dark:border-white/10 pt-16">
          {[
            { icon: <BookOpen />, title: "Comprehensive", desc: "All your academic needs in one unified platform." },
            { icon: <Shield />, title: "Secure", desc: "Enterprise-grade security for your personal data." },
            { icon: <Award />, title: "Excellence", desc: "Designed for high-achievers and visionaries." },
          ].map((feature, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              key={feature.title} 
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-primary dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
