import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Mic, 
  AlertOctagon, 
  Volume2, 
  Sparkles,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { HandPreference, SeniorNavSection } from '../../shared/types';

interface OneHandBottomDockProps {
  handPreference: HandPreference;
  activeSection: SeniorNavSection;
  onNavigate: (section: SeniorNavSection) => void;
  onTriggerSOS: () => void;
  onOpenVoice: () => void;
  onReadAloud: () => void;
}

export const OneHandBottomDock: React.FC<OneHandBottomDockProps> = ({
  handPreference,
  activeSection,
  onNavigate,
  onTriggerSOS,
  onOpenVoice,
  onReadAloud,
}) => {
  // Alignment based on Hand Preference:
  // 'left' -> grouped towards the left side for left thumb
  // 'right' -> grouped towards the right side for right thumb
  // 'both' -> evenly distributed
  const justifyClass = 
    handPreference === 'left' 
      ? 'justify-start pl-3' 
      : handPreference === 'right' 
      ? 'justify-end pr-3' 
      : 'justify-center';

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-t-3 border-[#E5D7C2] py-2 px-3 shadow-2xl block md:hidden"
      role="navigation"
      aria-label="One-Hand Accessible Bottom Controls"
    >
      <div className={`flex items-center gap-2 max-w-lg mx-auto ${justifyClass}`}>
        {/* Home Button */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl min-w-[62px] min-h-[58px] cursor-pointer transition-colors btn-tactile ${
            activeSection === 'home'
              ? 'bg-[#1E4D3B] text-white'
              : 'bg-[#FAF6EE] text-[#4A3C2F] border border-[#E5D7C2]'
          }`}
          aria-label="One-Hand Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        {/* Everyday Help Button */}
        <button
          type="button"
          onClick={() => onNavigate('help')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl min-w-[62px] min-h-[58px] cursor-pointer transition-colors btn-tactile ${
            activeSection === 'help'
              ? 'bg-[#1E4D3B] text-white'
              : 'bg-[#FAF6EE] text-[#4A3C2F] border border-[#E5D7C2]'
          }`}
          aria-label="One-Hand Ask for Help"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Help</span>
        </button>

        {/* Talk / Voice Companion */}
        <button
          type="button"
          onClick={() => onNavigate('talk')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl min-w-[62px] min-h-[58px] cursor-pointer transition-colors btn-tactile ${
            activeSection === 'talk'
              ? 'bg-[#1E4D3B] text-white'
              : 'bg-[#FAF6EE] text-[#4A3C2F] border border-[#E5D7C2]'
          }`}
          aria-label="One-Hand Talk"
        >
          <Mic className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Talk</span>
        </button>

        {/* Read Current Content Aloud */}
        <button
          type="button"
          onClick={onReadAloud}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl min-w-[62px] min-h-[58px] bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#4A3C2F] border border-[#E5D7C2] cursor-pointer transition-colors btn-tactile"
          aria-label="One-Hand Read Aloud"
        >
          <Volume2 className="w-5 h-5 text-[#1E4D3B]" />
          <span className="text-[10px] font-bold mt-0.5">Read</span>
        </button>

        {/* Constant Emergency SOS Button */}
        <button
          type="button"
          onClick={onTriggerSOS}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl min-w-[66px] min-h-[58px] bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold cursor-pointer transition-colors shadow-xs btn-tactile ml-auto"
          aria-label="One-Hand Emergency SOS"
        >
          <AlertOctagon className="w-5 h-5 text-white animate-pulse" />
          <span className="text-[10px] font-extrabold mt-0.5">SOS</span>
        </button>
      </div>
    </div>
  );
};
