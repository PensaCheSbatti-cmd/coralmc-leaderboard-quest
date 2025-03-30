
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (offset: number) => void;
  isLoading: boolean;
  hasMore: boolean;
}

const Pagination = ({ currentPage, totalPages, changePage, isLoading, hasMore }: PaginationProps) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  return (
    <div className="pagination flex flex-wrap items-center justify-between gap-2 my-6">
      <Button 
        onClick={() => changePage(-1)} 
        disabled={currentPage === 1 || isLoading}
        className="bg-[#0a2956] hover:bg-[#1e3356] text-white border border-[#3498db]/50"
        variant="outline"
        size="lg"
      >
        <ChevronLeft className="mr-1 h-5 w-5" />
        Prev
      </Button>
      
      <div className="hidden md:flex items-center gap-2">
        {getPageNumbers().map(page => (
          <Button
            key={page}
            onClick={() => changePage(page - currentPage)}
            disabled={isLoading}
            variant={currentPage === page ? "default" : "outline"}
            className={currentPage === page 
              ? "bg-[#3498db] hover:bg-[#2980b9] text-white" 
              : "bg-[#0a2956] hover:bg-[#1e3356] text-white border border-[#3498db]/50"}
          >
            {page}
          </Button>
        ))}
      </div>
      
      <div className="flex-shrink-0 text-center bg-[#0a2956]/80 px-4 py-2 rounded-md border border-[#3498db]/50 text-white font-medium">
        <span className="md:hidden">Page </span>{currentPage} of {totalPages}
      </div>
      
      <Button 
        onClick={() => changePage(1)} 
        disabled={currentPage === totalPages || !hasMore || isLoading}
        className="bg-[#0a2956] hover:bg-[#1e3356] text-white border border-[#3498db]/50"
        variant="outline"
        size="lg"
      >
        Next
        <ChevronRight className="ml-1 h-5 w-5" />
      </Button>
    </div>
  );
};

export default Pagination;
