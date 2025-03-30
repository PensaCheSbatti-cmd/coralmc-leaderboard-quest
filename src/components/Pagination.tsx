
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
        className="bg-[#634caf] hover:bg-[#523a9e] border-none"
        variant="outline"
      >
        ◀ Prev
      </Button>
      
      <div className="page-info bg-[#1a1625]/70 px-3 py-1 rounded-md border border-[#634caf]/20 text-white">
        Page {currentPage} of {totalPages}
      </div>
      
      <Button 
        onClick={() => changePage(1)} 
        disabled={currentPage === totalPages || !hasMore || isLoading}
        className="bg-[#634caf] hover:bg-[#523a9e] border-none"
        variant="outline"
      >
        Next ▶
      </Button>
    </div>
  );
};

export default Pagination;
