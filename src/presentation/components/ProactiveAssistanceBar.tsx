import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  Volume2, 
  Calendar, 
  Sun, 
  Droplet, 
  ShieldCheck, 
  Clock,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { ProactiveSuggestion, SupportedLanguage } from '../../shared/types';
import { getTranslation } from '../../shared/utils/i18n';

interface ProactiveAssistanceBarProps {
  language: SupportedLanguage;
  suggestions: ProactiveSuggestion[];
  onAcceptSuggestion: (suggestion: ProactiveSuggestion) => void;
  onDismissSuggestion: (id: string) => void;
  onSpeakText: (text: string) => void;
}

export const ProactiveAssistanceBar: React.FC<ProactiveAssistanceBarProps> = ({
  language,
  suggestions,
  onAcceptSuggestion,
  onDismissSuggestion,
  onSpeakText,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!suggestions || suggestions.length === 0) return null;

  const current = suggestions[activeIdx] || suggestions[0];

  const getIcon = (type: ProactiveSuggestion['type']) => {
    switch (type) {
      case 'check_in':
        return <Clock className="w-6 h-6 text-[#D97706]" />;
      case 'hydration':
        return <Droplet className="w-6 h-6 text-[#2563EB]" />;
      case 'upcoming_visit':
        return <Calendar className="w-6 h-6 text-[#1E4D3B]" />;
      case 'weather_alert':
        return <Sun className="w-6 h-6 text-[#D97706]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#7C3AED]" />;
    }
  };

  const handleSpeak = () => {
    onSpeakText(`${current.title}. ${current.message}`);
  };

  return (
    <div 
      id="proactive-assistance-bar"
      className="mb-6 bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE3] rounded-3xl border-3 border-[#E5D7C2] p-5 sm:p-6 shadow-md transition-all animate-in fade-in"
      role="region"
      aria-label="Gentle Proactive Assistance"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left: Icon and Suggestion Text */}
        <div className="flex items-start gap-4 max-w-3xl">
          <div className="w-13 h-13 rounded-2xl bg-white flex items-center justify-center border-2 border-[#E0D2BC] shadow-xs shrink-0 mt-0.5">
            {getIcon(current.type)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#1E4D3B] bg-[#EFF8F3] px-2.5 py-0.5 rounded-full border border-[#BDE7D1] inline-flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                {getTranslation(language, 'proactiveHelpTitle')}
              </span>
              <span className="text-xs text-[#7A6B5B] font-medium hidden sm:inline">
                {activeIdx + 1} of {suggestions.length}
              </span>
            </div>

            <h3 className="font-serif-warm text-lg sm:text-xl font-bold text-[#2E241C] leading-snug">
              {current.title}
            </h3>

            <p className="text-sm sm:text-base text-[#574737] leading-relaxed">
              {current.message}
            </p>
          </div>
        </div>

        {/* Right: Consent-First Action Buttons (Suggest, Not Assume) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E5D7C2]">
          {/* Read aloud button */}
          <button
            type="button"
            onClick={handleSpeak}
            className="p-3 rounded-2xl bg-white hover:bg-[#F2ECE0] border-2 border-[#D5C6B0] text-[#4A3C2F] cursor-pointer btn-tactile"
            title="Read suggestion aloud"
            aria-label="Read suggestion aloud"
          >
            <Volume2 className="w-5 h-5 text-[#1E4D3B]" />
          </button>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => onDismissSuggestion(current.id)}
            className="px-4 py-3 rounded-2xl bg-white hover:bg-[#F7F2EB] border-2 border-[#D5C6B0] text-[#615140] font-bold text-xs sm:text-sm cursor-pointer btn-tactile"
          >
            {current.dismissLabel || getTranslation(language, 'dismissSuggestion')}
          </button>

          {/* Accept / Confirm button */}
          <button
            type="button"
            onClick={() => onAcceptSuggestion(current)}
            className="px-5 py-3 rounded-2xl bg-[#1E4D3B] hover:bg-[#16382B] text-white font-bold text-xs sm:text-sm shadow-sm cursor-pointer flex items-center gap-2 btn-tactile"
          >
            <Check className="w-4 h-4 text-[#86EFAC]" />
            <span>{current.actionLabel || getTranslation(language, 'acceptSuggestion')}</span>
          </button>

          {/* Multi-item pagination indicator */}
          {suggestions.length > 1 && (
            <div className="flex items-center gap-1.5 ml-2">
              {suggestions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === activeIdx ? 'bg-[#1E4D3B] w-6' : 'bg-[#D3C4B0]'
                  }`}
                  aria-label={`Go to suggestion ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
