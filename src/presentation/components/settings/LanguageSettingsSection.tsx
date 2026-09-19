import React from 'react';
import { Globe, CheckCircle2 } from 'lucide-react';
import { SupportedLanguage } from '../../../shared/types';
import { SUPPORTED_LANGUAGES } from '../../../shared/utils/i18n';

interface LanguageSettingsSectionProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const LanguageSettingsSection: React.FC<LanguageSettingsSectionProps> = ({
  language,
  onLanguageChange,
}) => {
  return (
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
            <span
              className={`text-xs block ${
                language === lang.code ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'
              }`}
            >
              {lang.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
