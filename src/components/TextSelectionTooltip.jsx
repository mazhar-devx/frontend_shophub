import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function TextSelectionTooltip() {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        
        if (text.length > 2) {
          try {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // Limit text length to prevent explaining massive paragraphs
            setSelectedText(text.substring(0, 500));
            
            setPos({
              x: rect.left + rect.width / 2,
              y: rect.top - 45
            });
            setShow(true);
          } catch (e) {
            setShow(false);
          }
        } else {
          setShow(false);
        }
      }, 10);
    };

    const handleMouseDown = (e) => {
      // If clicking inside the tooltip, don't close it instantly
      if (e.target.closest('#ask-shophub-selection-pill')) return;
      setShow(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Dispatch event to CustomCursor to perform explanation
    window.dispatchEvent(new CustomEvent('ask-shophub-explain', {
      detail: { text: selectedText }
    }));
    
    // Clear selection
    window.getSelection().removeAllRanges();
    setShow(false);
  };

  if (!show) return null;

  return (
    <button
      id="ask-shophub-selection-pill"
      onClick={handleClick}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        transform: 'translateX(-50%)',
        zIndex: 999999
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-black rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 border border-white/20 select-none animate-fadeIn font-sans"
    >
      <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
      Ask ShopHub AI
    </button>
  );
}
