
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { Mic } from 'lucide-react';

interface AppHeaderProps {
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ className }) => {
  return (
    <header className={`flex justify-between items-center py-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Mic className="h-6 w-6 text-brand-purple" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
          Voice to Notes
        </h1>
      </div>
      <div>
        <a 
          href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          About Web Speech API
        </a>
      </div>
    </header>
  );
};

export default AppHeader;
