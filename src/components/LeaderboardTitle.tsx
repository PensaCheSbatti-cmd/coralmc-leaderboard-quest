
interface LeaderboardTitleProps {
  currentLeaderboard: 'current' | 'highest';
  playersCount: number;
}

const LeaderboardTitle = ({ currentLeaderboard, playersCount }: LeaderboardTitleProps) => {
  return (
    <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-3 border-b border-[#3498db]/30 pb-3">
      <span className="h-7 w-2 bg-[#3498db] rounded"></span>
      {currentLeaderboard === 'current' ? 'Current Winstreaks' : 'Highest Winstreaks'}
      <span className="text-sm font-normal text-gray-400 ml-2">
        ({playersCount} players)
      </span>
    </h2>
  );
};

export default LeaderboardTitle;
