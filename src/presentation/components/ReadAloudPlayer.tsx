import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  X, 
  Gauge, 
  Sparkles,
  Type
} from 'lucide-react';

interface ReadAloudPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  textToRead: string;
  pageTitle?: string;
  defaultSpeed?: number;
}

export const ReadAloudPlayer: React.FC<ReadAloudPlayerProps> = ({
  isOpen,
  onClose,
  textToRead,
  pageTitle = 'Current Page',
  defaultSpeed = 0.88,
}) => {
  if (!isOpen) return null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  useEffect(() => {
    // Break into digestible sentences
    const cleanText = textToRead.replace(/\s+/g, ' ').trim();
    const splitSentences = cleanText.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [cleanText];
    setSentences(splitSentences.map(s => s.trim()).filter(Boolean));
    setCurrentSentenceIndex(0);
    setIsPlaying(false);
    setIsPaused(false);
  }, [textToRead]);

  // Handle SpeechSynthesis
  useEffect(() => {
    if (!isPlaying || isPaused || sentences.length === 0) return;

    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const sentence = sentences[currentSentenceIndex];
    if (!sentence) {
      setIsPlaying(false);
      return;
    }

    const utter = new SpeechSynthesisUtterance(sentence);
    utter.rate = speed;
    utter.pitch = 1.0;

    utter.onend = () => {
      if (currentSentenceIndex < sentences.length - 1) {
        setCurrentSentenceIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentSentenceIndex(0);
      }
    };

    utter.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utter);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isPlaying, isPaused, currentSentenceIndex, sentences, speed]);

  const handleStart = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(0);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFDF9] border-t-3 border-[#1E4D3B] shadow-2xl p-4 sm:p-5"
      role="region"
      aria-label="Read Aloud Player"
    >
      <div className="max-w-5xl mx-auto space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5F0] text-[#1E4D3B] flex items-center justify-center border border-[#C6E5D7]">
              <Volume2 className="w-5 h-5 text-[#1E4D3B]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E4D3B] block">
                Reading Aloud to You
              </span>
              <h4 className="font-serif-warm text-base sm:text-lg font-bold text-[#2E241C] leading-none">
                {pageTitle}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Picker */}
            <div className="flex items-center bg-[#FAF6EE] border border-[#E5D7C2] rounded-2xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setSpeed(0.75)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  speed === 0.75 ? 'bg-[#1E4D3B] text-white' : 'text-[#615140] hover:bg-[#EFE5D4]'
                }`}
              >
                0.75x Slower
              </button>
              <button
                type="button"
                onClick={() => setSpeed(0.88)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  speed === 0.88 ? 'bg-[#1E4D3B] text-white' : 'text-[#615140] hover:bg-[#EFE5D4]'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setSpeed(1.0)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  speed === 1.0 ? 'bg-[#1E4D3B] text-white' : 'text-[#615140] hover:bg-[#EFE5D4]'
                }`}
              >
                1.0x Fast
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                handleStop();
                onClose();
              }}
              className="p-2 rounded-2xl hover:bg-[#F2ECE4] border border-[#E5D7C2] text-[#615140] cursor-pointer"
              title="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Sentence Highlighting Display */}
        <div className="bg-[#FAF7F0] border-2 border-[#E8DCCB] rounded-2xl p-4 min-h-[64px] flex items-center">
          {sentences.length > 0 ? (
            <p className="text-base sm:text-xl font-serif-warm text-[#2E241C] leading-relaxed">
              {sentences.map((sent, idx) => (
                <span
                  key={idx}
                  className={`transition-colors duration-200 px-1 py-0.5 rounded ${
                    idx === currentSentenceIndex && isPlaying
                      ? 'bg-[#FEF08A] text-[#1E4D3B] font-bold shadow-xs'
                      : idx < currentSentenceIndex
                      ? 'text-[#7A6B5B]'
                      : 'text-[#2E241C]'
                  }`}
                >
                  {sent}{' '}
                </span>
              ))}
            </p>
          ) : (
            <p className="text-sm text-[#7A6B5B]">Ready to read current page aloud.</p>
          )}
        </div>

        {/* Player Controls: Big Tactile Buttons */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 pt-1">
          {!isPlaying || isPaused ? (
            <button
              type="button"
              onClick={isPaused ? handleResume : handleStart}
              className="px-6 sm:px-8 py-3.5 bg-[#1E4D3B] hover:bg-[#15382B] text-white rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-sm btn-tactile"
              aria-label="Play or resume reading aloud"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{isPaused ? '▶ Resume Reading' : '▶ Start Reading Aloud'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="px-6 sm:px-8 py-3.5 bg-[#D97706] hover:bg-[#B45309] text-white rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-sm btn-tactile"
              aria-label="Pause reading aloud"
            >
              <Pause className="w-5 h-5 fill-white" />
              <span>⏸ Pause</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleStop}
            className="px-5 sm:px-6 py-3.5 bg-white hover:bg-[#F5ECE0] border-2 border-[#D5C6B0] text-[#615140] rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer btn-tactile"
            aria-label="Stop reading aloud and reset"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>⏹ Stop</span>
          </button>
        </div>
      </div>
    </div>
  );
};
