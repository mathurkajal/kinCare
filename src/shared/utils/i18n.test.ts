import { describe, it, expect } from 'vitest';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, getTranslation, SupportedLanguage } from './i18n';

describe('i18n Localization Engine', () => {
  it('defines the 6 required inclusive supported languages with full metadata', () => {
    const expectedCodes: SupportedLanguage[] = ['en', 'es', 'zh', 'fr', 'tl', 'vi'];
    expect(SUPPORTED_LANGUAGES.map(l => l.code)).toEqual(expectedCodes);

    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang.code).toBeDefined();
      expect(lang.name).toBeTruthy();
      expect(lang.nativeName).toBeTruthy();
      expect(lang.flag).toBeTruthy();
      expect(lang.speechCode).toBeTruthy();
    }
  });

  it('provides translations for all core accessibility and safety keys in English', () => {
    const enKeys = Object.keys(TRANSLATIONS.en);
    expect(enKeys.length).toBeGreaterThan(20);
    expect(TRANSLATIONS.en.appTitle).toBe('KinCare');
    expect(TRANSLATIONS.en.safetyArrivalPin).toBeTruthy();
    expect(TRANSLATIONS.en.emergencySos).toBeTruthy();
  });

  it('correctly retrieves translations for supported languages', () => {
    expect(getTranslation('es', 'emergencySos')).toBe('Emergencia SOS');
    expect(getTranslation('zh', 'appTitle')).toBe('KinCare 敬老伴侣');
    expect(getTranslation('fr', 'readAloud')).toBe('Lecture Vocale');
    expect(getTranslation('tl', 'emergencySos')).toBe('Saklolo (SOS)');
    expect(getTranslation('vi', 'emergencySos')).toBe('Khẩn Cấp SOS');
  });

  it('safely falls back to English when a key is missing in a target language', () => {
    // Test with a synthetic key or existing key
    const val = getTranslation('es', 'some_unknown_key_xyz');
    expect(val).toBe('some_unknown_key_xyz');
  });

  it('safely falls back to English when an invalid language is supplied', () => {
    const val = getTranslation('unknown_lang' as SupportedLanguage, 'emergencySos');
    expect(val).toBe('Emergency SOS');
  });
});
