import { useState, useEffect, useCallback } from 'react';
import { HandPreference, SupportedLanguage } from '../../shared/types';

export interface AccessibilitySettings {
  fontScale: 'standard' | 'large' | 'xlarge';
  setFontScale: (scale: 'standard' | 'large' | 'xlarge') => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  isHandsFreeActive: boolean;
  setIsHandsFreeActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  handPreference: HandPreference;
  setHandPreference: (pref: HandPreference) => void;
  isOneHandMode: boolean;
  setIsOneHandMode: (mode: boolean | ((prev: boolean) => boolean)) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  highContrast: boolean;
  setHighContrast: (active: boolean | ((prev: boolean) => boolean)) => void;
  reducedMotion: boolean;
  setReducedMotion: (active: boolean | ((prev: boolean) => boolean)) => void;
  privacyShield: boolean;
  setPrivacyShield: (active: boolean | ((prev: boolean) => boolean)) => void;
  resetToDefaults: () => void;
}

export function useAccessibility(): AccessibilitySettings {
  const [fontScale, setFontScale] = useState<'standard' | 'large' | 'xlarge'>('large');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isHandsFreeActive, setIsHandsFreeActive] = useState(false);
  const [handPreference, setHandPreference] = useState<HandPreference>('both');
  const [isOneHandMode, setIsOneHandMode] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [privacyShield, setPrivacyShield] = useState(true);

  // Synchronize high-contrast mode class to root HTML
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Synchronize reduced-motion mode class to root HTML
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  const resetToDefaults = useCallback(() => {
    setFontScale('large');
    setIsVoiceActive(false);
    setIsHandsFreeActive(false);
    setHandPreference('both');
    setIsOneHandMode(false);
    setLanguage('en');
    setHighContrast(false);
    setReducedMotion(false);
    setPrivacyShield(true);
  }, []);

  return {
    fontScale,
    setFontScale,
    isVoiceActive,
    setIsVoiceActive,
    isHandsFreeActive,
    setIsHandsFreeActive,
    handPreference,
    setHandPreference,
    isOneHandMode,
    setIsOneHandMode,
    language,
    setLanguage,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    privacyShield,
    setPrivacyShield,
    resetToDefaults,
  };
}
