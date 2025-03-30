
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface PlayerModalProps {
  player: {
    name: string;
    winstreak: number;
    highest_winstreak: number;
    kills?: number;
    deaths?: number;
    kdr?: string;
    clan?: string | null;
    livello?: number;
  };
  uuid: string;
  onClose: () => void;
}

const PlayerModal = ({ player, uuid, onClose }: PlayerModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as Element).classList.contains('modal-overlay')) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <>
      <div className="modal-overlay fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-br from-[#2d1b47] to-[#1e1433] border border-[#634caf]/50 p-6 w-[300px] md:w-[400px] text-center rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <button 
          className="absolute top-2 right-2 bg-[#f43f5e] text-white p-1 rounded-md hover:bg-[#e11d48] transition-colors"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        
        <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
        
        {player.clan && (
          <div className="clan-tag bg-[#634caf]/20 inline-block px-3 py-1 rounded-full text-[#a78bfa] text-sm mb-4">
            {player.clan}
          </div>
        )}
        
        <div className="skin-container my-6 transition-transform hover:scale-110 hover:rotate-3 duration-300 mx-auto w-[150px] h-[250px]">
          <img 
            src={`https://nmsr.nickac.dev/fullbody/${uuid}?scale=8`} 
            alt={`${player.name}'s skin`} 
            className="w-full h-full object-contain pixelated"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        
        <div className="player-stats space-y-3 text-sm bg-[#1a1625]/70 p-4 rounded-lg border border-[#634caf]/20">
          <div className="stat-row flex justify-between">
            <span className="text-gray-300">Level:</span>
            <span className="text-[#ffcd4a]">{player.livello || 'N/A'}</span>
          </div>
          
          <div className="stat-row flex justify-between">
            <span className="text-gray-300">Current WS:</span>
            <span className="text-[#8b5cf6]">{player.winstreak}</span>
          </div>
          
          <div className="stat-row flex justify-between">
            <span className="text-gray-300">Highest WS:</span>
            <span className="text-[#ffcd4a]">{player.highest_winstreak}</span>
          </div>
          
          {player.kills !== undefined && (
            <div className="stat-row flex justify-between">
              <span className="text-gray-300">Kills:</span>
              <span className="text-green-400">{player.kills}</span>
            </div>
          )}
          
          {player.deaths !== undefined && (
            <div className="stat-row flex justify-between">
              <span className="text-gray-300">Deaths:</span>
              <span className="text-red-400">{player.deaths}</span>
            </div>
          )}
          
          {player.kdr && (
            <div className="stat-row flex justify-between">
              <span className="text-gray-300">KDR:</span>
              <span className="text-blue-400">{player.kdr}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerModal;
