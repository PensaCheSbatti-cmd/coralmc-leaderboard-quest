
import LeaderboardEntry from "./LeaderboardEntry";
import Pagination from "./Pagination";
import LeaderboardTitle from "./LeaderboardTitle";

interface LeaderboardContentProps {
  currentLeaderboard: 'current' | 'highest';
  visiblePlayers: Player[];
  playersToRender: Player[];
  playerUuids: Record<string, string>;
  showPlayerStats: (player: Player) => void;
  isLoading: boolean;
  currentPage: number;
  maxPages: number;
  changePage: (offset: number) => void;
  hasMore: boolean;
}

const LeaderboardContent = ({
  currentLeaderboard,
  visiblePlayers,
  playersToRender,
  playerUuids,
  showPlayerStats,
  isLoading,
  currentPage,
  maxPages,
  changePage,
  hasMore
}: LeaderboardContentProps) => {
  return (
    <div className="mb-8">
      <LeaderboardTitle 
        currentLeaderboard={currentLeaderboard}
        playersCount={playersToRender.length}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {visiblePlayers.map((player) => (
          <LeaderboardEntry 
            key={`${player.name}-${player.globalRank}`}
            player={player}
            currentLeaderboard={currentLeaderboard}
            onClick={() => showPlayerStats(player)}
            uuid={playerUuids[player.name] || null}
          />
        ))}
        
        {playersToRender.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-10 bg-[#0a2956]/50 rounded-lg border border-[#3498db]/20">
            <p className="text-gray-300">No players found</p>
          </div>
        )}
        
        {isLoading && playersToRender.length === 0 && (
          <div className="col-span-full flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {playersToRender.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={maxPages} 
          changePage={changePage} 
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
    </div>
  );
};

export default LeaderboardContent;
