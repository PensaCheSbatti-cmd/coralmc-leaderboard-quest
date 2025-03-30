
interface Player {
  name: string;
  winstreak: number;
  highest_winstreak: number;
  globalRank: number;
  livello?: number;
  kills?: number;
  deaths?: number;
  kdr?: string;
  clan?: string | null;
}

interface LeaderboardEntryProps {
  player: Player;
  currentLeaderboard: 'current' | 'highest';
  onClick: () => void;
}

const LeaderboardEntry = ({ player, currentLeaderboard, onClick }: LeaderboardEntryProps) => {
  const wsValue = currentLeaderboard === 'current' ? player.winstreak : player.highest_winstreak;
  
  return (
    <div 
      className="group bg-gradient-to-r from-[#2d1b47]/90 to-[#1e1433]/90 backdrop-blur-sm 
                border border-[#634caf]/30 hover:border-[#8b5cf6]/50 p-4 rounded-md grid 
                grid-cols-[60px_1fr_auto_100px] md:grid-cols-[60px_1fr_120px_100px] gap-2 items-center 
                cursor-pointer hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(139,92,246,0.2)] 
                transition-all duration-200"
      onClick={onClick}
    >
      <div className="rank-badge bg-[#1a1625] text-[#ffcd4a] font-bold text-center p-2 rounded-md w-12 h-12 flex items-center justify-center">
        #{player.globalRank}
      </div>
      
      <div className="player-name font-medium text-white truncate">
        {player.name || 'Anonymous'}
      </div>
      
      <div className="player-level hidden md:block text-[#a78bfa] text-sm">
        {player.clan && (
          <span className="bg-[#634caf]/20 px-2 py-1 rounded-md">
            {player.clan}
          </span>
        )}
      </div>
      
      <div className="winstreak text-right">
        <span className="bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white px-3 py-1 rounded-full font-bold inline-block">
          {wsValue} WS
        </span>
      </div>
    </div>
  );
};

export default LeaderboardEntry;
