import { AccessibleCard } from "./design-system/AccessibleCard";
import { AccessibleButton } from "./design-system/AccessibleButton";
import React, { useState } from 'react';
import { 
  Coffee, 
  Heart, 
  MessageSquareHeart, 
  ShoppingBag, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Key, 
  PhoneCall, 
  Clock, 
  CheckCircle2, 
  Calendar,
  Volume2,
  VolumeX,
  HelpCircle,
  Sun,
  Smile,
  Users,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { SeniorProfile, CareRequest, GoldenWish, LifeStoryChapter, SupportedLanguage, ProactiveSuggestion } from '../../shared/types';
import { getTranslation } from '../../shared/utils/i18n';
import { ProactiveAssistanceBar } from './ProactiveAssistanceBar';
import { ShieldAlert, Lock, Flag } from 'lucide-react';

interface SeniorViewProps {
  senior: SeniorProfile;
  requests: CareRequest[];
  wishes: GoldenWish[];
  stories: LifeStoryChapter[];
  language?: SupportedLanguage;
  privacyShield?: boolean;
  proactiveSuggestions?: ProactiveSuggestion[];
  onAcceptSuggestion?: (suggestion: ProactiveSuggestion) => void;
  onDismissSuggestion?: (id: string) => void;
  onCheckInToday: (mood: 'happy' | 'peaceful' | 'tired' | 'lonely' | 'need_talk') => void;
  onResetCheckIn?: () => void;
  onOpenTalkModal: () => void;
  onOpenHelpModal: () => void;
  onOpenWishModal: () => void;
  onOpenStoryModal: () => void;
  onTriggerSOS: () => void;
  onOpenSafetyDetails: () => void;
  onOpenScamShield?: () => void;
  onOpenSimplifyModal?: () => void;
  onOpenVerificationModal?: () => void;
  onOpenReportModal?: () => void;
  onSpeakText?: (text: string) => void;
}

export const SeniorView: React.FC<SeniorViewProps> = ({
  senior,
  requests,
  wishes,
  stories,
  language = 'en',
  privacyShield = true,
  proactiveSuggestions = [],
  onAcceptSuggestion,
  onDismissSuggestion,
  onCheckInToday,
  onResetCheckIn,
  onOpenTalkModal,
  onOpenHelpModal,
  onOpenWishModal,
  onOpenStoryModal,
  onTriggerSOS,
  onOpenSafetyDetails,
  onOpenScamShield,
  onOpenSimplifyModal,
  onOpenVerificationModal,
  onOpenReportModal,
  onSpeakText,
}) => {
  const [activeSpeechCaption, setActiveSpeechCaption] = useState<string | null>(null);
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

  const speak = (text: string) => {
    setActiveSpeechCaption(text);
    if (onSpeakText) {
      onSpeakText(text);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.85;
      utter.pitch = 1.0;
      utter.onend = () => setActiveSpeechCaption(null);
      utter.onerror = () => setActiveSpeechCaption(null);
      window.speechSynthesis.speak(utter);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeechCaption(null);
  };

  const matchedRequest = requests.find(r => r.status === 'matched');

  return (
    <div className="space-y-8 pb-24">
      {/* Visual Live Caption Bar for Hearing Impaired & Read-Along Support */}
      {activeSpeechCaption && (
        <div 
          id="speech-caption-banner"
          className="fixed bottom-6 left-4 right-4 max-w-3xl mx-auto bg-[#1E4D3B] text-[#FFFDF9] p-5 rounded-3xl border-3 border-[#86EFAC] shadow-2xl z-50 animate-in slide-in-from-bottom duration-200 flex items-center justify-between gap-4"
          role="region"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <Volume2 className="w-7 h-7 text-[#86EFAC] shrink-0 animate-pulse mt-0.5" />
            <div>
              <span className="text-xs text-[#A7F3D0] uppercase font-bold tracking-wider block mb-0.5">
                Reading aloud to you:
              </span>
              <p className="text-base sm:text-lg font-medium leading-relaxed">
                "{activeSpeechCaption}"
              </p>
            </div>
          </div>
          <button
            onClick={stopSpeaking}
            className="px-4 py-2.5 rounded-2xl bg-[#FFFDF9] text-[#1E4D3B] text-xs font-bold shrink-0 hover:bg-[#EAE0D0] cursor-pointer btn-tactile"
          >
            Stop Voice
          </button>
        </div>
      )}

      {/* Reassurance Banner for Cognitive Fatigue & Anxiety */}
      <div className="bg-[#FFFDF7] border-2 border-[#EEDBBA] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#665443]">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🕊️</span>
          <span className="font-medium">
            <strong>Take all the time you need, {senior.preferredName}.</strong> There are no wrong taps or time limits here.
          </span>
        </div>
        <button
          onClick={() => speak(`Take all the time you need, ${senior.preferredName}. There is no rush or time limit. Every button is protected.`)}
          className="text-xs text-[#1E4D3B] font-bold underline cursor-pointer shrink-0 hidden sm:inline"
        >
          Listen
        </button>
      </div>

      {/* Proactive Assistance (Gentle Suggestion System - Suggest, Not Assume) */}
      {proactiveSuggestions.length > 0 && onAcceptSuggestion && onDismissSuggestion && (
        <ProactiveAssistanceBar
          language={language}
          suggestions={proactiveSuggestions}
          onAcceptSuggestion={onAcceptSuggestion}
          onDismissSuggestion={onDismissSuggestion}
          onSpeakText={speak}
        />
      )}

      {/* Privacy Shield Notice (if enabled) */}
      {privacyShield && (
        <div className="bg-[#EFF8F3] border-2 border-[#BDE7D1] rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#1E4D3B]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#1E4D3B] shrink-0" />
            <span className="font-bold">
              {getTranslation(language, 'privacyShieldActive')}
            </span>
          </div>
          {onOpenVerificationModal && (
            <button
              type="button"
              onClick={onOpenVerificationModal}
              className="text-xs font-bold underline cursor-pointer hover:text-[#143528] shrink-0"
            >
              {getTranslation(language, 'verificationDetails')}
            </button>
          )}
        </div>
      )}

      {/* Quick Access Elder Safety & Protection Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#EFE5D6] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E4D3B]">
          <ShieldAlert className="w-4 h-4 text-[#B91C1C]" />
          <span>Safety & Scam Hub:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenScamShield && (
            <button
              type="button"
              onClick={onOpenScamShield}
              className="px-3.5 py-2 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] font-bold text-xs flex items-center gap-1.5 cursor-pointer btn-tactile"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'scamChecker')}</span>
            </button>
          )}

          {onOpenSimplifyModal && (
            <button
              type="button"
              onClick={onOpenSimplifyModal}
              className="px-3.5 py-2 rounded-xl bg-[#EFF8F3] hover:bg-[#E2F3EA] border border-[#BDE7D1] text-[#1E4D3B] font-bold text-xs flex items-center gap-1.5 cursor-pointer btn-tactile"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'simplifyComplex')}</span>
            </button>
          )}

          {onOpenVerificationModal && (
            <button
              type="button"
              onClick={onOpenVerificationModal}
              className="px-3.5 py-2 rounded-xl bg-[#FAF6EE] hover:bg-[#F2ECE0] border border-[#E0D2BC] text-[#574737] font-bold text-xs flex items-center gap-1.5 cursor-pointer btn-tactile"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1E4D3B]" />
              <span>Vetting Standards</span>
            </button>
          )}

          {onOpenReportModal && (
            <button
              type="button"
              onClick={onOpenReportModal}
              className="px-3 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] border border-[#E0D2BC] text-[#78350F] font-bold text-xs flex items-center gap-1 cursor-pointer btn-tactile"
              title="Report any uncomfortable experience or suspicious call"
            >
              <Flag className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Report Issue</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Warm Home Hearth & Personalized Morning Welcome */}
      <section className="bg-white rounded-3xl p-6 sm:p-9 border-2 border-[#EFE5D6] shadow-sm relative overflow-hidden bg-warm-hearth">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="relative shrink-0">
              <img
                src={senior.avatar}
                alt={senior.name}
                className="w-22 h-22 sm:w-26 sm:h-26 rounded-3xl object-cover ring-4 ring-[#E2F0EA] border-2 border-[#CBE0D7] shadow-sm"
              />
              <span className="absolute -bottom-2 -right-2 bg-[#1E4D3B] text-white p-1.5 rounded-full shadow-md" title="Safe Verified Resident">
                <ShieldCheck className="w-5 h-5 text-[#86EFAC]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif-warm text-2xl sm:text-4xl font-bold text-[#1E4D3B] tracking-tight">
                  Good morning, {senior.preferredName}.
                </h1>
                <button
                  onClick={() => speak(`Good morning, ${senior.preferredName}. Welcome to your KinCare home. How is your heart and spirit today?`)}
                  className="p-3 rounded-full bg-[#F5EDE0] hover:bg-[#EAE0D0] text-[#615140] transition-colors cursor-pointer btn-tactile"
                  title="Listen to greeting"
                  aria-label="Read greeting aloud"
                >
                  <Volume2 className="w-6 h-6 text-[#1E4D3B]" />
                </button>
              </div>

              <p className="text-base sm:text-lg text-[#615140] mt-1.5 font-normal max-w-xl">
                It is a peaceful day here in {senior.neighborhood}. Your son <strong>{senior.guardianContact.name}</strong> is connected and receiving your updates.
              </p>
            </div>
          </div>

          {/* Secret Arrival PIN Card (Large, High Contrast & Prominent) */}
          <div className="bg-[#FAF6EF] border-3 border-[#E5D7C2] rounded-3xl p-5 w-full lg:w-auto shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-xs sm:text-sm font-bold text-[#665443] uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4 text-[#1E4D3B]" />
                Your Secret Visitor PIN
              </span>
              <button
                onClick={onOpenSafetyDetails}
                className="text-xs font-bold text-[#1E4D3B] underline cursor-pointer hover:text-[#143528]"
              >
                Why this protects you
              </button>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl sm:text-5xl font-black text-[#1E4D3B] tracking-widest bg-white px-5 py-2 rounded-2xl border-2 border-[#D5C6B0] shadow-2xs">
                {senior.safetyPin}
              </span>
              <p className="text-xs sm:text-sm text-[#6B5A47] max-w-[200px] leading-snug">
                Never open your door until your visitor says this exact 4-digit code.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Morning Wellness Check-In (Tactile, Accessible & Reversible) */}
        <div className="mt-8 pt-7 border-t-2 border-[#EFE5D6]">
          {!senior.dailyCheckIn.checkedInToday ? (
            <div className="bg-[#FFFDF9] border-2 border-[#E8DCCB] rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-serif-warm text-xl sm:text-3xl font-bold text-[#1E4D3B]">
                    How are you feeling this morning, {senior.preferredName}?
                  </h2>
                  <p className="text-sm sm:text-base text-[#736352] mt-1">
                    One simple tap lets your family know you are safe and smiling.
                  </p>
                </div>

                <button
                  onClick={() => speak(`How are you feeling this morning, ${senior.preferredName}? Tap one of the three large buttons below to let your family know.`)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4D3E30] bg-[#F4ECDD] px-4 py-2 rounded-full hover:bg-[#EAE0CD] cursor-pointer btn-tactile shrink-0"
                >
                  <Volume2 className="w-4 h-4 text-[#1E4D3B]" /> Listen to Options
                </button>
              </div>

              {/* Three High-Target Mood Buttons (Minimum 72px Height, High Margin Spacing) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <button
                  onClick={() => onCheckInToday('peaceful')}
                  className="p-5 sm:p-6 rounded-3xl bg-[#F2F8F4] hover:bg-[#E4F2E9] border-3 border-[#BFDFCD] text-left cursor-pointer transition-transform btn-tactile flex items-center gap-4 shadow-2xs"
                  aria-label="I am feeling peaceful and well"
                >
                  <span className="text-4xl sm:text-5xl">🌸</span>
                  <div>
                    <span className="block font-bold text-base sm:text-xl text-[#1E4D3B]">
                      Feeling Peaceful & Good
                    </span>
                    <span className="text-xs sm:text-sm text-[#4F7361] mt-0.5 block">
                      I am comfortable and doing well
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => onCheckInToday('tired')}
                  className="p-5 sm:p-6 rounded-3xl bg-[#FFF9F0] hover:bg-[#FDF2E2] border-3 border-[#EEDBBA] text-left cursor-pointer transition-transform btn-tactile flex items-center gap-4 shadow-2xs"
                  aria-label="Resting and quiet today"
                >
                  <span className="text-4xl sm:text-5xl">🍵</span>
                  <div>
                    <span className="block font-bold text-base sm:text-xl text-[#855B1F]">
                      Resting & Quiet Today
                    </span>
                    <span className="text-xs sm:text-sm text-[#8C6D3F] mt-0.5 block">
                      Taking things gentle and slow
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onCheckInToday('need_talk');
                    onOpenTalkModal();
                  }}
                  className="p-5 sm:p-6 rounded-3xl bg-[#FAF5FF] hover:bg-[#F3EBFD] border-3 border-[#DBC8F5] text-left cursor-pointer transition-transform btn-tactile flex items-center gap-4 shadow-2xs"
                  aria-label="Would love someone to talk with"
                >
                  <span className="text-4xl sm:text-5xl">💬</span>
                  <div>
                    <span className="block font-bold text-base sm:text-xl text-[#5B2E91]">
                      Love Someone to Talk With
                    </span>
                    <span className="text-xs sm:text-sm text-[#7B54AC] mt-0.5 block">
                      Feeling a little quiet or lonely
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Reversible Check-In Confirmation with Clear Undo */
            <div className="bg-[#EFF8F3] border-3 border-[#B9E5CD] rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1E4D3B] text-white flex items-center justify-center shadow-xs shrink-0">
                  <CheckCircle2 className="w-9 h-9 text-[#86EFAC]" />
                </div>
                <div>
                  <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
                    You are safely checked in for today.
                  </h3>
                  <p className="text-sm sm:text-base text-[#3E6754]">
                    Recorded at {senior.dailyCheckIn.lastCheckInTime || '8:45 AM'}. Your son David received your reassurance.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="bg-white px-4 py-2.5 rounded-2xl border-2 border-[#B9E5CD] text-xs sm:text-sm font-bold text-[#1E4D3B] shadow-2xs">
                  🌟 {senior.dailyCheckIn.checkInStreak}-Day Unbroken Morning Streak
                </div>

                {/* Predictable & Reversible Action (Accidentally tapped prevention) */}
                {onResetCheckIn && (
                  <button
                    onClick={onResetCheckIn}
                    className="px-4 py-2.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#F2ECE4] border-2 border-[#D5C2C1] text-xs font-bold text-[#615140] cursor-pointer flex items-center gap-1.5 btn-tactile"
                    title="Tap if you tapped by mistake or want to change your mood"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#1E4D3B]" />
                    Change / Undo Check-In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Four Large, Tactile Comfort & Companionship Tiles (Zero Complex Menus, Optional Gestures + Visible Buttons) */}
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
              onClick={() => speak("What would bring you comfort or help today? You can choose to have a friendly conversation, ask for groceries, record a life story for your family, or make a cherished wish.")}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4A3C2F] bg-[#F2E8DA] px-4 py-2 rounded-full hover:bg-[#E8DAC9] cursor-pointer btn-tactile"
            >
              <Volume2 className="w-4 h-4 text-[#1E4D3B]" /> Read Options Aloud
            </button>
          </div>
        </div>

        {/* Visual Gesture Feedback with Undo Support (Requirement 11) */}
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

        {/* Visible Button Alternatives for Gestures (Requirement 10: Never require gestures alone) */}
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

      {/* 4. Visitors & Friends Coming by (High Reassurance & Safety) */}
      {matchedRequest && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C8E7D8] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏡</span>
              <div>
                <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
                  A Friendly Visitor is Confirmed
                </h3>
                <p className="text-xs sm:text-sm text-[#527062]">
                  Here is the vetted volunteer who will be coming to see you.
                </p>
              </div>
            </div>

            <span className="bg-[#EFF8F3] text-[#1E4D3B] text-xs font-bold px-3 py-1 rounded-full border border-[#BDE7D1]">
              Arrival PIN Protected
            </span>
          </div>

          <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E7DEC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={matchedRequest.assignedVolunteerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={matchedRequest.assignedVolunteerName || 'Volunteer'}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#1E4D3B]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#233531] text-base sm:text-lg">
                    {matchedRequest.assignedVolunteerName || 'David Chen'}
                  </h4>
                  <span className="text-xs bg-[#EAF5F2] text-[#1E4D3B] px-2.5 py-0.5 rounded-full font-bold">
                    ✓ Verified Companion
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#6F6050] mt-0.5">
                  Coming for: <strong>{matchedRequest.title}</strong>
                </p>
                <p className="text-xs text-[#8A7966] mt-0.5">
                  Scheduled for: {matchedRequest.dateNeeded} ({matchedRequest.estimatedDuration})
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border-2 border-[#D5C7B0] text-center w-full sm:w-auto shadow-2xs">
              <span className="text-xs text-[#7A6B5B] block font-semibold">Remember to Ask For Your PIN</span>
              <span className="font-mono text-2xl font-black text-[#1E4D3B]">{senior.safetyPin}</span>
            </div>
          </div>
        </section>
      )}

      {/* 5. Preserved Keepsake Stories Vault (Grandmother's Archive) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#EFF6FF] text-[#2563EB] rounded-2xl">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E3A8A]">
                Your Preserved Life Stories & Wisdom
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6D99]">
                Chapters and recordings shared with your son David and your grandchildren.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenStoryModal}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-xs btn-tactile"
          >
            + Add Another Memory
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E8DFC9] space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  {story.theme}
                </span>
                <span className="text-xs text-[#7B8B88]">
                  {story.recordedDate}
                </span>
              </div>

              <h4 className="font-serif-warm text-lg sm:text-xl font-bold text-[#1E3A8A]">
                "{story.title}"
              </h4>

              <p className="text-sm sm:text-base text-[#4E5E5A] leading-relaxed italic">
                "{story.refinedStory}"
              </p>

              <div className="p-3.5 bg-white rounded-xl border border-[#DDE7F7] text-xs sm:text-sm text-[#1E40AF]">
                <strong>Lesson for Youth:</strong> {story.lifeLessonTakeaway}
              </div>

              <button
                onClick={() => speak(story.refinedStory)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#2563EB] font-bold hover:underline cursor-pointer pt-1"
              >
                <Volume2 className="w-4 h-4" /> Listen to this story read aloud
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
