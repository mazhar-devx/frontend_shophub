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
            { role: "assistant", content: "Neural Link Alpha-1 established. I am the HA Deep Brain, fully synchronized with HA Store's core systems. I have complete knowledge of our 2026 collection, shipping logistics, and secure payment protocols. How may I optimize your shopping experience? ⚡🧠" }
        ];
    });

    const STORE_KNOWLEDGE = {
        name: "HA Store (ShopHub.pro)",
        location: "Faisalabad, Pakistan",
        founder: "Mazhar (Admin: Asad)",
        shipping: "Fast Cash on Delivery (COD) across Pakistan. Delivery typically takes 2-4 working days.",
        returns: "7-day easy return policy for any manufacturing defects or damaged items.",
        payments: "We support COD, JazzCash, and EasyPaisa for direct/advanced payments.",
        contact: "You can contact our lead admin Asad directly via the WhatsApp button above."
    };
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");
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

        // Local Knowledge Check
        const lowerInput = input.toLowerCase();
        let localResponse = "";
        if (lowerInput.includes("location") || lowerInput.includes("where")) localResponse = `We are located in ${STORE_KNOWLEDGE.location}, but we ship all across Pakistan! 🇵🇰`;
        else if (lowerInput.includes("delivery") || lowerInput.includes("ship")) localResponse = STORE_KNOWLEDGE.shipping;
        else if (lowerInput.includes("return") || lowerInput.includes("policy")) localResponse = STORE_KNOWLEDGE.returns;
        else if (lowerInput.includes("founder") || lowerInput.includes("owner") || lowerInput.includes("mazhar")) localResponse = `${STORE_KNOWLEDGE.name} was founded by Mazhar. Our lead administrator is Asad.`;
        else if (lowerInput.includes("payment")) localResponse = STORE_KNOWLEDGE.payments;

            if (data.status === 'success') {
                const finalReply = localResponse ? `${localResponse}\n\n${data.data.reply}` : data.data.reply;
                
                // Stream the message for a more powerful feel
                let current = "";
                const words = finalReply.split(" ");
                for (let i = 0; i < words.length; i++) {
                    current += words[i] + " ";
                    setStreamingMessage(current);
                    await new Promise(r => setTimeout(r, 20));
                }
                
                setMessages(prev => [...prev, { role: "assistant", content: finalReply }]);
                setStreamingMessage("");
            }
        } catch (err) {
            console.error("Deep Brain Error:", err);
            const fallback = localResponse || "My neural link is flickering. Please ask again or contact Asad on WhatsApp! 🙏";
            setMessages(prev => [...prev, { role: "assistant", content: fallback }]);
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
                                className="min-w-[220px] max-w-[220px] flex flex-col bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-[2.5rem] border border-white/10 transition-all duration-500 group/card overflow-hidden relative shadow-2xl snap-start"
                            >
                                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                                   <div className="bg-cyan-500/90 backdrop-blur-md text-[7px] font-black px-2 py-1 rounded-full text-white uppercase tracking-[0.2em] shadow-lg border border-white/20">Verified AI Pick</div>
                                   <div className="bg-black/60 backdrop-blur-md text-[7px] font-black px-2 py-1 rounded-full text-white uppercase tracking-[0.1em] shadow-lg border border-white/10 flex items-center gap-1">
                                      <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span> In Stock
                                   </div>
                                </div>
                                
                                <div className="relative aspect-square overflow-hidden m-2 rounded-[2rem] bg-indigo-950/50">
                                   <img 
                                       src={getProductImageUrl(product.image || (product.images && product.images[0]))} 
                                       alt={product.name}
                                       className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                       onError={(e) => e.target.src = '/placeholder-product.jpg'}
                                   />
                                   {/* AI Scanning Overlay */}
                                   <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity">
                                      <div className="w-full h-[2px] bg-cyan-400/50 absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                                   </div>
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                </div>
                                
                                <div className="px-5 pb-5 flex flex-col gap-1">
                                    <h4 className="text-white font-black text-[11px] leading-tight group-hover/card:text-cyan-400 transition-colors uppercase tracking-tighter line-clamp-2 min-h-[2.4em] mt-1">{product.name}</h4>
                                    
                                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                                        <div className="flex flex-col">
                                           <span className="text-pink-500 font-black text-sm tracking-tighter">{formatPrice(product.price, product.currency)}</span>
                                           <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">Inclusive Price</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                <span className="text-yellow-400 text-[8px]">⭐</span>
                                                <span className="text-[8px] text-gray-300 font-black">{product.ratingsAverage || 5.0}</span>
                                            </div>
                                            <span className="text-[6px] text-gray-500 font-black uppercase mt-1">Authentic</span>
                                        </div>
                                    </div>
                                    
                                    <button className="mt-4 w-full py-3 bg-gradient-to-r from-cyan-600/50 to-purple-600/50 group-hover/card:from-cyan-500 group-hover/card:to-purple-600 text-[9px] font-black uppercase tracking-[0.2em] text-white rounded-2xl transition-all active:scale-95 shadow-xl">
                                       Purchase Now
                                    </button>
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
        <div className="fixed max-md:bottom-24 bottom-6 right-6 z-[1000] flex flex-col items-end w-auto pointer-events-none group/ai forced-dark">
            <style>{`
                .forced-dark { color-scheme: dark; }
                @keyframes scan { from { top: 0; } to { top: 100%; } }
                @keyframes grid-move { from { background-position: 0 0; } to { background-position: 0 40px; } }
            `}</style>
            
            {/* AI Chat Panel */}
            <div className={`w-[95vw] sm:w-[480px] mb-6 pointer-events-auto transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none'}`}>
                <div className="bg-[#050505] border border-white/10 rounded-[3rem] shadow-[0_50px_120px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-[80vh] sm:h-[700px] relative">
                    {/* Neural Grid Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', animation: 'grid-move 4s linear infinite' }}></div>

                    {/* Header */}
                    <div className="p-6 bg-gradient-to-br from-indigo-950 via-purple-950 to-black border-b border-white/10 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-tilt"></div>
                                <div className="relative w-14 h-14 rounded-2xl bg-black border border-white/20 flex items-center justify-center shadow-2xl overflow-hidden">
                                    <svg className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10A10 10 0 0 0 12 2z"/>
                                        <path d="M12 6v6l4 2"/>
                                        <path d="M16.2 7.8l-4.2 4.2"/>
                                        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2"/>
                                        <path d="M12 12h.01"/>
                                    </svg>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-indigo-950 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-black text-xl leading-tight tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-indigo-300 drop-shadow-sm">HA DEEP BRAIN</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_#22d3ee]"></div>
                                    <span className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.25em] animate-pulse">Neural Core v2.4</span>
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
                                <div className={`relative max-w-[85%] p-5 rounded-[2rem] text-[15px] leading-relaxed shadow-2xl ${msg.role === 'user' ? 'bg-gradient-to-br from-cyan-600 to-indigo-700 text-white rounded-tr-none border border-white/20' : 'bg-white/5 border border-white/10 text-cyan-50 rounded-tl-none backdrop-blur-xl'}`}>
                                    {renderMessage(msg)}
                                </div>
                            </div>
                        ))}
                        
                        {streamingMessage && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] rounded-tl-none text-cyan-50 shadow-2xl backdrop-blur-xl">
                                    <p className="text-[15px] leading-relaxed">{streamingMessage}</p>
                                    <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1 align-middle"></span>
                                </div>
                            </div>
                        )}

                        {isLoading && !streamingMessage && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] rounded-tl-none flex flex-col gap-3 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 animate-pulse"></div>
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                        </div>
                                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] animate-pulse">Deep Thinking...</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 font-medium italic">Analyzing inventory and neural patterns...</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="px-6 py-3 bg-black/40 flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto relative z-10 border-t border-white/5">
                        {["Where is my order?", "How to pay?", "Track Delivery", "Contact Asad"].map((text) => (
                            <button 
                                key={text}
                                onClick={() => {
                                    setInput(text);
                                    setTimeout(() => handleSendMessage(), 100);
                                }}
                                className="whitespace-nowrap px-4 py-2 bg-white/5 hover:bg-cyan-500/20 border border-white/10 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest transition-all active:scale-95"
                            >
                                {text}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-6 bg-[#0a0a0a] border-t border-white/10 flex gap-3 pointer-events-auto relative z-10">
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

            {/* Ultra Professional Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto group relative w-24 h-24 flex items-center justify-center transition-all duration-700 transform hover:scale-110 active:scale-90 ${isOpen ? 'rotate-180' : ''}`}
            >
                {/* Orbital Rings */}
                <div className={`absolute inset-0 rounded-full border-2 border-cyan-500/30 transition-all duration-1000 ${isOpen ? 'scale-150 opacity-0' : 'animate-[spin_4s_linear_infinite]'}`}></div>
                <div className={`absolute inset-2 rounded-full border border-purple-500/30 transition-all duration-1000 ${isOpen ? 'scale-125 opacity-0' : 'animate-[spin_3s_linear_infinite_reverse]'}`}></div>
                
                {/* Main Sphere */}
                <div className={`absolute inset-4 rounded-full shadow-[0_0_50px_rgba(34,211,238,0.4)] transition-all duration-500 flex items-center justify-center overflow-hidden ${isOpen ? 'bg-white/10 backdrop-blur-xl border border-white/20' : 'bg-gradient-to-br from-indigo-950 via-purple-900 to-black border-2 border-white/10 group-hover:border-cyan-400/50'}`}>
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.1),_transparent)]"></div>
                    
                    {isOpen ? (
                        <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                    ) : (
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="relative mb-1">
                                <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">🧠</span>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] text-cyan-400 uppercase leading-none">Deep Brain</span>
                        </div>
                    )}
                </div>

                {/* Outer Glow Pulse */}
                {!isOpen && (
                   <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-pulse -z-10 blur-xl"></div>
                )}
            </button>
        </div>
    );
}
