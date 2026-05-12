import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true, // Always true
        functional: true,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Delay showing to not overwhelm the user immediately
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted = {
            essential: true,
            functional: true,
            analytics: true,
            marketing: true,
        };
        localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
        setIsVisible(false);
        window.dispatchEvent(new Event('cookie-consent-updated'));
    };

    const handleRejectAll = () => {
        const allRejected = {
            essential: true,
            functional: false,
            analytics: false,
            marketing: false,
        };
        localStorage.setItem('cookie-consent', JSON.stringify(allRejected));
        setIsVisible(false);
        window.dispatchEvent(new Event('cookie-consent-updated'));
    };

    const handleSavePreferences = () => {
        localStorage.setItem('cookie-consent', JSON.stringify(preferences));
        setIsVisible(false);
        setShowDetails(false);
        window.dispatchEvent(new Event('cookie-consent-updated'));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 pointer-events-none">
            {/* Banner */}
            <div className="max-w-4xl mx-auto glass border border-white/10 rounded-[2rem] p-6 md:p-8 pointer-events-auto animate-fade-in-up shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl -z-10 group-hover:bg-purple-600/20 transition-colors"></div>
                
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                        <span className="text-3xl animate-bounce">🍪</span>
                    </div>
                    
                    <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Cookie Settings</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                            We use cookies to improve your experience and analyze site traffic. By clicking "Accept All", you agree to our use of cookies for functional, analytical, and marketing purposes.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto">
                        <button 
                            onClick={() => setShowDetails(true)}
                            className="px-6 py-3 rounded-xl border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
                        >
                            Customize
                        </button>
                        <button 
                            onClick={handleRejectAll}
                            className="px-6 py-3 rounded-xl border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
                        >
                            Reject
                        </button>
                        <button 
                            onClick={handleAcceptAll}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Customization */}
            {showDetails && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-auto">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setShowDetails(false)}></div>
                    <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full relative z-10 animate-fade-in-up shadow-2xl overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/20 rounded-full blur-[80px] -z-10"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-600/20 rounded-full blur-[80px] -z-10"></div>

                        <h3 className="text-2xl font-black text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Cookie Preferences</h3>
                        <p className="text-gray-400 text-sm mb-8">Manage how cookies are used on this site.</p>
                        
                        <div className="space-y-4 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {/* Essential */}
                            <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                <div className="max-w-[80%]">
                                    <h4 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                                        Essential
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-400 uppercase tracking-widest">Required</span>
                                    </h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">Necessary for core features like security and authentication.</p>
                                </div>
                                <div className="w-12 h-6 bg-purple-600/30 rounded-full relative cursor-not-allowed border border-purple-500/20">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white/80 rounded-full shadow-lg"></div>
                                </div>
                            </div>
                            
                            {/* Functional */}
                            <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                <div className="max-w-[80%]">
                                    <h4 className="text-white font-bold text-sm mb-1">Functional</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">Remembers your settings and language preferences.</p>
                                </div>
                                <button 
                                    onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 border ${preferences.functional ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 ${preferences.functional ? 'right-1' : 'left-1'}`}></div>
                                </button>
                            </div>
                            
                            {/* Analytics */}
                            <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                <div className="max-w-[80%]">
                                    <h4 className="text-white font-bold text-sm mb-1">Analytics</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">Helps us understand how you use our platform.</p>
                                </div>
                                <button 
                                    onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 border ${preferences.analytics ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 ${preferences.analytics ? 'right-1' : 'left-1'}`}></div>
                                </button>
                            </div>
                            
                            {/* Marketing */}
                            <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                <div className="max-w-[80%]">
                                    <h4 className="text-white font-bold text-sm mb-1">Marketing</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">Used to deliver personalized ads and content.</p>
                                </div>
                                <button 
                                    onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 border ${preferences.marketing ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 ${preferences.marketing ? 'right-1' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => setShowDetails(false)}
                                className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSavePreferences}
                                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CookieConsent;
