
import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";

interface ScrollToTopButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

const ScrollToTopButton = ({ isVisible, onClick }: ScrollToTopButtonProps) => {
  if (!isVisible) return null;
  
  return (
    <Button 
      className="fixed bottom-6 right-6 z-50 bg-[#3498db] hover:bg-[#2980b9] rounded-full p-3 shadow-lg"
      onClick={onClick}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

export default ScrollToTopButton;
