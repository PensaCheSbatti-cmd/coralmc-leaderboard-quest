
import { ArrowUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeaderboardEntry from "@/components/LeaderboardEntry";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import PlayerModal from "@/components/PlayerModal";
import OnlineCounter from "@/components/OnlineCounter";
import backgroundImage from '../assets/background.jpg';
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { usePagination } from "@/hooks/usePagination";
import { usePlayerSelection } from "@/hooks/usePlayerSelection";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Index = () => {
  // Use custom hooks
  const {
    allPlayers,
    playerUuids,
    currentLeaderboard,
    isLoading,
    status,
    lastUpdated,
    searchTerm,
    fetchData,
    fetchUUID,
    fetchAllPlayerUuids,
    handleSearch,
    toggleLeaderboard,
    playersToRender
  } = useLeaderboardData();

  const {
    currentPage,
    startIndex,
    PLAYERS_PER_PAGE,
    maxPages,
    changePage,
    containerRef,
    hasMore
  } = usePagination(playersToRender.length);

  const {
    selectedPlayer,
    selectedPlayerUuid,
    isModalOpen,
    showPlayerStats,
    closeModal,
    STEVE_UUID
  } = usePlayerSelection(fetchUUID);

  const { showScrollTop, scrollToTop } = useScrollToTop();
  
  // Fetch UUIDs for the players on the current page
  const visiblePlayers = playersToRender.slice(startIndex, startIndex + PLAYERS_PER_PAGE);
  fetchAllPlayerUuids(visiblePlayers);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051428] to-[#020a14]" ref={containerRef}>
      <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0 bg-fixed" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
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
        
        <SearchBar 
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          isLoading={isLoading}
          fetchData={fetchData}
          currentLeaderboard={currentLeaderboard}
          toggleLeaderboard={toggleLeaderboard}
        />
        
        <div className="mb-8">
          <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-3 border-b border-[#3498db]/30 pb-3">
            <span className="h-7 w-2 bg-[#3498db] rounded"></span>
            {currentLeaderboard === 'current' ? 'Current Winstreaks' : 'Highest Winstreaks'}
            <span className="text-sm font-normal text-gray-400 ml-2">({playersToRender.length} players)</span>
          </h2>
          
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
      </div>
      
      {showScrollTop && (
        <Button 
          className="fixed bottom-6 right-6 z-50 bg-[#3498db] hover:bg-[#2980b9] rounded-full p-3 shadow-lg"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
      
      {isModalOpen && selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer} 
          uuid={selectedPlayerUuid || STEVE_UUID} 
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Index;
