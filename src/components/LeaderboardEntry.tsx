
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Crown, Trophy, Star } from "lucide-react";

interface LeaderboardEntryProps {
  player: Player;
  currentLeaderboard: 'current' | 'highest';
  onClick: () => void;
  uuid: string | null;
}

const LeaderboardEntry = ({ player, currentLeaderboard, onClick, uuid }: LeaderboardEntryProps) => {
  const wsValue = currentLeaderboard === 'current' ? player.winstreak : player.highest_winstreak;
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Function to determine badge based on rank
  const getBadge = () => {
    if (player.globalRank === 1) {
      return <Crown className="w-5 h-5 text-yellow-400" />;
    } else if (player.globalRank === 2) {
      return <Trophy className="w-5 h-5 text-gray-300" />;
    } else if (player.globalRank === 3) {
      return <Trophy className="w-5 h-5 text-amber-700" />;
    } else if (player.globalRank <= 10) {
      return <Star className="w-4 h-4 text-blue-400" />;
    }
    return null;
  };
  
  return (
    <div 
      className="bg-[#0a2956]/90 hover:bg-[#1e3356] relative rounded-lg overflow-hidden transition-all duration-200 
                cursor-pointer transform hover:scale-[1.02] border-2 border-[#0f1d33] hover:border-[#3498db]
                shadow-lg shadow-black/20"
      onClick={onClick}
    >
      <div className="flex p-4">
        <div className="mr-4 w-24 h-24 relative flex items-center justify-center">
          {uuid && (
            <img
              src={`https://nmsr.nickac.dev/fullbody/${uuid}?scale=8`}
              alt={`${player.name}'s skin`}
              className={`h-full object-contain pixelated transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ imageRendering: 'pixelated' }}
              onLoad={() => setIsImageLoaded(true)}
            />
          )}
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h3 className="text-white text-xl font-bold mb-1 truncate">{player.name || 'Anonymous'}</h3>
            {getBadge()}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#3498db] font-bold text-2xl">{wsValue}</span>
            <span className="text-gray-400 text-sm">Winstreak</span>
          </div>
          
          {player.clan && (
            <div className="mt-1">
              <Badge className="bg-[#143766] text-[#3498db] hover:bg-[#1e4c8a] border border-[#3498db]/30">
                {player.clan}
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white font-bold rounded-bl-lg">
        #{player.globalRank}
      </div>
    </div>
  );
};

export default LeaderboardEntry;
