
import { ReactNode } from 'react';

interface BackgroundProps {
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

const Background = ({ children, containerRef }: BackgroundProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051428] to-[#020a14]" ref={containerRef}>
      <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0 bg-fixed bg-[#041020]"></div>
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Background;
