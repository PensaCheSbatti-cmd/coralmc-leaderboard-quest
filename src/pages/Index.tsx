import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import MinecraftBackground from "@/components/MinecraftBackground";
import PlayerModal from "@/components/PlayerModal";
import OnlineCounter from "@/components/OnlineCounter";
import { ArrowUp, MessageSquare } from "lucide-react";

const APIS = {
  current: 'https://api.coralmc.it/api/leaderboard/bedwars/winstreak',
  highest: 'https://api.coralmc.it/api/leaderboard/bedwars/highest-winstreak'
};

const CORS_PROXY = 'https://api.allorigins.win/get?url=';
const STEVE_UUID = 'c06f89064c8a49119c29ea1dbd1aab82';
const PLAYERS_PER_PAGE = 10;
const TOTAL_PAGES = 10;

interface Player {
  name: string;
  winstreak: number;
  highest_winstreak: number;
  globalRank: number;
}

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
    <div className="relative min-h-screen overflow-hidden" ref={containerRef}>
      <MinecraftBackground />
      
      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        <header className="minecraft-panel relative">
          <div className="absolute top-2 right-2">
            <OnlineCounter />
          </div>
          
          <h1 className="text-2xl md:text-4xl text-white text-center mb-4">
            <span className="text-mc-gold">CoralMC</span> - Ultimate Winstreak Leaderboard
          </h1>
          
          <a 
            href="https://discord.gg/mA9r6DbW4A" 
            target="_blank" 
            rel="noopener noreferrer"
            className="discord-button flex items-center justify-center gap-2 mx-auto mb-4"
          >
            <MessageSquare className="h-5 w-5" />
            Join our Discord server
          </a>
          
          <div className="status-bar px-4 py-2 text-mc-green text-sm rounded">
            Status: {status} | Updated: {lastUpdated}
          </div>
        </header>
        
        <div className="section-divider my-6"></div>
        
        <div className="search-box text-center mb-6">
          <Input 
            type="text" 
            placeholder="Search player..." 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="minecraft-input w-full md:w-80 mb-4"
          />
          
          <div className="search-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={fetchData} 
              disabled={isLoading}
              className="minecraft-button"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
            
            <Button 
              onClick={toggleLeaderboard}
              className="minecraft-button"
            >
              {currentLeaderboard === 'current' ? 'Top MAX WS' : 'Top Current WS'}
            </Button>
          </div>
        </div>
        
        <div className="section-divider my-6"></div>
        
        <div className="pagination flex items-center justify-between mb-6">
          <Button 
            onClick={() => changePage(-1)} 
            disabled={currentPage === 1 || isLoading}
            className="minecraft-button"
          >
            ◀ Prev
          </Button>
          
          <div className="page-info">
            Page {currentPage} of {Math.ceil(playersToRender.length / PLAYERS_PER_PAGE) || TOTAL_PAGES}
          </div>
          
          <Button 
            onClick={() => changePage(1)} 
            disabled={currentPage === TOTAL_PAGES || startIndex + PLAYERS_PER_PAGE >= playersToRender.length || isLoading}
            className="minecraft-button"
          >
            Next ▶
          </Button>
        </div>
        
        <div className="leaderboard-container space-y-2">
          {playersToRender.slice(startIndex, startIndex + PLAYERS_PER_PAGE).map((player) => (
            <div 
              key={`${player.name}-${player.globalRank}`}
              className="leaderboard-entry bg-black/50 backdrop-blur-sm border-4 border-mc-stone p-4 grid grid-cols-[60px_1fr_100px] items-center cursor-pointer hover:scale-[1.02] hover:translate-y-[-2px] hover:border-mc-green hover:shadow-[0_0_15px_#4CAF50] transition-all rounded-md"
              onClick={() => showPlayerStats(player)}
            >
              <div className="entry-rank text-xl text-mc-gold text-center"># {player.globalRank}</div>
              <div className="entry-name px-4 overflow-hidden text-ellipsis">{player?.name || 'Anonymous'}</div>
              <div className="entry-ws text-right text-mc-green">
                {currentLeaderboard === 'current' ? player.winstreak : player.highest_winstreak} WS
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showScrollTop && (
        <Button 
          className="fixed bottom-6 right-6 z-50 minecraft-button"
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
