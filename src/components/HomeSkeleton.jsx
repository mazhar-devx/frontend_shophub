import React from 'react';

const HomeSkeleton = () => {
  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen bg-black overflow-hidden">
      {/* Hero Skeleton */}
      <div className="relative mb-20 md:mb-32 flex flex-col items-center">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0 md:pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
            {/* Left Content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left z-10">
              <div className="w-32 h-6 bg-white/5 rounded-full mb-6 animate-pulse"></div>
              <div className="w-full max-w-md h-16 md:h-24 bg-white/5 rounded-2xl mb-6 animate-pulse"></div>
              <div className="w-3/4 max-w-sm h-6 bg-white/5 rounded-lg mb-10 animate-pulse"></div>
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="w-40 h-14 bg-white/10 rounded-full animate-pulse"></div>
                <div className="w-40 h-14 bg-white/5 rounded-full animate-pulse border border-white/10"></div>
              </div>
            </div>
            {/* Right Content */}
            <div className="relative w-full aspect-square md:h-[600px] flex items-center justify-center">
              <div className="w-full h-[400px] md:h-full bg-white/5 rounded-[3rem] animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Skeleton */}
      <section className="mb-24 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 h-48 animate-pulse"></div>
          ))}
        </div>
      </section>

      {/* Product Section Skeleton */}
      <section className="mb-24 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-4">
          <div className="w-48 h-10 bg-white/5 rounded-lg animate-pulse"></div>
          <div className="w-32 h-6 bg-white/5 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] h-80 animate-pulse relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            </div>
          ))}
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}} />
    </div>
  );
};

export default HomeSkeleton;
