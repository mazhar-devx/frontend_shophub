import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { getProductImageUrl } from "../utils/constants";
import { formatPrice } from "../utils/currency";
import { useUIStore } from "../zustand/uiStore";

const WHATSAPP_NUMBER = "923291559040";
const WHATSAPP_WELCOME = "Assalamualaikum! I'm interested in products from HA Store. Can you help me?";

// ─── Advanced Constants ───
const NEURAL_VERSION = "v3.2.1";
const MAX_HISTORY = 50;
const STREAM_SPEED = 18;
const TYPING_TIMEOUT = 3000;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1500;

const STORE_KNOWLEDGE = {
    name: "HA Store (ShopHub.pro)",
    location: "Faisalabad, Pakistan",
    founder: "Mazhar (Admin: Asad)",
    shipping: "Fast Cash on Delivery (COD) across Pakistan. Delivery typically takes 2-4 working days.",
    returns: "7-day easy return policy for any manufacturing defects or damaged items.",
    payments: "We support COD, JazzCash, and EasyPaisa for direct/advanced payments.",
    contact: "You can contact our lead admin Asad directly via the WhatsApp button above.",
    hours: "We operate 24/7 online. Admin support available 10 AM - 11 PM PKT.",
    guarantee: "100% Authenticity Guarantee on all products. Money-back if not satisfied.",
    categories: ["Electronics", "Fashion", "Accessories", "Home & Living", "Beauty"],
};

const CONTEXT_SUGGESTIONS = {
    greeting: ["Show trending products", "Track my order", "How to pay?", "Return policy"],
    order: ["Where is my order?", "Track Delivery", "Cancel order", "Return an item"],
    product: ["Show me deals", "New arrivals", "Best sellers", "Compare products"],
    payment: ["JazzCash details", "EasyPaisa details", "COD process", "Payment failed"],
    default: ["Where is my order?", "How to pay?", "Track Delivery", "Contact Asad", "Show deals"],
};

// ─── Utility Functions ───
const detectIntent = (text) => {
    const lower = text.toLowerCase();
    if (/^(hi|hello|hey|salam|assalam|howdy|yo|sup)/i.test(lower)) return "greeting";
    if (/order|track|deliver|ship|where.*my/i.test(lower)) return "order";
    if (/pay|jazzcash|easypaisa|cod|money|price|cost/i.test(lower)) return "payment";
    if (/product|buy|shop|deal|sale|new|trend|best/i.test(lower)) return "product";
    return "default";
};

