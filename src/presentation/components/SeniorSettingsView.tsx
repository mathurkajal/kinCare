import React from 'react';
import { Volume2 } from 'lucide-react';
import { SeniorProfile, HandPreference, SupportedLanguage } from '../../shared/types';
import { LanguageSettingsSection } from './settings/LanguageSettingsSection';
import { VisualSettingsSection } from './settings/VisualSettingsSection';
import { SafetySettingsSection } from './settings/SafetySettingsSection';
import { ErgonomicsSettingsSection } from './settings/ErgonomicsSettingsSection';
import { VoiceSettingsSection } from './settings/VoiceSettingsSection';
import { GuardianContactSection } from './settings/GuardianContactSection';

interface SeniorSettingsViewProps {
  senior: SeniorProfile;
  fontScale: 'standard' | 'large' | 'xlarge';
  onFontScaleChange: (scale: 'standard' | 'large' | 'xlarge') => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  handPreference: HandPreference;
  onHandPreferenceChange: (pref: HandPreference) => void;
  isOneHandMode: boolean;
  onToggleOneHandMode: () => void;
  isHandsFreeActive: boolean;
  onToggleHandsFree: () => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  privacyShield: boolean;
  onTogglePrivacyShield: () => void;
  onOpenScamShield?: () => void;
  onOpenSimplifyModal?: () => void;
  onOpenVerificationModal?: () => void;
  onSpeakText?: (text: string) => void;
}

export const SeniorSettingsView: React.FC<SeniorSettingsViewProps> = ({
  senior,
  fontScale,
  onFontScaleChange,
  isVoiceActive,
  onToggleVoice,
  handPreference,
  onHandPreferenceChange,
  isOneHandMode,
  onToggleOneHandMode,
  isHandsFreeActive,
  onToggleHandsFree,
  language,
  onLanguageChange,
  highContrast,
  onToggleHighContrast,
  reducedMotion,
  onToggleReducedMotion,
  privacyShield,
  onTogglePrivacyShield,
  onOpenScamShield,
  onOpenSimplifyModal,
  onOpenVerificationModal,
  onSpeakText,
}) => {
  const handleListenAloud = () => {
    const text = 'Comfort and Screen Settings. Adjust text size, language, high contrast, hands-free voice, and safety protections to match your daily comfort.';
    if (onSpeakText) {
      onSpeakText(text);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D3B] bg-[#EFF8F3] px-3 py-1 rounded-full border border-[#BDE7D1]">
              Preferences & Accessibility
            </span>
          </div>
          <h2 className="font-serif-warm text-2xl sm:text-4xl font-bold text-[#1E4D3B]">
            Comfort & Screen Settings
          </h2>
          <p className="text-sm sm:text-base text-[#615140] mt-1 max-w-xl">
            Adjust text size, language, high contrast, hands-free voice, and safety protections to match your daily comfort.
          </p>
        </div>

        <button
          type="button"
          onClick={handleListenAloud}
          className="px-4 py-2.5 rounded-2xl bg-[#FAF6EE] hover:bg-[#F2ECE0] border-2 border-[#E5D7C2] text-xs sm:text-sm font-bold text-[#4A3C2F] flex items-center gap-2 cursor-pointer btn-tactile shrink-0"
        >
          <Volume2 className="w-4 h-4 text-[#1E4D3B]" /> Listen Aloud
        </button>
      </div>

      {/* 1. Multilingual Support */}
      <LanguageSettingsSection language={language} onLanguageChange={onLanguageChange} />

      {/* 2. Visual & Motion Accessibility */}
      <VisualSettingsSection
        fontScale={fontScale}
        onFontScaleChange={onFontScaleChange}
        highContrast={highContrast}
        onToggleHighContrast={onToggleHighContrast}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={onToggleReducedMotion}
      />

      {/* 3. Privacy & Scam Safety Hub */}
      <SafetySettingsSection
        privacyShield={privacyShield}
        onTogglePrivacyShield={onTogglePrivacyShield}
        onOpenScamShield={onOpenScamShield}
        onOpenSimplifyModal={onOpenSimplifyModal}
        onOpenVerificationModal={onOpenVerificationModal}
      />

      {/* 4. Hands-Free Voice & Ergonomics */}
      <ErgonomicsSettingsSection
        isHandsFreeActive={isHandsFreeActive}
        onToggleHandsFree={onToggleHandsFree}
        handPreference={handPreference}
        onHandPreferenceChange={onHandPreferenceChange}
        isOneHandMode={isOneHandMode}
        onToggleOneHandMode={onToggleOneHandMode}
      />

      {/* 5. Reading Voice & Speech Speed */}
      <VoiceSettingsSection isVoiceActive={isVoiceActive} onToggleVoice={onToggleVoice} />

      {/* 6. Family Guardian Contact Reassurance */}
      <GuardianContactSection senior={senior} />
    </div>
  );
};
