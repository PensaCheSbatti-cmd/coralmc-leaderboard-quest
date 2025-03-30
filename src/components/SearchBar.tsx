
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  handleSearch: (value: string) => void;
  isLoading: boolean;
  fetchData: () => void;
  currentLeaderboard: string;
  toggleLeaderboard: () => void;
}

const SearchBar = ({ 
  searchTerm, 
  handleSearch, 
  isLoading, 
  fetchData, 
  currentLeaderboard, 
  toggleLeaderboard 
}: SearchBarProps) => {
  return (
    <div className="search-container bg-gradient-to-r from-[#2d1b47]/90 to-[#1e1433]/90 border border-[#634caf]/30 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input 
            type="text" 
            placeholder="Search player..." 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-[#1a1625] border-[#634caf]/30 focus:border-[#8b5cf6] text-white h-12"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={fetchData} 
            disabled={isLoading}
            className="bg-[#634caf] hover:bg-[#523a9e] text-white flex-1 h-12"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
          
          <Button 
            onClick={toggleLeaderboard}
            className="bg-[#ffcd4a] hover:bg-[#e6b83e] text-[#1a1625] flex-1 h-12"
          >
            {currentLeaderboard === 'current' ? 'Top MAX WS' : 'Top Current WS'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
