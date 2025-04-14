
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { usePagination } from "@/hooks/usePagination";
import { usePlayerSelection } from "@/hooks/usePlayerSelection";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import LeaderboardContent from "@/components/LeaderboardContent";
import Background from "@/components/Background";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import PlayerModal from "@/components/PlayerModal";

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
    <Background containerRef={containerRef}>
      <Header status={status} lastUpdated={lastUpdated} />
      
      <SearchBar 
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        isLoading={isLoading}
        fetchData={fetchData}
        currentLeaderboard={currentLeaderboard}
        toggleLeaderboard={toggleLeaderboard}
      />
      
      <LeaderboardContent 
        currentLeaderboard={currentLeaderboard}
        visiblePlayers={visiblePlayers}
        playersToRender={playersToRender}
        playerUuids={playerUuids}
        showPlayerStats={showPlayerStats}
        isLoading={isLoading}
        currentPage={currentPage}
        maxPages={maxPages}
        changePage={changePage}
        hasMore={hasMore}
      />
      
      <ScrollToTopButton isVisible={showScrollTop} onClick={scrollToTop} />
      
      {isModalOpen && selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer} 
          uuid={selectedPlayerUuid || STEVE_UUID} 
          onClose={closeModal}
        />
      )}
    </Background>
  );
};

export default Index;
