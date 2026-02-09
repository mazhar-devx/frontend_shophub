import React, { useState } from 'react';
import { useUIStore } from '../zustand/uiStore';

const WhatsAppContact = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { showToast } = useUIStore();

    const phoneNumber = "03291559040";
    const welcomeMessage = "Assalamualaikum\nWelcome to HA Store\nHave a nice day\nTell us how can we help you ?";
    
    const handleWhatsAppClick = () => {
        const encodedMessage = encodeURIComponent(welcomeMessage);
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/^0/, '92')}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end group/wa">
            {/* Modal Overlay */}
            <div className={`mb-4 w-[280px] sm:w-[350px] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}`}>
                <div className="glass rounded-[2.5rem] border border-white/20 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative backdrop-blur-3xl">
                    {/* Background Glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-white/20">
                                    <span className="text-2xl">👨‍💼</span>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-emerald-900 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm uppercase tracking-tight">Asad Admin</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                    <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest">Always Online</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative overflow-hidden group/text">
                            <div className="absolute top-0 left-0 w-1 h-full bg-green-500/50"></div>
                            <p className="text-gray-300 text-sm leading-relaxed italic">
                                "Assalamualaikum! I'm the creator of this store. Message me for direct payments or custom deals! 🔥"
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Fast Payments</h4>
                                <span className="h-[1px] flex-1 bg-white/5 mx-3"></span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-1 hover:border-purple-500/30 transition-all cursor-default group/item">
                                    <span className="text-[10px] font-black text-purple-400 uppercase">JazzCash</span>
                                    <span className="text-[8px] text-gray-500">Instant Pay</span>
                                </div>
                                <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-1 hover:border-green-500/30 transition-all cursor-default group/item">
                                    <span className="text-[10px] font-black text-green-400 uppercase">EasyPaisa</span>
                                    <span className="text-[8px] text-gray-500">Safe & Fast</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleWhatsAppClick}
                            className="w-full bg-gradient-to-br from-green-500 to-emerald-700 text-white font-black text-sm py-4 rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:shadow-[0_15px_40px_rgba(34,197,94,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.446 4.432-9.877 9.888-9.877 2.642 0 5.126 1.029 6.99 2.896a9.832 9.832 0 012.884 7.001c-.002 5.45-4.433 9.88-9.886 9.88M12 2a10.884 10.884 0 00-7.726 3.195C2.41 7.061 1.096 9.544 1.096 12.19c0 2.083.541 4.117 1.571 5.91L1 23l5.034-1.319a10.84 10.84 0 00 5.965 1.761h.004c11.967 0 21.685-9.718 21.685-21.685 0-5.712-2.228-11.082-6.273-15.127A21.536 21.536 0 0012 2.001z"/>
                        </svg>
                        <span className="uppercase tracking-widest">Connect with Asad</span>
                    </button>
                    </div>
                </div>
            </div>

            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 transform hover:scale-110 active:scale-95 shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden ${isOpen ? 'bg-red-500/20 backdrop-blur-md border border-white/20 rotate-[135deg]' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}
            >
                {/* Background Pulse */}
                {!isOpen && <div className="absolute inset-0 bg-green-400 animate-ping opacity-20"></div>}
                
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Icon */}
                {isOpen ? (
                    <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                ) : (
                    <div className="flex flex-col items-center justify-center text-white relative z-10">
                        <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.446 4.432-9.877 9.888-9.877 2.642 0 5.126 1.029 6.99 2.896a9.832 9.832 0 012.884 7.001c-.002 5.45-4.433 9.88-9.886 9.88M12 2a10.884 10.884 0 00-7.726 3.195C2.41 7.061 1.096 9.544 1.096 12.19c0 2.083.541 4.117 1.571 5.91L1 23l5.034-1.319a10.84 10.84 0 00 5.965 1.761h.004c11.967 0 21.685-9.718 21.685-21.685 0-5.712-2.228-11.082-6.273-15.127A21.536 21.536 0 0012 2.001z"/>
                        </svg>
                    </div>
                )}
            </button>
        </div>
    );
};

export default WhatsAppContact;
