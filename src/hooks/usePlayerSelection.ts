
import { useState } from 'react';

const STEVE_UUID = 'c06f89064c8a49119c29ea1dbd1aab82';

export const usePlayerSelection = (fetchUUID: (username: string) => Promise<string | null>) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedPlayerUuid, setSelectedPlayerUuid] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const showPlayerStats = async (player: Player) => {
    const uuid = await fetchUUID(player.name) || STEVE_UUID;
    setSelectedPlayer(player);
    setSelectedPlayerUuid(uuid);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return {
    selectedPlayer,
    selectedPlayerUuid,
    isModalOpen,
    showPlayerStats,
    closeModal,
    STEVE_UUID
  };
};
