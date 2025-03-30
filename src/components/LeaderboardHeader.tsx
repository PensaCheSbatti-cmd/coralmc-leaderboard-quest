
import { MessageSquare } from "lucide-react";
import OnlineCounter from "./OnlineCounter";

interface LeaderboardHeaderProps {
  status: string;
  lastUpdated: string;
}

const LeaderboardHeader = ({ status, lastUpdated }: LeaderboardHeaderProps) => {
  return (
    <header className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#2d1b47] to-[#1e1433] p-6 border border-[#634caf]/30 shadow-[0_0_15px_rgba(99,76,175,0.2)] mb-6">
      <div className="absolute top-3 right-3">
        <OnlineCounter />
      </div>
      
      <h1 className="text-2xl md:text-4xl font-bold text-white text-center mb-4">
        <span className="text-[#ffcd4a] font-minecraft">CoralMC</span> 
        <span className="text-white"> Bedwars Winstreak</span>
      </h1>
      
      <a 
        href="https://discord.gg/mA9r6DbW4A" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 mx-auto mb-4 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-md transition-all hover:shadow-lg max-w-xs"
      >
        <MessageSquare className="h-5 w-5" />
        Join our Discord server
      </a>
      
      <div className="status-info flex justify-between text-sm mt-4 bg-[#1a1625]/70 p-2 rounded-md border border-[#634caf]/20">
        <span className="text-green-400">Status: {status}</span>
        <span className="text-gray-300">Updated: {lastUpdated}</span>
      </div>
    </header>
  );
};

export default LeaderboardHeader;
