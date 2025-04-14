
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
const PLAYERS_PER_PAGE = 6; // Changed to 6 to match the grid layout
const TOTAL_PAGES = 10;

const Index = () => {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [playerUuids, setPlayerUuids] = useState<Record<string, string>>({});
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
      // Check if we already have this UUID cached
      if (playerUuids[username]) {
        return playerUuids[username];
      }
      
      const encodedUrl = encodeURIComponent(`https://api.mojang.com/users/profiles/minecraft/${username}`);
      const response = await fetch(`${CORS_PROXY}${encodedUrl}`);
      if (!response.ok) return null;
      const data = await response.json();
      const userData = JSON.parse(data.contents);
      
      // Cache the UUID
      setPlayerUuids(prev => ({
        ...prev,
        [username]: userData.id
      }));
      
      return userData.id;
    } catch {
      return null;
    }
  };
  
  const fetchAllPlayerUuids = async (players: Player[]) => {
    // Fetch UUIDs for players we don't have cached
    const playersToFetch = players.filter(p => !playerUuids[p.name]);
    
    if (playersToFetch.length === 0) return;
    
    // To avoid rate limits, fetch in batches with slight delays
    const batchSize = 3;
    
    for (let i = 0; i < playersToFetch.length; i += batchSize) {
      const batch = playersToFetch.slice(i, i + batchSize);
      
      // Process batch in parallel
      await Promise.all(
        batch.map(player => fetchUUID(player.name))
      );
      
      // Small delay between batches
      if (i + batchSize < playersToFetch.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
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
      
      // Fetch UUIDs for the visible players
      fetchAllPlayerUuids(sortedPlayers.slice(0, PLAYERS_PER_PAGE * 2));
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
      
      // Fetch UUIDs for the players on the new page
      const playersToRender = filteredPlayers.length > 0 ? filteredPlayers : allPlayers;
      const startIndex = (newPage - 1) * PLAYERS_PER_PAGE;
      const visiblePlayers = playersToRender.slice(startIndex, startIndex + PLAYERS_PER_PAGE);
      fetchAllPlayerUuids(visiblePlayers);
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
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a2956] to-[#051428]" ref={containerRef}>
      <div className="absolute inset-0 bg-[url('public/lovable-uploads/cbe1c930-9894-406b-ac27-4fe7c867964b.png')] bg-cover bg-center opacity-30 z-0"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="bg-[#0a2956]/80 backdrop-blur-sm border border-[#3498db]/30 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl text-white font-bold mb-4 md:mb-0">
              <span className="text-[#3498db]">Coral</span>MC Winstreak
            </h1>
            
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
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 items-center">
              <span className="text-[#3498db] font-medium">Status:</span>
              <span className={`font-bold ${status === 'Online' ? 'text-green-400' : 'text-red-400'}`}>
                {status}
              </span>
              <span className="text-gray-400 text-sm">• {lastUpdated}</span>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={fetchData}
                disabled={isLoading}
                className="bg-[#3498db] hover:bg-[#2980b9] text-white"
              >
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
              
              <Button 
                onClick={toggleLeaderboard}
                className="bg-[#1e3356] hover:bg-[#254270] text-white border border-[#3498db]"
              >
                {currentLeaderboard === 'current' ? 'Show Highest WS' : 'Show Current WS'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="search-box mb-8">
          <Input
            type="text"
            placeholder="Search player..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-[#0a2956]/80 border-[#3498db]/50 text-white placeholder:text-gray-400 rounded-md py-5"
          />
        </div>
        
        <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-2">
          <span className="h-8 w-1 bg-[#3498db] rounded"></span>
          {currentLeaderboard === 'current' ? 'Current Winstreaks' : 'Highest Winstreaks'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {playersToRender.slice(startIndex, startIndex + PLAYERS_PER_PAGE).map((player) => (
            <LeaderboardEntry 
              key={`${player.name}-${player.globalRank}`}
              player={player}
              currentLeaderboard={currentLeaderboard}
              onClick={() => showPlayerStats(player)}
              uuid={playerUuids[player.name] || null}
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
          className="fixed bottom-6 right-6 z-50 bg-[#3498db] hover:bg-[#2980b9] shadow-lg rounded-full p-3"
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
