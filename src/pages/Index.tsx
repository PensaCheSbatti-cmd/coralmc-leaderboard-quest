
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ArrowUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeaderboardHeader from "@/components/LeaderboardHeader";
import LeaderboardEntry from "@/components/LeaderboardEntry";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import PlayerModal from "@/components/PlayerModal";
import OnlineCounter from "@/components/OnlineCounter";

const APIS = {
  current: 'https://api.coralmc.it/api/leaderboard/bedwars/winstreak',
  highest: 'https://api.coralmc.it/api/leaderboard/bedwars/highest-winstreak'
};

const CORS_PROXY = 'https://api.allorigins.win/get?url=';
const STEVE_UUID = 'c06f89064c8a49119c29ea1dbd1aab82';
const PLAYERS_PER_PAGE = 10; // Changed to 10 per your requirements
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
    if (typeof offset === 'number' && !isNaN(offset)) {
      let newPage;
      
      if (Math.abs(offset) === 1) {
        // Next/Prev navigation
        newPage = currentPage + offset;
      } else {
        // Direct page selection
        newPage = offset;
      }
      
      if (newPage > 0 && newPage <= TOTAL_PAGES) {
        setCurrentPage(newPage);
        
        // Scroll to top of leaderboard
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Fetch UUIDs for the players on the new page
        const playersToRender = filteredPlayers.length > 0 ? filteredPlayers : allPlayers;
        const startIndex = (newPage - 1) * PLAYERS_PER_PAGE;
        const visiblePlayers = playersToRender.slice(startIndex, startIndex + PLAYERS_PER_PAGE);
        fetchAllPlayerUuids(visiblePlayers);
      }
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
  const maxPages = Math.ceil(playersToRender.length / PLAYERS_PER_PAGE) || TOTAL_PAGES;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051428] to-[#020a14]" ref={containerRef}>
      <div className="absolute inset-0 bg-[url('https://i.imgur.com/t92CMbU.jpg')] bg-cover bg-center opacity-20 z-0 bg-fixed"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="bg-[#0a2956]/90 backdrop-blur-sm border border-[#3498db]/30 rounded-lg p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl text-white font-bold mb-4 md:mb-0 flex flex-col sm:flex-row items-center gap-2">
              <span className="text-[#3498db]">Coral</span>
              <span>MC Winstreak</span>
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
          
          <div className="grid gap-6 mb-8">
            {playersToRender.slice(startIndex, startIndex + PLAYERS_PER_PAGE).map((player) => (
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
              hasMore={startIndex + PLAYERS_PER_PAGE < playersToRender.length}
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
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
