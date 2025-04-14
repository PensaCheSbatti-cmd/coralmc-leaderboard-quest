
import { MessageSquare } from "lucide-react";
import OnlineCounter from "./OnlineCounter";

interface HeaderProps {
  status: string;
  lastUpdated: string;
}

const Header = ({ status, lastUpdated }: HeaderProps) => {
  return (
    <div className="bg-[#0a2956]/90 backdrop-blur-sm border border-[#3498db]/30 rounded-lg p-6 mb-8 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl text-white font-bold mb-4 md:mb-0 flex flex-col sm:flex-row items-center gap-2">
          <span className="text-[#3498db]">CoralMC</span>
          <span>Top Winstreak</span>
        </h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <OnlineCounter />
          
          <a 
            href="https://discord.gg/mA9r6DbW4A" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-md transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            Join Discord
          </a>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          <span className="text-[#3498db] font-medium">Status:</span>
          <span className={`font-bold ${status === 'Online' ? 'text-green-400' : 'text-red-400'}`}>
            {status}
          </span>
          <span className="text-gray-400 text-sm">• {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
