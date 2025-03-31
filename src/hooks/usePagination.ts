
import { useState, useRef } from 'react';

const PLAYERS_PER_PAGE = 10;
const TOTAL_PAGES = 10;

export const usePagination = (playersCount: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const changePage = (offset: number) => {
    if (typeof offset === 'number' && !isNaN(offset)) {
      let newPage;
      
      if (Math.abs(offset) === 1) {
        // Next/Prev navigation
        newPage = currentPage + offset;
      } else {
        // Direct page selection
        newPage = offset;
      }
      
      if (newPage > 0 && newPage <= TOTAL_PAGES) {
        setCurrentPage(newPage);
        
        // Scroll to top of leaderboard
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
  const maxPages = Math.ceil(playersCount / PLAYERS_PER_PAGE) || TOTAL_PAGES;

  return {
    currentPage,
    startIndex,
    PLAYERS_PER_PAGE,
    maxPages,
    changePage,
    containerRef,
    hasMore: startIndex + PLAYERS_PER_PAGE < playersCount
  };
};