const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatMarkdown = (text) => {
    if (!text) return "";
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300 font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-purple-300 italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-cyan-400 text-[13px] font-mono">$1</code>')
        .replace(/\n/g, '<br/>');
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// ─── Memoized Sub-Components ───
const ProductCard = memo(({ product, onClose }) => {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current || window.innerWidth < 768) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setTilt({ x: (y - 0.5) * -12, y: (x - 0.5) * 12 });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    }, []);

    return (
        <Link
            ref={cardRef}
            to={`/product/${product.slug || product._id}`}
            onClick={onClose}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="w-[150px] min-[400px]:w-[170px] sm:w-[200px] md:w-[230px] flex-shrink-0 flex flex-col bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl md:rounded-[2.5rem] border border-white/10 transition-all duration-500 group/card overflow-hidden relative shadow-2xl snap-start"
            style={{
                transform: isHovered && window.innerWidth >= 768 ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.03)` : "perspective(800px) rotateX(0) rotateY(0) scale(1)",
                transition: "transform 0.2s ease-out, box-shadow 0.5s ease",
                boxShadow: isHovered ? "0 25px 60px -15px rgba(34,211,238,0.25)" : "0 10px 30px -10px rgba(0,0,0,0.5)",
            }}
        >
            {/* Holographic shimmer - desktop only */}
            <div
                className="hidden md:block absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none z-20 rounded-2xl md:rounded-[2.5rem]"
                style={{
                    background: isHovered
                        ? `linear-gradient(${135 + tilt.y * 10}deg, transparent 30%, rgba(34,211,238,0.07) 50%, transparent 70%)`
                        : "none",
                }}
            />

            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 flex flex-col gap-1 md:gap-2 items-end">
                <div className="bg-cyan-500/90 backdrop-blur-md text-[6px] md:text-[7px] font-black px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full text-white uppercase tracking-[0.15em] md:tracking-[0.2em] shadow-lg border border-white/20 flex items-center gap-0.5 md:gap-1">
                    <svg className="w-2 md:w-2.5 h-2 md:h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    AI Pick
                </div>
                <div className="bg-black/60 backdrop-blur-md text-[5px] md:text-[7px] font-black px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-white uppercase tracking-[0.08em] md:tracking-[0.1em] shadow-lg border border-white/10 flex items-center gap-0.5 md:gap-1">
                    <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-500 rounded-full animate-pulse"></span> In Stock
                </div>
            </div>

            <div className="relative aspect-square overflow-hidden m-1.5 md:m-2 rounded-xl md:rounded-[2rem] bg-indigo-950/50">
                <img
                    src={getProductImageUrl(product.image || (product.images && product.images[0]))}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    loading="lazy"
                    onError={(e) => { e.target.src = "/placeholder-product.jpg"; }}
                />
                <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <div className="w-full h-[2px] bg-cyan-400/50 absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                {/* Quick view badge - desktop only */}
                <div className="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all duration-300">
                    <span className="bg-white/20 backdrop-blur-md text-[9px] font-black text-white px-4 py-2 rounded-full uppercase tracking-widest border border-white/20">Quick View</span>
                </div>
            </div>

            <div className="px-3 md:px-5 pb-3 md:pb-5 flex flex-col gap-0.5 md:gap-1">
                <h4 className="text-white font-black text-[9px] md:text-[11px] leading-tight group-hover/card:text-cyan-400 transition-colors uppercase tracking-tighter line-clamp-2 min-h-[2em] md:min-h-[2.4em] mt-0.5 md:mt-1">{product.name}</h4>
                <div className="flex items-center justify-between mt-1 md:mt-2 pt-2 md:pt-3 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-pink-500 font-black text-xs md:text-sm tracking-tighter">{formatPrice(product.price, product.currency)}</span>
                        <span className="text-[6px] md:text-[7px] text-gray-500 font-bold uppercase tracking-widest">Inclusive Price</span>
                    </div>
                    <div className="flex items-center gap-0.5 md:gap-1 bg-white/5 px-1.5 md:px-2 py-0.5 rounded-full border border-white/5">
                        <span className="text-yellow-400 text-[7px] md:text-[8px]">⭐</span>
                        <span className="text-[7px] md:text-[8px] text-gray-300 font-black">{product.ratingsAverage || 5.0}</span>
                    </div>
                </div>
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="mt-2 md:mt-4 w-full py-2 md:py-3 bg-gradient-to-r from-cyan-600/50 to-purple-600/50 group-hover/card:from-cyan-500 group-hover/card:to-purple-600 text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-white rounded-xl md:rounded-2xl transition-all active:scale-95 shadow-xl border border-white/5"
                >
                    Purchase Now
                </button>
            </div>
        </Link>
    );
});
ProductCard.displayName = "ProductCard";

const VideoCard = memo(({ video, onClose }) => (
    <Link
        to={`/watch-me?v=${video._id}`}
        onClick={onClose}
        className="w-[110px] min-[400px]:w-[130px] sm:w-[145px] md:w-[160px] flex-shrink-0 aspect-[9/16] flex flex-col bg-black rounded-2xl md:rounded-[2.5rem] border border-white/10 transition-all duration-500 group/vid overflow-hidden relative shadow-2xl snap-start hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:border-purple-500/30"
    >
        <img
            src={video.thumbnail || "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg"}
            alt={video.name}
            className="w-full h-full object-cover opacity-60 group-hover/vid:opacity-100 group-hover/vid:scale-110 transition-all duration-700"
            loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 group-hover/vid:scale-125 transition-all duration-500 shadow-2xl">
                <svg className="w-4 h-4 md:w-6 md:h-6 text-white fill-white ml-0.5 md:ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
        </div>
        <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4">
            <p className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-wider md:tracking-widest line-clamp-2 drop-shadow-lg">{video.name || "Watch Me"}</p>
            {video.views && <p className="text-[7px] md:text-[8px] text-gray-400 mt-0.5 md:mt-1 font-bold">{video.views} views</p>}
        </div>
    </Link>
));
VideoCard.displayName = "VideoCard";

const NeuralParticle = memo(({ delay, size, x, y, duration }) => (
    <div
        className="absolute rounded-full bg-cyan-400/30 pointer-events-none"
        style={{
            width: size,
            height: size,
            left: `${x}%`,
            top: `${y}%`,
            animation: `neuralFloat ${duration}s ease-in-out ${delay}s infinite alternate`,
        }}
    />
));
NeuralParticle.displayName = "NeuralParticle";

const TypingIndicator = memo(() => (
    <div className="flex justify-start animate-fade-in-up">
        <div className="bg-white/5 border border-white/10 p-3 md:p-5 rounded-2xl md:rounded-[2rem] rounded-tl-none flex flex-col gap-2 md:gap-3 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 animate-pulse"></div>
            <div className="flex items-center gap-2 md:gap-3 relative z-10">
                <div className="flex gap-1 md:gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full animate-bounce"
                            style={{
                                animationDelay: `${-0.3 + i * 0.15}s`,
                                background: ["#22d3ee", "#a855f7", "#6366f1"][i],
                            }}
                        />
                    ))}
                </div>
                <span className="text-[8px] md:text-[10px] font-black text-cyan-400 uppercase tracking-[0.15em] md:tracking-[0.2em] animate-pulse">Thinking...</span>
            </div>
            <div className="relative z-10 flex items-center gap-1.5 md:gap-2">
                <div className="h-[2px] bg-cyan-500/30 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: "40px", maxWidth: "60px" }}></div>
                <p className="text-[8px] md:text-[10px] text-gray-500 font-medium italic">Analyzing...</p>
            </div>
        </div>
    </div>
));
TypingIndicator.displayName = "TypingIndicator";

// ─── Main Component ───
export default function AIHelper() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem("ai_chat_history_v3");
            if (saved) {
                const parsed = JSON.parse(saved);
                return Array.isArray(parsed) ? parsed.slice(-MAX_HISTORY) : null;
            }
        } catch (e) { /* ignore */ }
        return [
            {
                id: generateId(),
                role: "assistant",
                content: `**Neural Link Alpha-1** established. I am the HA Deep Brain, fully synchronized with HA Store's core systems.\n\nI have complete knowledge of our 2026 collection, shipping logistics, and secure payment protocols.\n\nHow may I optimize your shopping experience? ⚡🧠`,
                timestamp: getTimestamp(),
                reactions: [],
            }
        ];
    });

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [allVideos, setAllVideos] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastIntent, setLastIntent] = useState("default");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("connected");
    const [showHeaderMenu, setShowHeaderMenu] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);
    const recognitionRef = useRef(null);
    const audioContextRef = useRef(null);
    const headerMenuRef = useRef(null);
    const { showToast } = useUIStore();

    // ─── Close header menu on outside click ───
    useEffect(() => {
        const handler = (e) => {
            if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
                setShowHeaderMenu(false);
            }
        };
        document.addEventListener("touchstart", handler);
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("touchstart", handler);
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    // ─── Scroll Management ───
    const scrollToBottom = useCallback((behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, []);

    useEffect(() => {
        scrollToBottom();
        try {
            localStorage.setItem("ai_chat_history_v3", JSON.stringify(messages.slice(-MAX_HISTORY)));
        } catch (e) { /* storage full */ }
    }, [messages, scrollToBottom]);

    // ─── Unread counter when closed ───
    useEffect(() => {
        if (!isOpen && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.role === "assistant") {
                setUnreadCount((prev) => prev + 1);
            }
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // ─── Sound Effects ───
    const playSound = useCallback((type = "send") => {
        if (!soundEnabled) return;
        try {
            const ctx = audioContextRef.current || new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = ctx;
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();
            oscillator.connect(gain);
            gain.connect(ctx.destination);

            if (type === "send") {
                oscillator.frequency.setValueAtTime(880, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.06, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.12);
            } else if (type === "receive") {
                oscillator.frequency.setValueAtTime(660, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
                oscillator.type = "sine";
                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.2);
            } else if (type === "error") {
                oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                oscillator.type = "sawtooth";
                gain.gain.setValueAtTime(0.04, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
            }
        } catch (e) { /* audio not supported */ }
    }, [soundEnabled]);

    // ─── Pre-fetch Store Data ───
    useEffect(() => {
        if (!isOpen) return;
        const fetchStoreData = async () => {
            try {
                setConnectionStatus("connecting");
                const [prodRes, vidRes, orderRes] = await Promise.allSettled([
                    api.get("/products?limit=50"),
                    api.get("/videos?limit=10"),
                    api.get("/orders/myorders"),
                ]);

                if (prodRes.status === "fulfilled" && prodRes.value.data?.status === "success") {
                    setAllProducts(prodRes.value.data.data.products || []);
                }
                if (vidRes.status === "fulfilled" && vidRes.value.data?.status === "success") {
                    setAllVideos(vidRes.value.data.data.videos || []);
                }
                if (orderRes.status === "fulfilled" && orderRes.value.data?.status === "success") {
                    setUserOrders(orderRes.value.data.data || []);
                }
                setConnectionStatus("connected");
            } catch (err) {
                console.warn("AI Helper data fetch failed:", err);
                setConnectionStatus("degraded");
            }
        };
        fetchStoreData();
    }, [isOpen]);

    // ─── Voice Input Setup ───
    useEffect(() => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) return;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((r) => r[0].transcript)
                .join("");
            setInput(transcript);
            if (event.results[0].isFinal) {
                setIsListening(false);
            }
        };
        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);

        return () => {
            try { recognitionRef.current?.stop(); } catch (e) { /* */ }
        };
    }, []);

    const toggleVoice = useCallback(() => {
        if (!recognitionRef.current) {
            showToast("Voice input not supported in this browser", "error");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                showToast("Listening... Speak now 🎤", "info");
            } catch (e) {
                setIsListening(false);
            }
        }
    }, [isListening, showToast]);

    // ─── Local Knowledge Engine ───
    const getLocalResponse = useCallback((text) => {
        const lower = text.toLowerCase();
        let response = "";

        if (/location|where.*you|where.*store|address/i.test(lower)) {
            response = `📍 We are located in **${STORE_KNOWLEDGE.location}**, but we ship all across Pakistan! 🇵🇰`;
        } else if (/deliver|shipping|ship|how long|when.*arrive/i.test(lower)) {
            response = `🚚 ${STORE_KNOWLEDGE.shipping}`;
        } else if (/return|refund|policy|warranty|guarantee/i.test(lower)) {
            response = `↩️ ${STORE_KNOWLEDGE.returns}\n\n🛡️ ${STORE_KNOWLEDGE.guarantee}`;
        } else if (/founder|owner|mazhar|who.*made|who.*created/i.test(lower)) {
            response = `👑 **${STORE_KNOWLEDGE.name}** was founded by **Mazhar**. Our lead administrator is **Asad**.`;
        } else if (/pay|jazzcash|easypaisa|cod|how.*pay|payment/i.test(lower)) {
            response = `💳 ${STORE_KNOWLEDGE.payments}`;
        } else if (/hour|time|open|close|when.*available/i.test(lower)) {
            response = `🕐 ${STORE_KNOWLEDGE.hours}`;
        } else if (/categor|what.*sell|type.*product|collection/i.test(lower)) {
            response = `📂 Our categories: **${STORE_KNOWLEDGE.categories.join("**, **")}**`;
        } else if (/order|track|where.*order|status/i.test(lower)) {
            if (userOrders.length > 0) {
                const latest = userOrders[0];
                const orderId = latest.orderNumber || latest._id.slice(-6).toUpperCase();
                const statusEmoji = { processing: "⏳", shipped: "🚚", delivered: "✅", cancelled: "❌" }[latest.status] || "📋";
                response = `${statusEmoji} Found your latest order **#${orderId}**!\n\nStatus: **${latest.status?.toUpperCase()}**\nTotal: **${formatPrice(latest.totalPrice, latest.currency)}**`;
            } else {
                response = "📋 I couldn't find any active orders. Please make sure you are logged in or check the **My Orders** page.";
            }
        } else if (/video|watch|reel|tiktok/i.test(lower)) {
            if (allVideos.length > 0) {
                response = `🎬 I've scanned our **Watch Me** database and found **${allVideos.length}** amazing moments for you!`;
            }
        } else if (/deal|discount|sale|offer|coupon/i.test(lower)) {
            response = "🔥 Check our latest deals! Use the product search or ask me to show trending products for current offers.";
        } else if (/hello|hi|hey|salam|assalam|howdy/i.test(lower)) {
            response = "👋 Walaikum Assalam! Welcome to **HA Deep Brain**. I'm here to help you with anything you need!";
        }

        return response;
    }, [userOrders, allVideos]);

    // ─── Smart Suggestions ───
    const currentSuggestions = useMemo(() => {
        return CONTEXT_SUGGESTIONS[lastIntent] || CONTEXT_SUGGESTIONS.default;
    }, [lastIntent]);

    // ─── Search Messages ───
    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) return messages;
        const q = searchQuery.toLowerCase();
        return messages.filter((m) => m.content.toLowerCase().includes(q));
    }, [messages, searchQuery]);

    // ─── Send Message ───
    const handleSendMessage = useCallback(async (e) => {
        if (e) e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const intent = detectIntent(trimmed);
        setLastIntent(intent);

        const userMessage = {
            id: generateId(),
            role: "user",
            content: trimmed,
            timestamp: getTimestamp(),
            reactions: [],
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        playSound("send");

        const localResponse = getLocalResponse(trimmed);

        try {
            setConnectionStatus("processing");
            const { data } = await api.post("/ai/deep-brain", {
                message: trimmed,
                history: messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
                localContext: localResponse,
            });

            if (data.status === "success") {
                const finalReply = localResponse ? `${localResponse}\n\n${data.data.reply}` : data.data.reply;

                let current = "";
                const chars = finalReply.split("");
                for (let i = 0; i < chars.length; i++) {
                    current += chars[i];
                    setStreamingMessage(current);
                    const delay = /[.!?]/.test(chars[i]) ? STREAM_SPEED * 4 : /[,;:]/.test(chars[i]) ? STREAM_SPEED * 2 : STREAM_SPEED;
                    await new Promise((r) => setTimeout(r, delay));
                }

                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateId(),
                        role: "assistant",
                        content: finalReply,
                        timestamp: getTimestamp(),
                        reactions: [],
                    },
                ]);
                setStreamingMessage("");
                playSound("receive");
                setRetryCount(0);
                setConnectionStatus("connected");
            }
        } catch (err) {
            console.error("Deep Brain Error:", err);
            setConnectionStatus("error");
            playSound("error");

            if (retryCount < RETRY_ATTEMPTS) {
                setRetryCount((prev) => prev + 1);
                const fallback = localResponse || `⚠️ Neural link disrupted (attempt ${retryCount + 1}/${RETRY_ATTEMPTS}). Retrying automatically...`;
                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateId(),
                        role: "assistant",
                        content: fallback,
                        timestamp: getTimestamp(),
                        reactions: [],
                        isError: true,
                    },
                ]);

                setTimeout(() => {
                    setInput(trimmed);
                    handleSendMessage();
                }, RETRY_DELAY);
            } else {
                const fallback = localResponse || "🔴 My neural link is experiencing interference. Please try again or contact **Asad** on WhatsApp for immediate assistance! 🙏";
                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateId(),
                        role: "assistant",
                        content: fallback,
                        timestamp: getTimestamp(),
                        reactions: [],
                        isError: true,
                    },
                ]);
                setRetryCount(0);
            }
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages, getLocalResponse, retryCount, playSound]);

    // ─── Message Actions ───
    const copyMessage = useCallback((content) => {
        navigator.clipboard.writeText(content).then(() => {
            showToast("Message copied!", "success");
        }).catch(() => {
            showToast("Failed to copy", "error");
        });
    }, [showToast]);

    const toggleReaction = useCallback((messageId, emoji) => {
        setMessages((prev) =>
            prev.map((msg) => {
                if (msg.id !== messageId) return msg;
                const reactions = msg.reactions || [];
                const existing = reactions.findIndex((r) => r.emoji === emoji);
                if (existing >= 0) {
                    reactions.splice(existing, 1);
                } else {
                    reactions.push({ emoji, at: Date.now() });
                }
                return { ...msg, reactions };
            })
        );
    }, []);

    const clearHistory = useCallback(() => {
        if (window.confirm("Format Deep Brain memory? 🧠🗑️ This action cannot be undone.")) {
            const initialMessage = [
                {
                    id: generateId(),
                    role: "assistant",
                    content: `🧠 Memory formatted. **Neural Link v3.2.1** re-established.\n\nAll systems operational. How may I assist you? ⚡`,
                    timestamp: getTimestamp(),
                    reactions: [],
                },
            ];
            setMessages(initialMessage);
            localStorage.setItem("ai_chat_history_v3", JSON.stringify(initialMessage));
            showToast("Chat history cleared", "success");
        }
    }, [showToast]);

    const exportChat = useCallback(() => {
        const text = messages.map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `HA-Deep-Brain-Chat-${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Chat exported!", "success");
    }, [messages, showToast]);

    // ─── Keyboard Shortcuts ───
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape" && isOpen) {
                if (showSearch) setShowSearch(false);
                else if (showEmojiPicker) setShowEmojiPicker(false);
                else if (showHeaderMenu) setShowHeaderMenu(false);
                else setIsOpen(false);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "k" && isOpen) {
                e.preventDefault();
                setShowSearch((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, showSearch, showEmojiPicker, showHeaderMenu]);

    // ─── Render Message Content ───
    const renderMessage = useCallback((msg) => {
        if (msg.role === "user") {
            return (
                <div className="space-y-1">
                    <p className="text-[13px] md:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-[8px] md:text-[9px] text-white/40 font-bold">{msg.timestamp}</span>
                </div>
            );
        }

        const productRegex = /\[PRODUCT_ID:([\w-]+)\]/g;
        const videoRegex = /\[VIDEO_ID:([\w-]+)\]/g;

        let content = msg.content;
        const productsMatches = [...content.matchAll(productRegex)];
        const videoMatches = [...content.matchAll(videoRegex)];

        const textContent = content.replace(productRegex, "").replace(videoRegex, "").trim();

        return (
            <div className="space-y-3 md:space-y-4">
                <div className="space-y-1">
                    <div
                        className="text-[13px] md:text-[15px] leading-relaxed prose-invert"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(textContent) }}
                    />
                    <div className="flex items-center gap-2 md:gap-3 pt-1">
                        <span className="text-[8px] md:text-[9px] text-gray-600 font-bold">{msg.timestamp}</span>
                        {msg.isError && <span className="text-[7px] md:text-[8px] text-red-400 font-bold uppercase tracking-widest">⚠ Error</span>}
                    </div>
                </div>

                {/* Product Cards */}
                {productsMatches.length > 0 && (
                    <div className="flex overflow-x-auto gap-2 md:gap-4 pb-2 md:pb-3 no-scrollbar -mx-1 md:-mx-2 px-1 md:px-2 snap-x snap-mandatory">
                        <div className="flex items-center gap-1.5 md:gap-2 min-w-fit px-2 md:px-3">
                            <div className="w-0.5 md:w-1 h-6 md:h-8 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full"></div>
                            <span className="text-[7px] md:text-[9px] text-gray-500 font-black uppercase tracking-wider md:tracking-widest whitespace-nowrap">
                                {productsMatches.length} Product{productsMatches.length > 1 ? "s" : ""}
                            </span>
                        </div>
                        {productsMatches.map((match, i) => {
                            const productId = match[1];
                            const product = allProducts.find((p) => p._id === productId || p.slug === productId);
                            if (!product) return null;
                            return <ProductCard key={`${productId}-${i}`} product={product} onClose={() => setIsOpen(false)} />;
                        })}
                    </div>
                )}

                {/* Video Cards */}
                {videoMatches.length > 0 && (
                    <div className="flex overflow-x-auto gap-2 md:gap-4 pb-2 md:pb-3 no-scrollbar -mx-1 md:-mx-2 px-1 md:px-2 snap-x snap-mandatory">
                        <div className="flex items-center gap-1.5 md:gap-2 min-w-fit px-2 md:px-3">
                            <div className="w-0.5 md:w-1 h-6 md:h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                            <span className="text-[7px] md:text-[9px] text-gray-500 font-black uppercase tracking-wider md:tracking-widest whitespace-nowrap">
                                {videoMatches.length} Video{videoMatches.length > 1 ? "s" : ""}
                            </span>
                        </div>
                        {videoMatches.map((match, i) => {
                            const video = allVideos.find((v) => v._id === match[1]);
                            if (!video) return null;
                            return <VideoCard key={`${video._id}-${i}`} video={video} onClose={() => setIsOpen(false)} />;
                        })}
                    </div>
                )}
            </div>
        );
    }, [allProducts, allVideos]);

    // ─── Neural Particles ───
    const particles = useMemo(() =>
        Array.from({ length: 8 }, (_, i) => ({
            id: i,
            delay: Math.random() * 3,
            size: 2 + Math.random() * 3,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: 3 + Math.random() * 4,
        })), []);

    // ─── Connection Status Indicator ───
    const statusConfig = useMemo(() => ({
        connected: { color: "bg-green-500", text: "Online", glow: "shadow-[0_0_8px_rgba(34,197,94,0.6)]" },
        connecting: { color: "bg-yellow-500", text: "Connecting...", glow: "animate-pulse" },
        processing: { color: "bg-cyan-500", text: "Processing...", glow: "animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" },
        degraded: { color: "bg-orange-500", text: "Limited", glow: "animate-pulse" },
        error: { color: "bg-red-500", text: "Error", glow: "animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" },
    }), []);

    // ─── Header Action Button ───
    const HeaderActionButton = ({ onClick, title, children, className = "" }) => (
        <button
            onClick={onClick}
            className={`p-2 md:p-2.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-lg md:rounded-xl border border-white/[0.06] transition-all active:scale-90 ${className}`}
            title={title}
        >
            {children}
        </button>
    );

    return (
        <div className="fixed bottom-20 md:bottom-6 right-0 md:right-6 z-[1000] flex flex-col items-end w-auto pointer-events-none group/ai forced-dark">
            <style>{`
                .forced-dark { color-scheme: dark; }
                @keyframes scan { from { top: 0; } to { top: 100%; } }
                @keyframes grid-move { from { background-position: 0 0; } to { background-position: 0 40px; } }
                @keyframes neuralFloat { 
                    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
                    50% { opacity: 0.8; }
                    100% { transform: translateY(-20px) translateX(10px) scale(1.5); opacity: 0.1; }
                }
                @keyframes progress { 
                    0% { width: 0; opacity: 0.5; }
                    50% { width: 60px; opacity: 1; }
                    100% { width: 0; opacity: 0.5; }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes orbit {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
                .animate-fade-in { animation: fade-in-up 0.3s ease-out forwards; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
                .message-bubble { position: relative; }
                .message-bubble::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(34,211,238,0.3), transparent, rgba(168,85,247,0.3));
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                @media (hover: hover) {
                    .message-bubble:hover::before { opacity: 1; }
                }
                .input-glow:focus {
                    box-shadow: 0 0 0 1px rgba(34,211,238,0.3), 0 0 20px rgba(34,211,238,0.1);
                }
                /* Safe area for notched phones */
                .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
                .safe-left { padding-left: env(safe-area-inset-left, 0px); }
                .safe-right { padding-right: env(safe-area-inset-right, 0px); }
            `}</style>

            {/* ─── AI Chat Panel ─── */}
            <div
                className={`w-screen md:w-[500px] -mb-46 md:mb-6 pointer-events-auto transition-all duration-700 ${isOpen && !isMinimized
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-20 opacity-0 scale-95 pointer-events-none"
                    }`}
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
                <div className="bg-[#050508]  border-0 md:border md:border-white/[0.08] md:rounded-[2.5rem] shadow-[0_50px_150px_-20px_rgba(0,0,0,1),0_0_80px_-20px_rgba(34,211,238,0.08)] overflow-hidden flex flex-col h-[100dvh] md:h-[720px] relative safe-bottom safe-left safe-right">
                    {/* ─── Neural Grid Background ─── */}
                    <div
                        className="absolute inset-0 opacity-[0.04] md:opacity-[0.06] pointer-events-none"
                        style={{
                            backgroundImage: "linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.15) 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                            animation: "grid-move 4s linear infinite",
                        }}
                    />
                    {/* Floating Particles - fewer on mobile */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {particles.map((p) => (
                            <NeuralParticle key={p.id} {...p} />
                        ))}
                    </div>
                    {/* Ambient Glow */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-cyan-500/[0.02] md:bg-cyan-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-1/2 h-1/3 bg-purple-500/[0.02] md:bg-purple-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

                    {/* ─── Header ─── */}
                    <div className="relative z-10 bg-[#050508]/90 backdrop-blur-2xl border-b border-white/[0.06]">
                        <div className="px-3 md:px-5 py-3 md:py-5 md:pb-4 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 md:gap-4 min-w-0">
                                <div className="relative group flex-shrink-0">
                                    <div className="absolute -inset-1 md:-inset-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 rounded-xl md:rounded-2xl blur-lg opacity-50 md:opacity-60 group-hover:opacity-100 transition duration-1000" />
                                    <div className="relative w-10 h-10 md:w-[52px] md:h-[52px] rounded-xl md:rounded-2xl bg-black border border-white/20 flex items-center justify-center shadow-2xl overflow-hidden">
                                        <svg className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10A10 10 0 0 0 12 2z" />
                                            <path d="M12 6v6l4 2" />
                                            <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
                                        </svg>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-black rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-white font-black text-sm md:text-lg leading-tight tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-indigo-300 truncate">
                                        HA DEEP BRAIN
                                    </h3>
                                    <div className="flex items-center gap-1.5 md:gap-2 mt-0.5">
                                        <div className={`w-1.5 h-1.5 ${statusConfig[connectionStatus].color} rounded-full ${statusConfig[connectionStatus].glow}`} />
                                        <span className="text-[7px] md:text-[8px] text-gray-400 font-black uppercase tracking-[0.15em] md:tracking-[0.25em]">{statusConfig[connectionStatus].text}</span>
                                        <span className="text-[7px] text-gray-600 font-bold hidden sm:inline">•</span>
                                        <span className="text-[7px] md:text-[8px] text-gray-600 font-black uppercase tracking-widest hidden sm:inline">{NEURAL_VERSION}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Header Buttons */}
                            <div className="hidden md:flex gap-1.5">
                                <HeaderActionButton onClick={() => setSoundEnabled((p) => !p)} title={soundEnabled ? "Mute sounds" : "Enable sounds"}>
                                    {soundEnabled ? (
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8H4a1 1 0 00-1 1v4.4a1 1 0 001 1h2.5l4.1 3.7a.5.5 0 00.8-.4V5.5a.5.5 0 00-.8-.4L6.5 8.8z" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                                    )}
                                </HeaderActionButton>
                                <HeaderActionButton onClick={() => setShowSearch((p) => !p)} title="Search (Ctrl+K)">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </HeaderActionButton>
                                <HeaderActionButton onClick={exportChat} title="Export chat">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </HeaderActionButton>
                                <HeaderActionButton onClick={clearHistory} title="Format Memory" className="hover:bg-red-500/20">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </HeaderActionButton>
                                <HeaderActionButton onClick={() => setIsMinimized(true)} title="Minimize">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                </HeaderActionButton>
                                <HeaderActionButton onClick={() => setIsOpen(false)} title="Close">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </HeaderActionButton>
                            </div>

                            {/* Mobile Header Buttons - Compact */}
                            <div className="flex md:hidden gap-1 items-center">
                                <button
                                    onClick={() => setShowSearch((p) => !p)}
                                    className="p-2 bg-white/[0.04] rounded-lg border border-white/[0.06] active:scale-90 transition-all"
                                >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </button>

                                {/* More Menu */}
                                <div ref={headerMenuRef} className="relative">
                                    <button
                                        onClick={() => setShowHeaderMenu((p) => !p)}
                                        className="p-2 bg-white/[0.04] rounded-lg border border-white/[0.06] active:scale-90 transition-all"
                                    >
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                    </button>

                                    {/* Dropdown */}
                                    {showHeaderMenu && (
                                        <div className="absolute right-0 top-full mt-2 w-52 bg-[#0d0d15]/98 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                                            <button
                                                onClick={() => { setSoundEnabled((p) => !p); setShowHeaderMenu(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors text-left"
                                            >
                                                {soundEnabled ? (
                                                    <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8H4a1 1 0 00-1 1v4.4a1 1 0 001 1h2.5l4.1 3.7a.5.5 0 00.8-.4V5.5a.5.5 0 00-.8-.4L6.5 8.8z" /></svg>
                                                ) : (
                                                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                                                )}
                                                <span className="text-xs text-gray-300 font-semibold">{soundEnabled ? "Mute Sounds" : "Enable Sounds"}</span>
                                            </button>
                                            <button
                                                onClick={() => { exportChat(); setShowHeaderMenu(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors text-left"
                                            >
                                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                <span className="text-xs text-gray-300 font-semibold">Export Chat</span>
                                            </button>
                                            <button
                                                onClick={() => { clearHistory(); setShowHeaderMenu(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-left"
                                            >
                                                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                <span className="text-xs text-red-400 font-semibold">Clear History</span>
                                            </button>
                                            <div className="border-t border-white/[0.06]"></div>
                                            <button
                                                onClick={() => { setIsMinimized(true); setShowHeaderMenu(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors text-left"
                                            >
                                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                                <span className="text-xs text-gray-300 font-semibold">Minimize</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 bg-white/[0.04] rounded-lg border border-white/[0.06] active:scale-90 transition-all"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        {showSearch && (
                            <div className="px-3 md:px-5 pb-3 md:pb-4 animate-fade-in-up">
                                <div className="relative">
                                    <svg className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search messages..."
                                        className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-10 md:pl-11 pr-4 py-2.5 text-sm text-white focus:border-cyan-500/50 outline-none transition-all placeholder-gray-600 input-glow"
                                        autoFocus
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                </div>
                                {searchQuery && (
                                    <p className="text-[8px] md:text-[9px] text-gray-500 font-bold mt-1.5 px-1">
                                        Found {filteredMessages.length} of {messages.length} messages
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ─── Messages Area ─── */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto px-3 md:px-5 py-3 md:py-5 space-y-3 md:space-y-5 custom-scrollbar bg-transparent relative z-10"
                    >
                        {/* Contact Section */}
                        <div className="animate-fade-in-up">
                            <div className="bg-gradient-to-br from-green-600/[0.08] to-emerald-600/[0.04] rounded-2xl md:rounded-[2rem] border border-green-500/[0.12] p-3 md:p-5 relative overflow-hidden group/contact">
                                <div className="absolute top-0 left-0 w-0.5 md:w-1 h-full bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></div>
                                <div className="flex items-center gap-2.5 md:gap-4 mb-3 md:mb-4">
                                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-lg md:text-xl shadow-xl border border-green-400/30 flex-shrink-0">👨‍💼</div>
                                    <div className="min-w-0">
                                        <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-tight truncate">Direct Support — Asad</h4>
                                        <p className="text-[7px] md:text-[8px] text-green-400 font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] flex items-center gap-1 md:gap-1.5">
                                            <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-400 rounded-full animate-pulse" />
                                            Available Now
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 md:gap-2.5 mb-3 md:mb-4">
                                    <div className="bg-white/[0.04] border border-white/[0.05] rounded-lg md:rounded-xl p-2 md:p-2.5 flex flex-col items-center gap-0.5 hover:bg-white/[0.06] transition-colors">
                                        <span className="text-[9px] md:text-[10px] font-black text-purple-400 uppercase">JazzCash</span>
                                        <span className="text-[6px] md:text-[7px] text-gray-600 font-bold uppercase tracking-widest">Secure Pay</span>
                                    </div>
                                    <div className="bg-white/[0.04] border border-white/[0.05] rounded-lg md:rounded-xl p-2 md:p-2.5 flex flex-col items-center gap-0.5 hover:bg-white/[0.06] transition-colors">
                                        <span className="text-[9px] md:text-[10px] font-black text-green-400 uppercase">EasyPaisa</span>
                                        <span className="text-[6px] md:text-[7px] text-gray-600 font-bold uppercase tracking-widest">Instant Pay</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_WELCOME)}`, "_blank")}
                                    className="w-full bg-gradient-to-br from-green-500 to-emerald-700 text-white font-black text-[10px] md:text-[11px] py-3 md:py-3.5 rounded-xl md:rounded-2xl shadow-xl hover:shadow-green-500/25 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 md:gap-2.5 border border-green-400/20"
                                >
                                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.446 4.432-9.877 9.888-9.877 2.642 0 5.126 1.029 6.99 2.896a9.832 9.832 0 012.884 7.001c-.002 5.45-4.433 9.88-9.886 9.88M12 2a10.884 10.884 0 00-7.726 3.195C2.41 7.061 1.096 9.544 1.096 12.19c0 2.083.541 4.117 1.571 5.91L1 23l5.034-1.319a10.84 10.84 0 00 5.965 1.761h.004c11.967 0 21.685-9.718 21.685-21.685 0-5.712-2.228-11.082-6.273-15.127A21.536 21.536 0 0012 2.001z" />
                                    </svg>
                                    <span className="uppercase tracking-[0.15em] md:tracking-[0.2em]">WhatsApp Admin</span>
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        {filteredMessages.map((msg, idx) => (
                            <div
                                key={msg.id || idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up group/msg`}
                            >
                                <div
                                    className={`message-bubble relative max-w-[92%] md:max-w-[88%] p-3 md:p-4 rounded-2xl md:rounded-[1.8rem] shadow-2xl transition-all duration-300 ${msg.role === "user"
                                        ? "bg-gradient-to-br from-cyan-600 to-indigo-700 text-white rounded-tr-sm md:rounded-tr-none border border-white/10"
                                        : `bg-white/[0.04] border border-white/[0.08] text-cyan-50 rounded-tl-sm md:rounded-tl-none backdrop-blur-xl ${msg.isError ? "border-red-500/20 bg-red-500/[0.04]" : ""}`
                                        }`}
                                >
                                    {renderMessage(msg)}

                                    {/* Message Actions (hover on desktop, long-press area on mobile) */}
                                    <div className="absolute -bottom-2 right-2 opacity-0 group-hover/msg:opacity-100 transition-all duration-200 hidden md:flex gap-1 translate-y-1 group-hover/msg:translate-y-0">
                                        <button
                                            onClick={() => copyMessage(msg.content)}
                                            className="p-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors"
                                            title="Copy"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        </button>
                                        {msg.role === "assistant" && (
                                            <>
                                                <button
                                                    onClick={() => toggleReaction(msg.id, "👍")}
                                                    className={`p-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 transition-colors ${(msg.reactions || []).some((r) => r.emoji === "👍") ? "text-cyan-400 border-cyan-500/30" : "text-gray-400 hover:text-white"}`}
                                                >
                                                    <span className="text-[10px]">👍</span>
                                                </button>
                                                <button
                                                    onClick={() => toggleReaction(msg.id, "👎")}
                                                    className={`p-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 transition-colors ${(msg.reactions || []).some((r) => r.emoji === "👎") ? "text-red-400 border-red-500/30" : "text-gray-400 hover:text-white"}`}
                                                >
                                                    <span className="text-[10px]">👎</span>
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Mobile: Always-visible copy + reactions for assistant */}
                                    <div className="flex md:hidden items-center gap-1.5 mt-2 pt-1.5 border-t border-white/5">
                                        <button
                                            onClick={() => copyMessage(msg.content)}
                                            className="p-1 bg-white/5 rounded-md text-gray-500 active:text-white active:bg-white/10 transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        </button>
                                        {msg.role === "assistant" && (
                                            <>
                                                <button
                                                    onClick={() => toggleReaction(msg.id, "👍")}
                                                    className={`p-1 bg-white/5 rounded-md transition-colors ${(msg.reactions || []).some((r) => r.emoji === "👍") ? "text-cyan-400 bg-cyan-500/10" : "text-gray-500 active:text-white"}`}
                                                >
                                                    <span className="text-[10px]">👍</span>
                                                </button>
                                                <button
                                                    onClick={() => toggleReaction(msg.id, "👎")}
                                                    className={`p-1 bg-white/5 rounded-md transition-colors ${(msg.reactions || []).some((r) => r.emoji === "👎") ? "text-red-400 bg-red-500/10" : "text-gray-500 active:text-white"}`}
                                                >
                                                    <span className="text-[10px]">👎</span>
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Reactions Display */}
                                    {(msg.reactions || []).length > 0 && (
                                        <div className="flex gap-1 mt-1.5 md:mt-2">
                                            {msg.reactions.map((r, ri) => (
                                                <span key={ri} className="bg-white/10 text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full">{r.emoji}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Streaming Message */}
                        {streamingMessage && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="bg-white/[0.04] border border-white/[0.08] p-3 md:p-4 rounded-2xl md:rounded-[1.8rem] rounded-tl-sm md:rounded-tl-none text-cyan-50 shadow-2xl backdrop-blur-xl max-w-[92%] md:max-w-[88%]">
                                    <div
                                        className="text-[13px] md:text-[15px] leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: formatMarkdown(streamingMessage) }}
                                    />
                                    <span className="inline-block w-1.5 md:w-2 h-3 md:h-4 bg-cyan-400 animate-pulse ml-1 align-middle rounded-sm"></span>
                                </div>
                            </div>
                        )}

                        {/* Loading */}
                        {isLoading && !streamingMessage && <TypingIndicator />}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* ─── Quick Suggestions ─── */}
                    <div className="px-3 md:px-5 py-2 md:py-2.5 bg-[#050508]/80 backdrop-blur-md flex gap-1.5 md:gap-2 overflow-x-auto no-scrollbar pointer-events-auto relative z-10 border-t border-white/[0.04]">
                        {currentSuggestions.map((text) => (
                            <button
                                key={text}
                                onClick={() => {
                                    setInput(text);
                                    setTimeout(() => handleSendMessage(), 50);
                                }}
                                className="whitespace-nowrap px-2.5 md:px-3.5 py-1 md:py-1.5 bg-white/[0.04] hover:bg-cyan-500/[0.12] border border-white/[0.08] hover:border-cyan-500/20 rounded-full text-[8px] md:text-[9px] font-black text-gray-400 hover:text-cyan-400 uppercase tracking-[0.1em] md:tracking-[0.15em] transition-all active:scale-95 flex-shrink-0"
                            >
                                {text}
                            </button>
                        ))}
                    </div>

                    {/* ─── Input Area ─── */}
                    <form
                        onSubmit={handleSendMessage}
                        className="px-3 md:px-5 py-3 md:py-4 bg-[#08080c]/90 backdrop-blur-2xl border-t border-white/[0.06] flex gap-2 md:gap-2.5 pointer-events-auto relative z-10 safe-bottom"
                    >
                        {/* Voice Input */}
                        <button
                            type="button"
                            onClick={toggleVoice}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all active:scale-90 border flex-shrink-0 ${isListening
                                ? "bg-red-500/20 border-red-500/30 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                                : "bg-white/[0.04] border-white/[0.06] text-gray-500 hover:text-cyan-400 hover:border-cyan-500/20"
                                }`}
                            title={isListening ? "Stop listening" : "Voice input"}
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>

                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Deep Brain anything..."
                            className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.06] rounded-xl md:rounded-2xl px-3.5 md:px-5 py-2.5 md:py-3.5 text-[13px] md:text-sm text-white focus:border-cyan-500/40 outline-none transition-all placeholder-gray-600 input-glow"
                            disabled={isLoading}
                        />

                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white hover:scale-105 transition-all shadow-[0_0_25px_rgba(124,58,237,0.25)] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 group/btn flex-shrink-0"
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5 transform rotate-90 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="px-3 md:px-5 pb-2 md:pb-3 pt-0 flex items-center justify-between relative z-10">
                        <span className="text-[6px] md:text-[7px] text-gray-700 font-bold uppercase tracking-widest">Deep Brain {NEURAL_VERSION}</span>
                        <span className="text-[6px] md:text-[7px] text-gray-700 font-bold uppercase tracking-widest">{messages.length} msgs</span>
                    </div>
                </div>
            </div>

            {/* ─── Minimized Bar ─── */}
            <div
                className={`w-[calc(100vw-2rem)] md:w-[500px] mb-4 md:mb-6 mx-4 md:mx-0 pointer-events-auto transition-all duration-500 ${isOpen && isMinimized
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-10 opacity-0 scale-95 pointer-events-none"
                    }`}
            >
                <button
                    onClick={() => setIsMinimized(false)}
                    className="w-full bg-[#050508]/95 backdrop-blur-2xl border border-white/[0.08] rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-3.5 flex items-center justify-between shadow-2xl hover:border-cyan-500/20 transition-all"
                >
                    <div className="flex items-center gap-2.5 md:gap-3">
                        <div className="w-2 h-2 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] md:text-[11px] text-white font-black uppercase tracking-wider">Deep Brain Active</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        {streamingMessage && <span className="text-[8px] md:text-[9px] text-cyan-400 font-bold animate-pulse">Typing...</span>}
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </div>
                </button>
            </div>

            {/* ─── Ultra Toggle Button ─── */}
            <button
                onClick={() => {
                    setIsOpen((prev) => !prev);
                    setIsMinimized(false);
                }}
                className={`pointer-events-auto group relative flex items-center justify-center transition-all duration-700 transform hover:scale-110 active:scale-90 mr-4 md:mr-0 ${isOpen ? "rotate-0" : ""}`}
                aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
            >
                {/* Pulse Rings */}
                {!isOpen && (
                    <>
                        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[pulse-ring_3s_ease-out_infinite]" />
                        <div className="absolute inset-0 rounded-full border border-purple-500/15 animate-[pulse-ring_3s_ease-out_1s_infinite]" />
                    </>
                )}

                {/* Orbital Rings - hidden on very small screens */}
                <div className={`hidden sm:block absolute w-28 h-28 rounded-full border border-cyan-500/20 transition-all duration-1000 ${isOpen ? "scale-0 opacity-0" : "animate-[orbit_8s_linear_infinite]"}`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                </div>
                <div className={`hidden sm:block absolute w-24 h-24 rounded-full border border-purple-500/15 transition-all duration-1000 ${isOpen ? "scale-0 opacity-0" : "animate-[orbit_6s_linear_infinite_reverse]"}`}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                </div>

                {/* Main Sphere */}
                <div
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full transition-all duration-500 flex items-center justify-center overflow-hidden ${isOpen
                        ? "bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12]"
                        : "bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2a] to-[#050510] border-2 border-white/[0.08] group-hover:border-cyan-400/30 shadow-[0_0_60px_rgba(34,211,238,0.15)]"
                    }`}
                >
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.06),_transparent_60%)]" />

                    {/* Animated Gradient Border */}
                    {!isOpen && (
                        <div
                            className="absolute inset-0 rounded-full opacity-60"
                            style={{
                                background: "conic-gradient(from 0deg, transparent, rgba(34,211,238,0.3), transparent, rgba(168,85,247,0.3), transparent)",
                                animation: "orbit 4s linear infinite",
                            }}
                        />
                    )}

                    {isOpen ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white/80 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    ) : (
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="relative">
                                <span className="text-xl sm:text-2xl md:text-3xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">🧠</span>
                                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-ping" />
                                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee]" />
                            </div>
                            <span className="text-[5px] sm:text-[6px] md:text-[7px] font-black tracking-[0.15em] md:tracking-[0.2em] text-cyan-400/80 uppercase leading-none mt-0.5">Deep Brain</span>
                        </div>
                    )}
                </div>

                {/* Unread Badge */}
                {unreadCount > 0 && !isOpen && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] md:min-w-[20px] md:h-[20px] bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-[8px] md:text-[9px] font-black text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] border-2 border-[#050508] animate-bounce">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                )}

                {/* Outer Glow */}
                {!isOpen && (
                    <div className="absolute inset-0 rounded-full bg-cyan-500/[0.06] animate-pulse -z-10 blur-2xl scale-150" />
                )}
            </button>
        </div>
    );
}