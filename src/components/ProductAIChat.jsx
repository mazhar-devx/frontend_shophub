import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useUIStore } from '../zustand/uiStore';

const ProductAIChat = ({ product }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Assalamualaikum! I'm the HA Store AI expert for this **${product?.name}**. Ask me any details about specs, usage, or sizing! 🚀🤖` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatRef = useRef(null);
    const modalRef = useRef(null);
    const { showToast } = useUIStore();

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const res = await api.post('/ai/product-guide', {
                message: userMessage,
                productId: product._id,
                history: history
            });

            if (res.data.status === 'success') {
                setMessages(prev => [...prev, { role: 'assistant', content: res.data.data.reply }]);
            }
        } catch (err) {
            showToast("AI Assistant is taking a nap. Please try again later! 😴", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mt-8 mb-12 px-4 md:px-0">
            {/* Collapsed State - Mini Trigger */}
            <div 
                onClick={() => setIsOpen(true)}
                className="group cursor-pointer glass rounded-2xl md:rounded-3xl border border-white/10 p-4 md:p-6 flex items-center gap-4 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500"
            >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-2xl md:text-3xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                    🧠
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Neural Hub Live</span>
                    </div>
                    <h3 className="text-white text-lg md:text-xl font-bold tracking-tight">
                        Ask AI about this product...
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm">Our neural assistant knows everything about this product.</p>
                </div>
                <div className="hidden md:flex w-10 h-10 rounded-full border border-white/10 items-center justify-center text-gray-400 group-hover:text-white group-hover:border-white/30 transition-all">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* Expanded State - Ultra Premium Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div 
                        ref={modalRef}
                        className="relative w-full max-w-5xl h-[90vh] md:h-[80vh] glass rounded-[2rem] md:rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row transition-all duration-500"
                    >
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:rotate-90 transition-all duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Left Sidebar - Branding */}
                        <div className="w-full md:w-96 bg-gradient-to-br from-indigo-950 via-purple-950 to-cyan-950 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden shrink-0">
                            {/* Animated Background Gradients */}
                            <div className="absolute top-0 -left-20 w-64 h-64 bg-cyan-500/10 blur-[100px] animate-pulse"></div>
                            <div className="absolute bottom-0 -right-20 w-64 h-64 bg-purple-500/10 blur-[100px] animate-pulse [animation-delay:2s]"></div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-5xl shadow-2xl mb-8 animate-bounce-slow">
                                    🧠
                                </div>
                                <h2 className="text-white text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-tight mb-4">
                                    AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">HUB</span>
                                </h2>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium">
                                    Our neural assistant knows everything about this product. Ask about specs, materials, or shipping!
                                </p>
                            </div>

                            <div className="relative z-10 space-y-4 pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-900 bg-gray-800 flex items-center justify-center text-[10px] text-white font-bold">
                                                U{i}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium tracking-wide">1.2k+ users helped</span>
                                </div>
                                <div className="h-[1px] w-full bg-white/5"></div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                                        <span className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.2em]">Active</span>
                                    </div>
                                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Powered by Groq 4.0</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Area - Chat Interface */}
                        <div className="flex-1 flex flex-col bg-black/60 backdrop-blur-3xl relative">
                            {/* Chat Messages */}
                            <div 
                                ref={chatRef} 
                                className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 md:space-y-8 custom-scrollbar scroll-smooth"
                            >
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                                        <div className={`max-w-[85%] md:max-w-[75%] p-5 md:p-7 rounded-[2rem] text-sm md:text-base leading-relaxed shadow-2xl border ${
                                            m.role === 'user' 
                                            ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-none border-white/10' 
                                            : 'bg-white/5 border-white/10 text-gray-200 rounded-tl-none backdrop-blur-md'
                                        }`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] rounded-tl-none shadow-lg">
                                            <div className="flex gap-2">
                                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.1s]"></div>
                                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.2s]"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-6 md:p-10 border-t border-white/10 bg-white/[0.02]">
                                <form onSubmit={handleSendMessage} className="relative group">
                                    <input 
                                        type="text" 
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl md:rounded-[2rem] pl-6 md:pl-8 pr-16 md:pr-20 py-4 md:py-6 text-sm md:text-base text-white focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder-gray-600"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 group shrink-0"
                                    >
                                        <svg className="w-5 h-5 md:w-6 md:h-6 transform rotate-90 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                                <p className="mt-4 text-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                                    Secured Neural Link • End-to-End Encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .animate-bounce-slow {
                    animation: bounce-slow 4s infinite ease-in-out;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </section>
    );
};

export default ProductAIChat;
