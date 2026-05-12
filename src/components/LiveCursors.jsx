import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImageUrl, DEFAULT_AVATAR } from '../utils/constants';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LiveCursors = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [remoteCursors, setRemoteCursors] = useState({});

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    newSocket.on('cursor-move', (data) => {
      setRemoteCursors((prev) => ({
        ...prev,
        [data.id]: {
          x: data.x,
          y: data.y,
          name: data.name,
          photo: data.photo
        }
      }));
    });

    newSocket.on('user-offline', (id) => {
      setRemoteCursors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleMouseMove = (e) => {
      // Calculate relative position (percentage) to handle different screen sizes
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      socket.emit('cursor-move', {
        x,
        y,
        name: isAuthenticated && user ? user.name : 'Guest',
        photo: isAuthenticated && user ? user.photo : null
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [socket, user, isAuthenticated]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden hidden lg:block">
      <AnimatePresence>
        {Object.entries(remoteCursors).map(([id, data]) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              left: `${data.x}%`,
              top: `${data.y}%`
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 250, mass: 0.5 }}
            className="absolute flex items-center gap-2 whitespace-nowrap"
            style={{ translateX: '-50%', translateY: '-50%' }}
          >
            {/* Pointer SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-pink-500 drop-shadow-lg"
            >
              <path
                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                fill="currentColor"
                stroke="white"
                strokeWidth="1"
              />
            </svg>

            {/* Label */}
            <div className="flex items-center gap-2 px-2 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full border border-pink-500/20 shadow-xl">
              <div className="w-5 h-5 rounded-full overflow-hidden border border-pink-500/50 flex-shrink-0">
                <img 
                  src={data.photo ? getProductImageUrl(data.photo) : DEFAULT_AVATAR} 
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <span className="text-[10px] font-black text-primary dark:text-white uppercase tracking-tighter">
                {data.name}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LiveCursors;
