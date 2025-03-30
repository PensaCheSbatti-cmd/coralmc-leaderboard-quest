
import { useEffect } from 'react';

interface PlayerModalProps {
  player: {
    name: string;
    winstreak: number;
    highest_winstreak: number;
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
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-br from-zinc-800 to-zinc-900 border-4 border-mc-stone p-6 w-[300px] md:w-[400px] text-center rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <button 
          className="absolute top-2 right-2 bg-mc-red border-2 border-red-700 text-white px-2 py-1 text-sm rounded hover:bg-red-700 transition-colors"
          onClick={onClose}
        >
          X
        </button>
        
        <h3 className="text-xl font-minecraft mb-4">{player.name}</h3>
        
        <div className="skin-container my-4 transition-transform hover:scale-110 hover:rotate-3 duration-300 mx-auto w-[150px] h-[250px]">
          <img 
            src={`https://nmsr.nickac.dev/fullbody/${uuid}?scale=8`} 
            alt={`${player.name}'s skin`} 
            className="w-full h-full object-contain pixelated"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        
        <div className="player-stats space-y-2 text-sm">
          <p className="flex justify-between">
            <span className="text-gray-300">Current WS:</span>
            <span className="text-mc-green">{player.winstreak}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-300">Highest WS:</span>
            <span className="text-mc-gold">{player.highest_winstreak}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default PlayerModal;
