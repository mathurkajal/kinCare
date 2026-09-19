import React, { useState } from 'react';
import { 
  MessageSquareHeart, 
  ShoppingBag, 
  BookOpen, 
  Sparkles, 
  Volume2, 
  ArrowRight 
} from 'lucide-react';
import { AccessibleCard } from '../design-system/AccessibleCard';

interface ComfortTilesSectionProps {
  onOpenTalkModal: () => void;
  onOpenHelpModal: () => void;
  onOpenStoryModal: () => void;
  onOpenWishModal: () => void;
  onSpeak: (text: string) => void;
}

export const ComfortTilesSection: React.FC<ComfortTilesSectionProps> = React.memo(({
  onOpenTalkModal,
  onOpenHelpModal,
  onOpenStoryModal,
  onOpenWishModal,
  onSpeak,
}) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [gestureFeedback, setGestureFeedback] = useState<{ text: string; onUndo?: () => void } | null>(null);
  const [highlightedCardIndex, setHighlightedCardIndex] = useState(0);

  const comfortCardCount = 4;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Minimum safe threshold: 75px
    if (diff > 75) {
      // Swiped Left -> Advance to next comfort card
      const previousIndex = highlightedCardIndex;
      const nextIndex = (highlightedCardIndex + 1) % comfortCardCount;
      setHighlightedCardIndex(nextIndex);
      setGestureFeedback({
        text: `Swiped left: Moved to next comfort option.`,
        onUndo: () => setHighlightedCardIndex(previousIndex),
      });
      setTimeout(() => setGestureFeedback(null), 5000);
    } else if (diff < -75) {
      // Swiped Right -> Move to previous comfort card
      const previousIndex = highlightedCardIndex;
      const nextIndex = (highlightedCardIndex - 1 + comfortCardCount) % comfortCardCount;
      setHighlightedCardIndex(nextIndex);
      setGestureFeedback({
        text: `Swiped right: Moved to previous comfort option.`,
        onUndo: () => setHighlightedCardIndex(previousIndex),
      });
      setTimeout(() => setGestureFeedback(null), 5000);
    }
    setTouchStartX(null);
  };

  return (
    <section 
      className="space-y-5"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif-warm text-2xl sm:text-3xl font-bold text-[#1E4D3B]">
            What would bring you comfort or help today?
          </h2>
          <p className="text-sm sm:text-base text-[#736352] mt-0.5">
            Choose any of the tiles below—everything is simple, gentle, and verified.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() =>
              onSpeak(
                'What would bring you comfort or help today? You can choose to have a friendly conversation, ask for groceries, record a life story for your family, or make a cherished wish.'
              )
            }
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4A3C2F] bg-[#F2E8DA] px-4 py-2 rounded-full hover:bg-[#E8DAC9] cursor-pointer btn-tactile"
          >
            <Volume2 className="w-4 h-4 text-[#1E4D3B]" /> Read Options Aloud
          </button>
        </div>
      </div>

      {/* Visual Gesture Feedback with Undo Support */}
      {gestureFeedback && (
        <div 
          className="p-3.5 bg-[#1E4D3B] text-white rounded-2xl flex items-center justify-between gap-3 animate-in fade-in"
          role="status"
        >
          <span className="text-xs sm:text-sm font-bold">
            👈👉 {gestureFeedback.text}
          </span>
          {gestureFeedback.onUndo && (
            <button
              type="button"
              onClick={() => {
                gestureFeedback.onUndo?.();
                setGestureFeedback(null);
              }}
              className="px-3 py-1 bg-[#86EFAC] text-[#1E4D3B] text-xs font-black rounded-xl hover:bg-[#6EE7B7] cursor-pointer btn-tactile shrink-0"
            >
              [ Undo Swipe ]
            </button>
          )}
        </div>
      )}

      {/* Visible Button Alternatives for Gestures */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-[#7A6B5B] bg-[#FFFDF9] border border-[#EADBCA] p-2.5 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            const prevIndex = (highlightedCardIndex - 1 + comfortCardCount) % comfortCardCount;
            setHighlightedCardIndex(prevIndex);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#FAF6EE] hover:bg-[#EFE5D4] text-[#4A3C2F] font-bold border border-[#E0D0BB] cursor-pointer flex items-center gap-1.5 btn-tactile"
        >
          ← Previous Option
        </button>

        <span className="font-medium text-xs hidden sm:inline text-[#8D7C6B]">
          Tip: You can tap below, tap buttons, or swipe horizontally
        </span>

        <button
          type="button"
          onClick={() => {
            const nextIndex = (highlightedCardIndex + 1) % comfortCardCount;
            setHighlightedCardIndex(nextIndex);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#FAF6EE] hover:bg-[#EFE5D4] text-[#4A3C2F] font-bold border border-[#E0D0BB] cursor-pointer flex items-center gap-1.5 btn-tactile"
        >
          Next Option →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Tile 1: Gentle Friendly Conversation */}
        <AccessibleCard
          isActionable
          onClick={onOpenTalkModal}
          ariaLabel="Have a Friendly Conversation & Tea"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#F0F7F4] text-[#1E4D3B] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-[#CDE5DC]">
            <MessageSquareHeart className="w-9 h-9 text-[#1E4D3B]" />
          </div>

          <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B] mb-2">
            Have a Friendly Conversation & Tea
          </h3>
          <p className="text-sm sm:text-base text-[#615140] leading-relaxed mb-4">
            Talk with your gentle KinCare companion about fond memories, favorite recipes, and music—or request a local neighbor to come visit for afternoon tea.
          </p>

          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E4D3B]">
            Tap here to talk or request tea visit <ArrowRight className="w-4 h-4" />
          </span>
        </AccessibleCard>

        {/* Tile 2: Everyday Helping Hand */}
        <AccessibleCard
          isActionable
          onClick={onOpenHelpModal}
          ariaLabel="Ask for an Everyday Helping Hand"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#FFF9ED] text-[#D97706] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-[#FDE8C7]">
            <ShoppingBag className="w-9 h-9 text-[#D97706]" />
          </div>

          <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#8D4E08] mb-2">
            Ask for an Everyday Helping Hand
          </h3>
          <p className="text-sm sm:text-base text-[#615140] leading-relaxed mb-4">
            Need fresh groceries picked up, a patient hand with your tablet, or someone to escort you to a doctor appointment? Verified volunteers are here to help.
          </p>

          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8D4E08]">
            Tap here for groceries, chores or tech <ArrowRight className="w-4 h-4" />
          </span>
        </AccessibleCard>

        {/* Tile 3: Tell a Story & Preserve Memories */}
        <AccessibleCard
          isActionable
          onClick={onOpenStoryModal}
          ariaLabel="Tell a Story and Preserve Your Memories"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-[#BFDBFE]">
            <BookOpen className="w-9 h-9 text-[#2563EB]" />
          </div>

          <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E3A8A] mb-2">
            Tell a Story & Preserve Your Memories
          </h3>
          <p className="text-sm sm:text-base text-[#615140] leading-relaxed mb-4">
            Share a memory from your youth, your wedding, or hard-won life advice. KinCare turns your voice into a preserved keepsake chapter for your grandchildren.
          </p>

          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2563EB]">
            Tap here to record a life story <ArrowRight className="w-4 h-4" />
          </span>
        </AccessibleCard>

        {/* Tile 4: Golden Wishes & Dreams */}
        <AccessibleCard
          isActionable
          onClick={onOpenWishModal}
          ariaLabel="Make a Cherished Dream or Wish"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-[#E9D5FF]">
            <Sparkles className="w-9 h-9 text-[#7C3AED]" />
          </div>

          <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#581C87] mb-2">
            Make a Cherished Dream or Wish
          </h3>
          <p className="text-sm sm:text-base text-[#615140] leading-relaxed mb-4">
            Is there an experience you always wished you could do? Hearing live piano, visiting a botanical greenhouse, or tasting a vintage recipe? Let us help fulfill it.
          </p>

          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7C3AED]">
            Tap here to share a golden wish <ArrowRight className="w-4 h-4" />
          </span>
        </AccessibleCard>
      </div>
    </section>
  );
});
