import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Type, 
  Volume2, 
  ShieldCheck, 
  Phone, 
  CheckCircle2, 
  RotateCcw,
  Sun,
  Eye,
  Hand,
  Mic,
  Smartphone,
  Info,
  Globe,
  ShieldAlert,
  BookOpen,
  Lock,
  Sparkles
} from 'lucide-react';
import { SeniorProfile, HandPreference, SupportedLanguage } from '../../shared/types';
import { SUPPORTED_LANGUAGES } from '../../shared/utils/i18n';

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
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [testVoicePlaying, setTestVoicePlaying] = useState(false);

  const testVoice = (customRate?: number) => {
    const rate = customRate ?? speechRate;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setTestVoicePlaying(true);
      const text = `Hello Margaret. This is your KinCare reading voice speaking at a gentle and clear pace. Everything is working smoothly.`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = rate;
      utter.pitch = 1.0;
      utter.onend = () => setTestVoicePlaying(false);
      utter.onerror = () => setTestVoicePlaying(false);
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
          onClick={() => testVoice()}
          className="px-4 py-2.5 rounded-2xl bg-[#FAF6EE] hover:bg-[#F2ECE0] border-2 border-[#E5D7C2] text-xs sm:text-sm font-bold text-[#4A3C2F] flex items-center gap-2 cursor-pointer btn-tactile shrink-0"
        >
          <Volume2 className="w-4 h-4 text-[#1E4D3B]" /> Listen Aloud
        </button>
      </div>

      {/* 1. Multilingual Support */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF8F3] text-[#1E4D3B] flex items-center justify-center border border-[#BDE7D1]">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
              Preferred Language (Ngôn ngữ / Idioma / 语言)
            </h3>
            <p className="text-xs sm:text-sm text-[#736352]">
              Select your native language for navigation, voice read-aloud, and assistance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onLanguageChange(lang.code)}
              className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
                language === lang.code
                  ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] shadow-xs font-bold'
                  : 'bg-[#FAF7F0] border-[#E5D9C7] text-[#4A3C2F] hover:bg-[#F2E8D8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{lang.flag}</span>
                {language === lang.code && <CheckCircle2 className="w-4 h-4 text-[#86EFAC]" />}
              </div>
              <span className="block font-bold text-sm sm:text-base mt-2">{lang.nativeName}</span>
              <span className={`text-xs block ${language === lang.code ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'}`}>
                {lang.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Visual & Motion Accessibility (High Contrast & Reduced Motion) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center border border-[#FDE68A]">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
              Visual Contrast & Smooth Motion
            </h3>
            <p className="text-xs sm:text-sm text-[#736352]">
              Special accommodations for low vision and motion sensitivity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* High Contrast Toggle */}
          <div className="p-5 rounded-2xl border-2 border-[#E5D7C2] bg-[#FAF7F0] flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between">
                <strong className="text-base text-[#2E241C] font-bold">High-Contrast Borders & Text</strong>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  highContrast ? 'bg-[#1E4D3B] text-white' : 'bg-[#E5D7C2] text-[#5C4A3B]'
                }`}>
                  {highContrast ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#615140] mt-1.5 leading-relaxed">
                Applies bold black outlines, enhanced text contrast, and crisp borders exceeding WCAG AAA standards.
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleHighContrast}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm cursor-pointer btn-tactile ${
                highContrast
                  ? 'bg-[#1E4D3B] text-white'
                  : 'bg-white border-2 border-[#D5C6B0] text-[#3E3024] hover:bg-[#F2ECE4]'
              }`}
            >
              {highContrast ? '✓ High Contrast Enabled' : 'Enable High Contrast'}
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="p-5 rounded-2xl border-2 border-[#E5D7C2] bg-[#FAF7F0] flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between">
                <strong className="text-base text-[#2E241C] font-bold">Reduced Motion (No Animations)</strong>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  reducedMotion ? 'bg-[#1E4D3B] text-white' : 'bg-[#E5D7C2] text-[#5C4A3B]'
                }`}>
                  {reducedMotion ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#615140] mt-1.5 leading-relaxed">
                Stops bouncy screen transitions, sliding dialogs, and decorative motions that might cause dizziness.
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleReducedMotion}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm cursor-pointer btn-tactile ${
                reducedMotion
                  ? 'bg-[#1E4D3B] text-white'
                  : 'bg-white border-2 border-[#D5C6B0] text-[#3E3024] hover:bg-[#F2ECE4]'
              }`}
            >
              {reducedMotion ? '✓ Motion Reduced' : 'Turn Off Motion'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Text Size Customizer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF8F3] text-[#1E4D3B] flex items-center justify-center border border-[#BDE7D1]">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
              Text Size for Comfortable Reading
            </h3>
            <p className="text-xs sm:text-sm text-[#736352]">
              Choose the size that feels easiest and clearest on your eyes.
            </p>
          </div>
        </div>

        {/* Tactile Text Size Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onFontScaleChange('standard')}
            className={`p-5 rounded-3xl border-3 text-left cursor-pointer transition-all btn-tactile ${
              fontScale === 'standard'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] shadow-sm'
                : 'bg-[#FAF7F0] text-[#4A3C2F] border-[#E5D9C7] hover:bg-[#F2E8D8]'
            }`}
          >
            <span className="block font-bold text-lg">Normal Size</span>
            <span className={`text-xs block mt-1 ${fontScale === 'standard' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'}`}>
              Standard book text
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFontScaleChange('large')}
            className={`p-5 rounded-3xl border-3 text-left cursor-pointer transition-all btn-tactile ${
              fontScale === 'large'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] shadow-sm'
                : 'bg-[#FAF7F0] text-[#4A3C2F] border-[#E5D9C7] hover:bg-[#F2E8D8]'
            }`}
          >
            <span className="block font-bold text-xl">Large Size</span>
            <span className={`text-xs block mt-1 ${fontScale === 'large' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'}`}>
              Generous, easy reading
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFontScaleChange('xlarge')}
            className={`p-5 rounded-3xl border-3 text-left cursor-pointer transition-all btn-tactile ${
              fontScale === 'xlarge'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] shadow-sm'
                : 'bg-[#FAF7F0] text-[#4A3C2F] border-[#E5D9C7] hover:bg-[#F2E8D8]'
            }`}
          >
            <span className="block font-black text-2xl">Extra+ Large</span>
            <span className={`text-xs block mt-1 ${fontScale === 'xlarge' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'}`}>
              Maximum clear magnification
            </span>
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="bg-[#FAF7F0] p-5 rounded-2xl border-2 border-[#E7DDCB] space-y-1">
          <span className="text-xs text-[#7A6B5B] uppercase font-bold tracking-wider">
            Sample Preview:
          </span>
          <p className="font-serif-warm text-base sm:text-lg text-[#2E241C] italic">
            "Good morning Margaret. It is a lovely sunny day in Oakridge."
          </p>
        </div>
      </div>

      {/* 4. Privacy & Scam Safety Hub */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF8F3] text-[#1E4D3B] flex items-center justify-center border border-[#BDE7D1]">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
              Privacy & Senior Protection Hub
            </h3>
            <p className="text-xs sm:text-sm text-[#736352]">
              Tools to safeguard your identity, check suspicious calls, and understand complex notices.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Scam Shield Trigger */}
          <button
            type="button"
            onClick={onOpenScamShield}
            className="p-5 rounded-2xl bg-[#FEF2F2] border-2 border-[#FECACA] hover:bg-[#FEE2E2] text-left cursor-pointer transition-all btn-tactile flex flex-col justify-between gap-3"
          >
            <div className="flex items-center gap-2 text-[#B91C1C]">
              <ShieldAlert className="w-6 h-6" />
              <strong className="text-sm font-bold">Scam & Fraud Shield</strong>
            </div>
            <p className="text-xs text-[#7F1D1D] leading-relaxed">
              Test any suspicious text, voicemail, or letter to see if it is safe or a scam.
            </p>
            <span className="text-xs font-bold text-[#991B1B] underline">Open Scam Checker →</span>
          </button>

          {/* Simple Explainer Trigger */}
          <button
            type="button"
            onClick={onOpenSimplifyModal}
            className="p-5 rounded-2xl bg-[#EFF8F3] border-2 border-[#BDE7D1] hover:bg-[#E2F3EA] text-left cursor-pointer transition-all btn-tactile flex flex-col justify-between gap-3"
          >
            <div className="flex items-center gap-2 text-[#1E4D3B]">
              <BookOpen className="w-6 h-6" />
              <strong className="text-sm font-bold">Explain in Simple Words</strong>
            </div>
            <p className="text-xs text-[#24543E] leading-relaxed">
              Translate confusing medical papers or service agreements into plain daily English.
            </p>
            <span className="text-xs font-bold text-[#1E4D3B] underline">Simplify Text →</span>
          </button>

          {/* Trust Guarantee Trigger */}
          <button
            type="button"
            onClick={onOpenVerificationModal}
            className="p-5 rounded-2xl bg-[#FAF6EE] border-2 border-[#E0D2BC] hover:bg-[#F2ECE0] text-left cursor-pointer transition-all btn-tactile flex flex-col justify-between gap-3"
          >
            <div className="flex items-center gap-2 text-[#7C2D12]">
              <ShieldCheck className="w-6 h-6" />
              <strong className="text-sm font-bold">Trust & Background Vetting</strong>
            </div>
            <p className="text-xs text-[#574737] leading-relaxed">
              Review our 4-pillar background checks and what volunteers CAN and CANNOT do.
            </p>
            <span className="text-xs font-bold text-[#1E4D3B] underline">View Standards →</span>
          </button>
        </div>

        {/* Privacy Shield Toggle */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5D7C2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <strong className="text-sm font-bold text-[#2E241C] block">Virtual Contact Privacy Shield</strong>
            <span className="text-xs text-[#7A6B5B] block">
              Masks your real phone number and exact street address behind KinCare relay until an in-person match is confirmed.
            </span>
          </div>
          <button
            type="button"
            onClick={onTogglePrivacyShield}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 cursor-pointer btn-tactile shrink-0 ${
              privacyShield ? 'bg-[#1E4D3B] text-white border-[#1E4D3B]' : 'bg-white text-[#5C4A3B] border-[#D5C6B0]'
            }`}
          >
            {privacyShield ? '✓ Privacy Shield: Protected' : 'Turn Off Masking'}
          </button>
        </div>
      </div>

      {/* 5. Hands-Free Voice Control Mode */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5F0] text-[#1E4D3B] flex items-center justify-center border border-[#C6E5D7]">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
                Hands-Free Voice Mode
              </h3>
              <p className="text-xs sm:text-sm text-[#736352]">
                Perform common actions by simply speaking out loud.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleHandsFree}
            className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base border-2 cursor-pointer transition-all btn-tactile ${
              isHandsFreeActive
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] shadow-sm'
                : 'bg-white text-[#4A3C2F] border-[#D5C6B0] hover:bg-[#F2ECE4]'
            }`}
          >
            {isHandsFreeActive ? '✓ Hands-Free: Active' : 'Enable Hands-Free Voice'}
          </button>
        </div>

        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E7DCCB] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E4D3B] uppercase tracking-wider">
            <Info className="w-4 h-4" /> Spoken Commands You Can Use Anytime:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#3E3228]">
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"Talk to someone"</strong> → Opens friendly companionship
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"I need help"</strong> → Opens grocery & volunteer help
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"Call my son"</strong> → Connects phone call with David
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"Go home"</strong> → Returns safely to your living room
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"Read this"</strong> → Reads current page text out loud
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"Open my stories"</strong> → Opens family memory parlor
            </div>
          </div>
          <p className="text-xs text-[#7A6B5B] pt-1">
            <strong>Voice Safety Guarantee:</strong> Important actions (like sharing location or calling family) always require your explicit verbal or on-screen confirmation before taking place.
          </p>
        </div>
      </div>

      {/* 6. Left / Right Hand Preference & One-Hand Mode */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center border border-[#FDE68A]">
            <Hand className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
              Hand Preference & Reachability
            </h3>
            <p className="text-xs sm:text-sm text-[#736352]">
              Adjust button layouts for left or right handed comfort.
            </p>
          </div>
        </div>

        {/* Hand Preference Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onHandPreferenceChange('left')}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
              handPreference === 'left'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] font-bold shadow-xs'
                : 'bg-white border-[#E5D7C2] text-[#4A3C2F]'
            }`}
          >
            <span className="block font-bold">Left-Handed</span>
            <span className={`text-[11px] block mt-0.5 ${handPreference === 'left' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'}`}>
              Puts primary buttons on the left
            </span>
          </button>

          <button
            type="button"
            onClick={() => onHandPreferenceChange('right')}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
              handPreference === 'right'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] font-bold shadow-xs'
                : 'bg-white border-[#E5D7C2] text-[#4A3C2F]'
            }`}
          >
            <span className="block font-bold">Right-Handed</span>
            <span className={`text-[11px] block mt-0.5 ${handPreference === 'right' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'}`}>
              Puts primary buttons on the right
            </span>
          </button>

          <button
            type="button"
            onClick={() => onHandPreferenceChange('both')}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
              handPreference === 'both'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] font-bold shadow-xs'
                : 'bg-white border-[#E5D7C2] text-[#4A3C2F]'
            }`}
          >
            <span className="block font-bold">Both / Centered</span>
            <span className={`text-[11px] block mt-0.5 ${handPreference === 'both' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'}`}>
              Evenly balanced layout
            </span>
          </button>
        </div>

        {/* One-Hand Mode Toggle */}
        <div className="pt-3 border-t border-[#F0E6D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-[#1E4D3B]" />
            <div>
              <span className="font-bold text-sm sm:text-base text-[#2E241C] block">
                One-Hand Bottom Dock Mode
              </span>
              <span className="text-xs text-[#7A6B5B] block">
                Positions Home, Help, Voice, and SOS in an easy bottom bar on phones & tablets so you don't need to stretch across the screen.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleOneHandMode}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border-2 cursor-pointer btn-tactile shrink-0 ${
              isOneHandMode
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B]'
                : 'bg-white text-[#4A3C2F] border-[#D5C6B0] hover:bg-[#F2ECE4]'
            }`}
          >
            {isOneHandMode ? '✓ One-Hand Dock: On' : 'One-Hand Dock: Off'}
          </button>
        </div>
      </div>

      {/* 7. Reading Voice & Speech Speed */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center border border-[#E9D5FF]">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
                Screen Reader Voice Speed
              </h3>
              <p className="text-xs sm:text-sm text-[#736352]">
                Control how fast or slow words are spoken to you.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleVoice}
            className={`px-4 py-2 rounded-2xl text-xs font-bold border-2 cursor-pointer btn-tactile ${
              isVoiceActive ? 'bg-[#1E4D3B] text-white border-[#1E4D3B]' : 'bg-white text-[#7A6B5B] border-[#D5C6B0]'
            }`}
          >
            {isVoiceActive ? 'Voice: Enabled' : 'Voice: Muted'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setSpeechRate(0.75);
              testVoice(0.75);
            }}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
              speechRate === 0.75
                ? 'bg-[#FAF5FF] border-[#7C3AED] text-[#581C87] font-bold'
                : 'bg-white border-[#E5D9C7] text-[#4A3C2F]'
            }`}
          >
            <span className="block font-bold">Gentle & Relaxed (0.75x)</span>
            <span className="text-[11px] text-[#7A6B5B] block mt-0.5">Very slow, patient cadence</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSpeechRate(0.85);
              testVoice(0.85);
            }}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
              speechRate === 0.85
                ? 'bg-[#FAF5FF] border-[#7C3AED] text-[#581C87] font-bold'
                : 'bg-white border-[#E5D9C7] text-[#4A3C2F]'
            }`}
          >
            <span className="block font-bold">Natural & Calm (0.85x)</span>
            <span className="text-[11px] text-[#7A6B5B] block mt-0.5">Recommended comfortable speed</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSpeechRate(1.0);
              testVoice(1.0);
            }}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
              speechRate === 1.0
                ? 'bg-[#FAF5FF] border-[#7C3AED] text-[#581C87] font-bold'
                : 'bg-white border-[#E5D9C7] text-[#4A3C2F]'
            }`}
          >
            <span className="block font-bold">Standard Speed (1.0x)</span>
            <span className="text-[11px] text-[#7A6B5B] block mt-0.5">Normal conversation pace</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => testVoice()}
          disabled={testVoicePlaying}
          className="w-full py-4 rounded-2xl bg-[#EFF8F3] hover:bg-[#E2F3EA] border-2 border-[#BDE7D1] text-[#1E4D3B] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer btn-tactile"
        >
          <Volume2 className="w-5 h-5 text-[#1E4D3B]" />
          <span>{testVoicePlaying ? 'Playing voice sample...' : '🔊 Test Voice Loudness Now'}</span>
        </button>
      </div>

      {/* 8. Family Guardian Contact Reassurance */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE]">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E3A8A]">
              Primary Family Emergency Contact
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7E9F]">
              Your son receives automatic alerts if you ever need urgent support.
            </p>
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8DFC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-lg text-[#2E241C]">
              {senior.guardianContact.name} ({senior.guardianContact.relationship})
            </h4>
            <p className="text-sm text-[#736352]">
              Direct Phone: <strong>{senior.guardianContact.phone}</strong>
            </p>
            <p className="text-xs text-[#7A6B5B] mt-0.5">
              Receives SMS & Phone notifications immediately upon morning check-in or urgent alert.
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-2xl border border-[#BDE7D1] text-xs font-bold text-[#1E4D3B] shadow-2xs">
            ✓ Notifications Active
          </div>
        </div>
      </div>
    </div>
  );
};
