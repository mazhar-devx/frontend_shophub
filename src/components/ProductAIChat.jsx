import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useUIStore } from '../zustand/uiStore';

const ProductAIChat = ({ product }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Assalamualaikum! I'm the HA Store AI expert for this **${product?.name}**. Ask me any details about specs, usage, or sizing! 🚀🤖` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatRef = useRef(null);
    const { showToast } = useUIStore();

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

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
        <section className="mt-12 mb-12 animate-fade-in px-4 md:px-0">
            <div className="glass rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row min-h-[500px] max-h-[700px] md:h-[550px]">
                {/* Left Sidebar - AI Branding */}
                <div className="w-full md:w-80 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-cyan-900/40 p-6 md:p-8 flex flex-row md:flex-col justify-between items-center md:items-start border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl md:hidden"></div>
                    <div className="relative z-10 flex items-center md:block gap-4">
                        <div className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/10 flex items-center justify-center text-2xl md:text-4xl border border-white/20 shadow-2xl animate-pulse">
                            🧠
                        </div>
                        <div className="md:mt-6">
                            <h2 className="text-white text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none mb-1 md:mb-2">
                                AI <span className="text-cyan-400">HUB</span>
                            </h2>
                            <p className="hidden md:block text-gray-400 text-xs md:text-sm leading-relaxed">
                                Our neural assistant knows everything about this product.
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative z-10 flex md:block items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[8px] md:text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">Live</span>
                        </div>
                        <div className="hidden md:block h-[1px] w-full bg-white/10 my-2"></div>
                        <p className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest font-black">Groq 4.0</p>
                    </div>
                </div>

                {/* Right Area - Chat Interface */}
                <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-3xl min-h-[400px]">
                    {/* Chat Area */}
                    <div ref={chatRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] md:max-w-[85%] p-3.5 md:p-4 rounded-2xl md:rounded-3xl text-sm md:text-[15px] leading-relaxed shadow-xl border border-white/5 ${
                                    m.role === 'user' 
                                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-tr-none' 
                                    : 'bg-white/5 border-white/10 text-gray-200 rounded-tl-none backdrop-blur-md'
                                }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 p-3 md:p-4 rounded-2xl md:rounded-3xl rounded-tl-none shadow-lg">
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.1s]"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.2s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 md:p-6 border-t border-white/10 flex gap-2 md:gap-3 bg-white/5">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me something..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder-gray-600"
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 group shrink-0"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6 transform rotate-90 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ProductAIChat;
