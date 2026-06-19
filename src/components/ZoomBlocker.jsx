import React, { useEffect, useState } from 'react';

const ZoomBlocker = () => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleTouchMove = (e) => {
      // Check if there are two or more fingers on the screen (pinch zoom)
      if (e.touches && e.touches.length > 1) {
        e.preventDefault(); // Prevent native zoom
        
        if (!showAlert) {
          setShowAlert(true);
          // Hide alert after 10 seconds
          setTimeout(() => {
            setShowAlert(false);
          }, 10000);
        }
      }
    };

    // Passive must be false so preventDefault() works
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Handle ctrl+wheel for desktop zoom
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (!showAlert) {
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 10000);
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });

    // Handle plus/minus keyboard zoom
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '-' || e.key === '+')) {
        e.preventDefault();
        if (!showAlert) {
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 10000);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAlert]);

  if (!showAlert) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '20px 30px',
      borderRadius: '12px',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      border: '1px solid #ff4444',
      textAlign: 'center',
      minWidth: '280px',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ color: '#ff4444', fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold' }}>Zoom Disabled</h3>
      <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#ccc' }}>
        You cannot zoom this website. It is designed to be viewed at 100% scale.
      </p>
      <button 
        onClick={() => setShowAlert(false)}
        style={{
          background: '#ff4444',
          color: 'white',
          border: 'none',
          padding: '8px 20px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px'
        }}
      >
        Dismiss
      </button>
    </div>
  );
};

export default ZoomBlocker;
