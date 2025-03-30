
import { useState, useEffect } from 'react';

const OnlineCounter = () => {
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  
  useEffect(() => {
    // Simulate initial count with a random number between 5-30
    const initialCount = Math.floor(Math.random() * 25) + 5;
    setOnlineUsers(initialCount);
    
    // Simulate random fluctuations in user count
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        // Random change between -2 and +3
        const change = Math.floor(Math.random() * 6) - 2;
        // Ensure count doesn't go below 3
        return Math.max(3, prev + change);
      });
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="online-counter text-sm font-medium bg-[#1a1625]/70 backdrop-blur-sm px-3 py-1 rounded-md border border-[#634caf]/20 flex items-center gap-2">
      <span className="animate-pulse inline-block w-2 h-2 bg-green-500 rounded-full"></span>
      <span className="text-green-400">{onlineUsers} online</span>
    </div>
  );
};

export default OnlineCounter;
