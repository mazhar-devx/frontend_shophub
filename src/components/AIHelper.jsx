import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { getProductImageUrl } from "../utils/constants";
import { formatPrice } from "../utils/currency";

export default function AIHelper() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("ai_chat_history");
        return saved ? JSON.parse(saved) : [
            { role: "assistant", content: "Assalamualaikum! I'm your HA Store Deep Brain AI. I have full knowledge of our inventory and can find exactly what you need. How can I assist you today? 🚀🤖" }
        ];
    });
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        localStorage.setItem("ai_chat_history", JSON.stringify(messages));
    }, [messages]);

    // Pre-fetch products for local lookup
    useEffect(() => {
        const fetchProducts = async () => {
            try {
        const { data } = await api.get('/products?limit=100');
        if (data.status === 'success') {
            // Products are in data.data.products, not data.data.data
            setAllProducts(data.data.products || []);
        }
            } catch (err) {
                console.warn("AI Helper product fetch failed:", err);
            }
        };
        if (isOpen && allProducts.length === 0) {
            fetchProducts();
        }
    }, [isOpen, allProducts.length]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const { data } = await api.post("/ai/deep-brain", {
                message: input,
                history: messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
            });

            if (data.status === 'success') {
                setMessages(prev => [...prev, { role: "assistant", content: data.data.reply }]);
            }
        } catch (err) {
            console.error("Deep Brain Error:", err);
            setMessages(prev => [...prev, { role: "assistant", content: "My neural link is flickering. Please ask again or contact Asad on WhatsApp! 🙏" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = () => {
        if(window.confirm("Format Deep Brain memory? 🧠🗑️")) {
            const initialMessage = [{ role: "assistant", content: "Memory formatted. Neural link re-established. How can I help? 😊" }];
            setMessages(initialMessage);
            localStorage.setItem("ai_chat_history", JSON.stringify(initialMessage));
        }
    };

    // Helper to render message with product cards
    const renderMessage = (msg) => {
        if (msg.role === 'user') return msg.content;

        // Regex to find [PRODUCT_ID:...]
        const productRegex = /\[PRODUCT_ID:([\w-]+)\]/g;
        const parts = msg.content.split(productRegex);
        const matches = [...msg.content.matchAll(productRegex)];

        if (matches.length === 0) return msg.content;

        return (
            <div className="space-y-4">
                <p>{parts[0]}</p>
                <div className="flex flex-col gap-3">
                    {matches.map((match, i) => {
                        const productId = match[1];
                        const product = allProducts.find(p => p._id === productId || p.slug === productId);
                        if (!product) return null;

                        return (
                            <Link 
                                key={i}
                                to={`/product/${product.slug || product._id}`}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all group/card overflow-hidden relative shadow-lg"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                <img 
                                    src={getProductImageUrl(product.image || (product.images && product.images[0]))} 
                                    alt={product.name}
                                    className="w-14 h-14 rounded-xl object-cover border border-white/10"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold text-sm truncate group-hover/card:text-cyan-400 transition-colors">{product.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-cyan-400 font-black text-xs">{formatPrice(product.price, product.currency)}</span>
                                        {product.ratingsAverage > 0 && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400 text-[10px]">⭐</span>
                                                <span className="text-[10px] text-gray-400">{product.ratingsAverage}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-gray-500 group-hover/card:translate-x-1 transition-transform">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                {parts[parts.length - 1] && <p>{parts[parts.length - 1]}</p>}
            </div>
        );
    };

    return (
        <div className="fixed max-md:bottom-24 bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center w-auto pointer-events-none">
            {/* AI Chat Panel */}
            <div className={`w-[90vw] sm:w-[450px] mb-6 pointer-events-auto transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none'}`}>
                <div className="glass border border-white/20 rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden flex flex-col h-[70vh] sm:h-[600px] relative">
                    {/* Neural Background Effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(124,58,237,0.2),_transparent_70%)] animate-pulse"></div>
                    </div>

                    {/* Header */}
                    <div className="p-6 bg-gradient-to-br from-indigo-950 via-purple-950 to-black border-b border-white/10 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <div className="relative w-12 h-12 rounded-2xl bg-black border border-white/20 flex items-center justify-center text-3xl shadow-2xl">
                                    🧠
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-indigo-950 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg leading-tight tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-cyan-200">HA DEEP BRAIN</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] text-cyan-400 font-black uppercase tracking-[0.3em] animate-pulse">Neural Link Active</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={clearHistory}
                                type="button"
                                className="p-2.5 bg-white/5 hover:bg-red-500/20 rounded-xl border border-white/10 transition-all active:scale-90"
                                title="Format Memory"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                type="button"
                                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all active:scale-90"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/40 relative z-10">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                                <div className={`relative max-w-[85%] p-4 rounded-[1.5rem] text-[15px] leading-relaxed shadow-2xl ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-tr-none border border-white/20' : 'bg-white/5 border border-white/10 text-gray-100 rounded-tl-none backdrop-blur-md'}`}>
                                    {renderMessage(msg)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl rounded-tl-none flex gap-2 shadow-xl">
                                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce"></div>
                                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-6 bg-black/80 border-t border-white/10 flex gap-3 pointer-events-auto relative z-10">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Deep Brain anything..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-cyan-500 outline-none transition-all placeholder-gray-500 focus:bg-white/10 shadow-inner"
                        />
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] active:scale-95 disabled:opacity-50 group"
                        >
                            <svg className="w-6 h-6 transform rotate-90 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto group relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 transform hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(124,58,237,0.5)] ${isOpen ? 'rotate-180 bg-white/10' : 'bg-gradient-to-br from-indigo-900 via-purple-700 to-cyan-600'}`}
            >
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[4px] rounded-full"></div>
                <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors animate-pulse"></div>
                
                {isOpen ? (
                    <svg className="w-10 h-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative">
                            <span className="text-3xl animate-bounce inline-block">🧠</span>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                        <span className="text-[8px] font-black tracking-widest text-white/90 uppercase -mt-1">Deep Brain</span>
                    </div>
                )}
            </button>
        </div>
    );
}
