
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import MinecraftBackground from "@/components/MinecraftBackground";
import PlayerModal from "@/components/PlayerModal";
import OnlineCounter from "@/components/OnlineCounter";
import { ArrowUp, MessageSquare } from "lucide-react";
import LeaderboardHeader from "@/components/LeaderboardHeader";
import LeaderboardEntry from "@/components/LeaderboardEntry";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";

const APIS = {
  current: 'https://api.coralmc.it/api/leaderboard/bedwars/winstreak',
  highest: 'https://api.coralmc.it/api/leaderboard/bedwars/highest-winstreak'
};

const CORS_PROXY = 'https://api.allorigins.win/get?url=';
const STEVE_UUID = 'c06f89064c8a49119c29ea1dbd1aab82';
const PLAYERS_PER_PAGE = 10;
const TOTAL_PAGES = 10;

const Index = () => {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLeaderboard, setCurrentLeaderboard] = useState<'current' | 'highest'>('current');
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('Loading...');
  const [lastUpdated, setLastUpdated] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedPlayerUuid, setSelectedPlayerUuid] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const fetchUUID = async (username: string) => {
    try {
      const encodedUrl = encodeURIComponent(`https://api.mojang.com/users/profiles/minecraft/${username}`);
      const response = await fetch(`${CORS_PROXY}${encodedUrl}`);
      if (!response.ok) return null;
      const data = await response.json();
      const userData = JSON.parse(data.contents);
      return userData.id;
    } catch {
      return null;
    }
  };
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const encodedUrl = encodeURIComponent(APIS[currentLeaderboard]);
      const response = await fetch(`${CORS_PROXY}${encodedUrl}`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const data = await response.json();
      const parsedData = JSON.parse(data.contents);
      
      const sortedPlayers = parsedData.slice(0, 100)
        .sort((a: Player, b: Player) => 
          b[currentLeaderboard === 'current' ? 'winstreak' : 'highest_winstreak'] - 
          a[currentLeaderboard === 'current' ? 'winstreak' : 'highest_winstreak']
        )
        .map((player: Player, index: number) => ({
          ...player,
          globalRank: index + 1
        }));

      setAllPlayers(sortedPlayers);
      setFilteredPlayers([]);
      setStatus('Online');
      setLastUpdated(new Date().toLocaleTimeString());
      toast.success("Leaderboard updated!");
    } catch (error) {
      setStatus('Offline');
      setLastUpdated(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error("Failed to update leaderboard");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setFilteredPlayers([]);
      return;
    }
    
    const search = value.toLowerCase();
    const filtered = allPlayers.filter(player => 
      player.name.toLowerCase().includes(search)
    );
    setFilteredPlayers(filtered);
    setCurrentPage(1);
  };
  
  const changePage = (offset: number) => {
    const newPage = currentPage + offset;
    if (newPage > 0 && newPage <= TOTAL_PAGES) {
      setCurrentPage(newPage);
    }
  };
  
  const toggleLeaderboard = () => {
    setCurrentLeaderboard(prev => prev === 'current' ? 'highest' : 'current');
  };
  
  const showPlayerStats = async (player: Player) => {
    const uuid = await fetchUUID(player.name) || STEVE_UUID;
    setSelectedPlayer(player);
    setSelectedPlayerUuid(uuid);
    setIsModalOpen(true);
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // refresh every 5 minutes
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentLeaderboard]);
  
  const playersToRender = filteredPlayers.length > 0 ? filteredPlayers : allPlayers;
  const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
  
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#241b2f] to-[#1a1625]" ref={containerRef}>
      <MinecraftBackground />
      
      <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        <LeaderboardHeader 
          status={status} 
          lastUpdated={lastUpdated} 
        />
        
        <SearchBar 
          searchTerm={searchTerm} 
          handleSearch={handleSearch} 
          isLoading={isLoading} 
          fetchData={fetchData}
          currentLeaderboard={currentLeaderboard}
          toggleLeaderboard={toggleLeaderboard}
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={Math.ceil(playersToRender.length / PLAYERS_PER_PAGE) || TOTAL_PAGES} 
          changePage={changePage} 
          isLoading={isLoading}
          hasMore={startIndex + PLAYERS_PER_PAGE < playersToRender.length}
        />
        
        <div className="leaderboard-container space-y-2 my-4">
          {playersToRender.slice(startIndex, startIndex + PLAYERS_PER_PAGE).map((player) => (
            <LeaderboardEntry 
              key={`${player.name}-${player.globalRank}`}
              player={player}
              currentLeaderboard={currentLeaderboard}
              onClick={() => showPlayerStats(player)}
            />
          ))}
        </div>
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={Math.ceil(playersToRender.length / PLAYERS_PER_PAGE) || TOTAL_PAGES} 
          changePage={changePage} 
          isLoading={isLoading}
          hasMore={startIndex + PLAYERS_PER_PAGE < playersToRender.length}
        />
      </div>
      
      {showScrollTop && (
        <Button 
          className="fixed bottom-6 right-6 z-50 bg-[#634caf] hover:bg-[#523a9e] shadow-lg rounded-full p-3"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
      
      {isModalOpen && selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer} 
          uuid={selectedPlayerUuid || STEVE_UUID} 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
