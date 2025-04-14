
import { useState, useEffect } from 'react';

interface LeaderboardEntryProps {
  player: Player;
  currentLeaderboard: 'current' | 'highest';
  onClick: () => void;
  uuid: string | null;
}

const LeaderboardEntry = ({ player, currentLeaderboard, onClick, uuid }: LeaderboardEntryProps) => {
  const wsValue = currentLeaderboard === 'current' ? player.winstreak : player.highest_winstreak;
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  return (
    <div 
      className="bg-[#1e3356] hover:bg-[#254270] relative rounded-lg overflow-hidden transition-all duration-200 
                cursor-pointer transform hover:scale-[1.02] border-2 border-[#0f1d33] hover:border-[#3498db]"
      onClick={onClick}
    >
      <div className="flex p-4">
        <div className="flex-grow">
          <h3 className="text-white text-xl font-bold mb-1 truncate">{player.name || 'Anonymous'}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[#3498db] font-bold">{wsValue}</span>
            <span className="text-[#3498db] text-sm">Winstreak</span>
          </div>
          
          {player.clan && (
            <div className="mt-2">
              <span className="bg-[#0f1d33] text-[#3498db] text-xs px-2 py-1 rounded">
                {player.clan}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center w-20 h-24 relative">
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
              <div className="w-10 h-10 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute top-0 left-0 px-2 py-1 bg-[#3498db] text-white font-bold rounded-br">
        #{player.globalRank}
      </div>
    </div>
  );
};

export default LeaderboardEntry;
