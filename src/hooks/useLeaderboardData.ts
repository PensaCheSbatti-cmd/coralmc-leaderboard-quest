
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const APIS = {
  current: 'https://api.coralmc.it/api/leaderboard/bedwars/winstreak',
  highest: 'https://api.coralmc.it/api/leaderboard/bedwars/highest-winstreak'
};

const CORS_PROXY = 'https://api.allorigins.win/get?url=';

export const useLeaderboardData = () => {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [playerUuids, setPlayerUuids] = useState<Record<string, string>>({});
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [currentLeaderboard, setCurrentLeaderboard] = useState<'current' | 'highest'>('current');
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('Loading...');
  const [lastUpdated, setLastUpdated] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
      fetchAllPlayerUuids(sortedPlayers.slice(0, 10 * 2));
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
  };
  
  const toggleLeaderboard = () => {
    setCurrentLeaderboard(prev => prev === 'current' ? 'highest' : 'current');
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // refresh every 5 minutes
    
    return () => {
      clearInterval(interval);
    };
  }, [currentLeaderboard]);

  return {
    allPlayers,
    playerUuids,
    filteredPlayers,
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
    playersToRender: filteredPlayers.length > 0 ? filteredPlayers : allPlayers
  };
};
