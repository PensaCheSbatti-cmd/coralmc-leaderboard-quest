
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (offset: number) => void;
  isLoading: boolean;
  hasMore: boolean;
}

const Pagination = ({ currentPage, totalPages, changePage, isLoading, hasMore }: PaginationProps) => {
  return (
    <div className="pagination flex items-center justify-between my-4">
      <Button 
        onClick={() => changePage(-1)} 
        disabled={currentPage === 1 || isLoading}
        className="bg-[#1e3356] hover:bg-[#254270] text-white border border-[#3498db]/50"
        variant="outline"
      >
        ◀ Prev
      </Button>
      
      <div className="page-info bg-[#0a2956]/80 px-4 py-2 rounded-md border border-[#3498db]/50 text-white font-medium">
        Page {currentPage} of {totalPages}
      </div>
      
      <Button 
        onClick={() => changePage(1)} 
        disabled={currentPage === totalPages || !hasMore || isLoading}
        className="bg-[#1e3356] hover:bg-[#254270] text-white border border-[#3498db]/50"
        variant="outline"
      >
        Next ▶
      </Button>
    </div>
  );
};

export default Pagination;
