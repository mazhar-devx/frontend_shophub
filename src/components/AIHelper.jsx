import { useState, useRef, useEffect } from "react";
import api from "../services/api";

export default function AIHelper() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("ai_chat_history");
        return saved ? JSON.parse(saved) : [
            { role: "assistant", content: "Assalamualaikum! I'm your HA Store Deep Brain AI. I can speak Urdu & English! How can I help you today? 🚀🤖" }
        ];
    });
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        localStorage.setItem("ai_chat_history", JSON.stringify(messages));
    }, [messages]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const systemPrompt = `You are an ultra-professional, "Deep Brain" AI assistant for 'HA Store', a premium e-commerce platform in Pakistan. 
            CRITICAL RULES:
            1. SCOPE: You ONLY discuss 'HA Store', its products, services, and policies. If a user asks about anything unrelated (e.g., cooking, sport, general knowledge, other websites), politely state: "I am specialized in HA Store assistance only. Please ask me about our products or services! 😊"
            2. BILINGUAL: You support both English and Urdu. If the user talks in Urdu, reply in Urdu. If in English, reply in English. Use Roman Urdu if preferred by the user.
            3. OWNERSHIP: If asked who created this website or who is the owner, answer: "This website was created and is owned by 'mazhar.devx'. He is a master developer! 💻🔥"
            4. PERSONALITY: Be friendly, use emojis frequently, and maintain an ultra-premium tone.
            5. LOGISTICS: We offer individual shipping/tax per product. For direct payments (EasyPaisa/JazzCash), tell them to use the WhatsApp button to contact Asad.`;

            const historyMessages = messages.map(m => ({ 
                role: m.role, 
                content: m.content 
            })).slice(-10);

            const allMessages = [
                { role: "system", content: systemPrompt },
                ...historyMessages,
                userMessage
            ];

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: allMessages,
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Groq API error");
            }

            const aiReply = data.choices[0].message.content;
            setMessages(prev => [...prev, { role: "assistant", content: aiReply }]);
        } catch (err) {
            console.error("AI Error:", err);
            setMessages(prev => [...prev, { role: "assistant", content: "I'm currently taking a quick brain rest. Contact Asad via WhatsApp! 🙏" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = () => {
        if(window.confirm("Clear all brain history? 🧠🗑️")) {
            const initialMessage = [{ role: "assistant", content: "History cleared! I'm ready to start fresh. How can I help? 😊" }];
            setMessages(initialMessage);
            localStorage.setItem("ai_chat_history", JSON.stringify(initialMessage));
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.1;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center w-auto pointer-events-none">
            {/* AI Chat Panel */}
            <div className={`w-[90vw] sm:w-full max-w-[450px] mb-6 pointer-events-auto transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none'}`}>
                <div className="glass border border-white/20 rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] backdrop-blur-3xl overflow-hidden flex flex-col max-h-[70vh] sm:max-h-[650px]">
                    {/* Header */}
                    <div className="p-5 sm:p-7 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-cyan-900/40 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-3xl sm:text-4xl border border-white/10 shadow-2xl relative">
                                🧠
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-indigo-900 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg sm:text-xl leading-tight tracking-tighter uppercase italic">HA DEEP BRAIN</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] sm:text-[9px] text-cyan-400 font-bold uppercase tracking-[0.2em] animate-pulse">Neural Link Active</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={clearHistory}
                                type="button"
                                className="p-2 sm:p-3 bg-white/5 hover:bg-red-500/20 rounded-2xl border border-white/10 transition-all active:scale-90"
                                title="Clear Memory"
                            >
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                type="button"
                                className="p-2 sm:p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-90 sm:hidden"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 min-h-[300px] custom-scrollbar bg-black/40 backdrop-blur-2xl">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                                <div className={`relative group/msg max-w-[90%] sm:max-w-[85%] p-4 sm:p-5 rounded-[2rem] text-sm sm:text-[15px] leading-relaxed ${msg.role === 'user' ? 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white rounded-tr-none shadow-xl border border-white/10' : 'bg-white/5 border border-white/10 text-gray-100 rounded-tl-none backdrop-blur-md'}`}>
                                    {msg.content}
                                    
                                    {msg.role === 'assistant' && (
                                        <button 
                                            onClick={() => speak(msg.content)}
                                            type="button"
                                            className="absolute -right-10 top-0 p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 opacity-0 group-hover/msg:opacity-100 transition-all duration-300 hidden sm:block"
                                            title="Listen"
                                        >
                                            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-pulse">
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-2">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-5 sm:p-6 bg-black/60 border-t border-white/10 flex gap-2 pointer-events-auto">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type neural command..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition-all placeholder-gray-600 focus:bg-white/10"
                        />
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white hover:scale-105 transition-all shadow-lg active:scale-95 disabled:opacity-50 group"
                        >
                            <svg className="w-5 h-5 transform rotate-90 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className="px-6 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[8px] sm:text-[9px] font-bold text-gray-500 tracking-[0.2em] uppercase">
                        <span>Binary Logic Active</span>
                        <span className="text-cyan-500/50">Groq Enhanced v4.0</span>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto group relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 transform hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(124,58,237,0.4)] ${isOpen ? 'rotate-90 bg-white/10' : 'bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500'}`}
            >
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[4px] rounded-full"></div>
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
                
                {isOpen ? (
                    <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative">
                            <span className="text-2xl animate-bounce inline-block">🧠</span>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                        <span className="text-[7px] font-black tracking-widest text-white/90 uppercase -mt-0.5">Neural AI</span>
                    </div>
                )}
            </button>
        </div>
    );
}
