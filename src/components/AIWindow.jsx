import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Move, Maximize2 } from 'lucide-react';
import api from '../services/api';

export default function AIWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am the ShopHub AI Assistant. Ask me anything about the store, products, or services!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 380, height: 480 });
  
  const windowRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Position window in the center initially on open
  useEffect(() => {
    if (isOpen) {
      const x = Math.max(20, window.innerWidth - size.width - 40);
      const y = Math.max(20, window.innerHeight - size.height - 120);
      setPos({ x, y });
    }
  }, [isOpen, size.width, size.height]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-shophub-ai-window', handleOpen);
    return () => window.removeEventListener('open-shophub-ai-window', handleOpen);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  // Dragging logic
  const handleHeaderMouseDown = (e) => {
    if (e.target.closest('button')) return; // Don't drag if clicking buttons
    e.preventDefault();
    
    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;
    
    const handleMouseMove = (moveEvent) => {
      const nextX = Math.max(0, Math.min(window.innerWidth - size.width, moveEvent.clientX - startX));
      const nextY = Math.max(0, Math.min(window.innerHeight - size.height, moveEvent.clientY - startY));
      setPos({ x: nextX, y: nextY });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Resizing logic
  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startWidth = size.width;
    const startHeight = size.height;
    const startX = e.clientX;
    const startY = e.clientY;
    
    const handleMouseMove = (moveEvent) => {
      const nextWidth = Math.max(320, Math.min(800, startWidth + (moveEvent.clientX - startX)));
      const nextHeight = Math.max(380, Math.min(700, startHeight + (moveEvent.clientY - startY)));
      setSize({ width: nextWidth, height: nextHeight });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const messageText = input.trim();
    if (!messageText || loading) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setLoading(true);
    
    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const { data } = await api.post('/ai/deep-brain', {
        message: messageText,
        history
      });
      
      if (data.status === 'success' && data.data?.reply) {
        const reply = data.data.reply;
        let current = '';
        const chars = reply.split('');
        for (let i = 0; i < chars.length; i++) {
          current += chars[i];
          setStreamingText(current);
          await new Promise(r => setTimeout(r, 12));
        }
        
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        setStreamingText('');
      } else {
        throw new Error('Invalid server reply');
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Sorry, I encountered a connection issue. Please make sure the backend is running.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={windowRef}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        zIndex: 99999
      }}
      className="flex flex-col bg-white/95 dark:bg-[#07070a]/95 backdrop-blur-2xl rounded-3xl border border-pink-500/20 shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden animate-fadeIn select-none font-sans"
    >
      {/* Header (Handles Dragging) */}
      <div
        onMouseDown={handleHeaderMouseDown}
        className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-black/40 border-b border-gray-150 dark:border-white/5 cursor-grab active:cursor-grabbing shrink-0"
      >
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="HA Store Logo" className="w-6 h-6 object-contain rounded" />
          <span className="text-xs font-black text-primary dark:text-white uppercase tracking-wider">
            Ask ShopHub AI
          </span>
          <Move className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none font-sans'
                  : 'bg-gray-150 dark:bg-white/5 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/5 rounded-tl-none font-sans'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Streaming text container */}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm bg-gray-150 dark:bg-white/5 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/5 rounded-tl-none animate-pulse font-sans">
              {streamingText}
            </div>
          </div>
        )}

        {/* Thinking indicator */}
        {loading && !streamingText && (
          <div className="flex justify-start items-center gap-1.5 p-2 text-[10px] font-bold text-pink-500 uppercase tracking-widest animate-pulse font-sans">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            AI is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-gray-50 dark:bg-black/30 border-t border-gray-150 dark:border-white/5 flex gap-2 shrink-0 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI anything..."
          className="flex-grow bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-primary dark:text-white focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-400/50 font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-md transform hover:scale-105 active:scale-95 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Resize Handle at Bottom Right */}
      <div
        onMouseDown={handleResizeMouseDown}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5"
      >
        <Maximize2 className="w-2.5 h-2.5 text-gray-400 rotate-90" />
      </div>
    </div>
  );
}
