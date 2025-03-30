
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, RefreshCw, Award } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  handleSearch: (value: string) => void;
  isLoading: boolean;
  fetchData: () => void;
  currentLeaderboard: 'current' | 'highest';
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
    <div className="search-container bg-[#0a2956]/90 border border-[#3498db]/30 rounded-lg p-5 mb-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3498db] h-5 w-5" />
          <Input 
            type="text" 
            placeholder="Search player..." 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-[#051428] border-[#3498db]/30 focus:border-[#3498db] text-white h-12 pl-10"
          />
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={fetchData} 
            disabled={isLoading}
            className="bg-[#3498db] hover:bg-[#2980b9] text-white flex-1 h-12"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
          
          <Button 
            onClick={toggleLeaderboard}
            className="bg-[#1e3356] hover:bg-[#254270] text-white flex-1 h-12 border border-[#3498db]/50"
          >
            <Award className="mr-2 h-4 w-4" />
            {currentLeaderboard === 'current' ? 'Show Highest WS' : 'Show Current WS'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
