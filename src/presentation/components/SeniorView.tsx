import React, { useState, useCallback } from 'react';
import { Volume2 } from 'lucide-react';
import { 
  SeniorProfile, 
  CareRequest, 
  GoldenWish, 
  LifeStoryChapter, 
  SupportedLanguage, 
  ProactiveSuggestion 
} from '../../shared/types';
import { ProactiveAssistanceBar } from './ProactiveAssistanceBar';
import { SafetyHubBar } from './senior/SafetyHubBar';
import { CheckInSection } from './senior/CheckInSection';
import { ComfortTilesSection } from './senior/ComfortTilesSection';
import { MatchedVisitCard } from './senior/MatchedVisitCard';
import { KeepsakeStoriesSection } from './senior/KeepsakeStoriesSection';

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

export const SeniorView: React.FC<SeniorViewProps> = React.memo(({
  senior,
  requests,
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
  onOpenSafetyDetails,
  onOpenScamShield,
  onOpenSimplifyModal,
  onOpenVerificationModal,
  onOpenReportModal,
  onSpeakText,
}) => {
  const [activeSpeechCaption, setActiveSpeechCaption] = useState<string | null>(null);

  const speak = useCallback((text: string) => {
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
  }, [onSpeakText]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeechCaption(null);
  }, []);

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

      {/* Reassurance Banner for Cognitive Ease & Anxiety Reduction */}
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

      {/* Safety & Scam Protection Hub */}
      <SafetyHubBar
        language={language}
        privacyShield={privacyShield}
        onOpenScamShield={onOpenScamShield}
        onOpenSimplifyModal={onOpenSimplifyModal}
        onOpenVerificationModal={onOpenVerificationModal}
        onOpenReportModal={onOpenReportModal}
      />

      {/* 1. Warm Hearth, Morning Greeting & Wellness Check-In */}
      <CheckInSection
        senior={senior}
        privacyShield={privacyShield}
        onCheckInToday={onCheckInToday}
        onResetCheckIn={onResetCheckIn}
        onOpenTalkModal={onOpenTalkModal}
        onOpenSafetyDetails={onOpenSafetyDetails}
        onSpeak={speak}
      />

      {/* 2. Four Large, Tactile Comfort & Companionship Tiles */}
      <ComfortTilesSection
        onOpenTalkModal={onOpenTalkModal}
        onOpenHelpModal={onOpenHelpModal}
        onOpenStoryModal={onOpenStoryModal}
        onOpenWishModal={onOpenWishModal}
        onSpeak={speak}
      />

      {/* 3. Friendly Visitor Card (When Confirmed) */}
      {matchedRequest && (
        <MatchedVisitCard
          matchedRequest={matchedRequest}
          senior={senior}
        />
      )}

      {/* 4. Preserved Keepsake Stories & Memories */}
      <KeepsakeStoriesSection
        stories={stories}
        onOpenStoryModal={onOpenStoryModal}
        onSpeak={speak}
      />
    </div>
  );
});
