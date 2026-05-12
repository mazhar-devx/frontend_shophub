import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function InfoLayout({ title, subtitle, children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 animate-fade-in">
            HA Store Official
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-primary dark:text-white mb-6 tracking-tight animate-fade-in-up">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-secondary dark:text-gray-400 leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-100">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl relative overflow-hidden">
           <div className="prose prose-slate dark:prose-invert max-w-none">
              {children}
           </div>
        </div>
      </section>
    </div>
  );
}
