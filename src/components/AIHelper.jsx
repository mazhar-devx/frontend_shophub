import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { getProductImageUrl } from "../utils/constants";
import { formatPrice } from "../utils/currency";
import { useUIStore } from "../zustand/uiStore";

const WHATSAPP_NUMBER = "923291559040";
const WHATSAPP_WELCOME = "Assalamualaikum! I'm interested in products from HA Store. Can you help me?";

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
    const { showToast } = useUIStore();
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
                <p className="text-[15px] leading-relaxed">{parts[0]}</p>
                <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-2 px-2 snap-x">
                    {matches.map((match, i) => {
                        const productId = match[1];
                        const product = allProducts.find(p => p._id === productId || p.slug === productId);
                        if (!product) return null;

                        return (
                            <Link 
                                key={i}
                                to={`/product/${product.slug || product._id}`}
                                onClick={() => setIsOpen(false)}
                                className="min-w-[200px] max-w-[200px] flex flex-col bg-white/5 hover:bg-white/10 rounded-[2rem] border border-white/10 transition-all group/card overflow-hidden relative shadow-2xl snap-start"
                            >
                                <div className="absolute top-3 right-3 z-10">
                                   <div className="bg-pink-500/80 backdrop-blur-md text-[8px] font-black px-2 py-1 rounded-full text-white uppercase tracking-widest shadow-lg">Premium</div>
                                </div>
                                <div className="relative aspect-square overflow-hidden">
                                   <img 
                                       src={getProductImageUrl(product.image || (product.images && product.images[0]))} 
                                       alt={product.name}
                                       className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                   />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="p-4 flex flex-col gap-1">
                                    <h4 className="text-white font-bold text-xs truncate group-hover/card:text-cyan-400 transition-colors uppercase tracking-tight">{product.name}</h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-pink-500 font-black text-sm">{formatPrice(product.price, product.currency)}</span>
                                        <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                                            <span className="text-yellow-400 text-[8px]">⭐</span>
                                            <span className="text-[8px] text-gray-300 font-bold">{product.ratingsAverage || 5.0}</span>
                                        </div>
                                    </div>
                                    <button className="mt-3 w-full py-2 bg-white/10 group-hover/card:bg-pink-500 text-[10px] font-black uppercase tracking-widest text-white rounded-xl transition-all active:scale-95">View Details</button>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                {parts[parts.length - 1] && <p className="text-[15px] leading-relaxed">{parts[parts.length - 1]}</p>}
            </div>
        );
    };

    return (
        <div className="fixed max-md:bottom-24 bottom-6 right-6 z-[1000] flex flex-col items-end w-auto pointer-events-none group/ai">
            {/* AI Chat Panel */}
            <div className={`w-[92vw] sm:w-[450px] mb-6 pointer-events-auto transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none'}`}>
                <div className="glass border border-white/20 rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden flex flex-col h-[75vh] sm:h-[650px] relative">
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
                        {/* Integrated Contact Section at the top */}
                        <div className="animate-fade-in-up">
                            <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-[2rem] border border-green-500/20 p-6 mb-8 relative overflow-hidden group/contact">
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-2xl shadow-xl border-2 border-white/20">👨‍💼</div>
                                    <div>
                                        <h4 className="text-white font-black text-sm uppercase tracking-tight">Direct Support</h4>
                                        <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest animate-pulse">Always Online</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-1">
                                        <span className="text-[10px] font-black text-purple-400 uppercase">JazzCash</span>
                                        <span className="text-[8px] text-gray-500 font-bold uppercase">Safe Pay</span>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-1">
                                        <span className="text-[10px] font-black text-green-400 uppercase">EasyPaisa</span>
                                        <span className="text-[8px] text-gray-500 font-bold uppercase">Fast Pay</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_WELCOME)}`, '_blank')}
                                    className="w-full bg-gradient-to-br from-green-500 to-emerald-700 text-white font-black text-xs py-4 rounded-2xl shadow-xl hover:shadow-green-500/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.446 4.432-9.877 9.888-9.877 2.642 0 5.126 1.029 6.99 2.896a9.832 9.832 0 012.884 7.001c-.002 5.45-4.433 9.88-9.886 9.88M12 2a10.884 10.884 0 00-7.726 3.195C2.41 7.061 1.096 9.544 1.096 12.19c0 2.083.541 4.117 1.571 5.91L1 23l5.034-1.319a10.84 10.84 0 00 5.965 1.761h.004c11.967 0 21.685-9.718 21.685-21.685 0-5.712-2.228-11.082-6.273-15.127A21.536 21.536 0 0012 2.001z"/>
                                    </svg>
                                    <span className="uppercase tracking-[0.2em]">Contact Admin on WhatsApp</span>
                                </button>
                            </div>
                        </div>

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
