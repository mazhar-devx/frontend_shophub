import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [countdown, setCountdown] = useState({
    hours: 12,
    minutes: 30,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center text-red-200 text-sm">
        <span className="mr-2">Ends in:</span>
        <span className="bg-black/50 px-2 py-1 rounded text-red-400 font-mono border border-red-500/30">{String(countdown.hours).padStart(2, '0')}</span>
        <span className="mx-1">:</span>
        <span className="bg-black/50 px-2 py-1 rounded text-red-400 font-mono border border-red-500/30">{String(countdown.minutes).padStart(2, '0')}</span>
        <span className="mx-1">:</span>
        <span className="bg-black/50 px-2 py-1 rounded text-red-400 font-mono border border-red-500/30">{String(countdown.seconds).padStart(2, '0')}</span>
    </div>
  );
}
