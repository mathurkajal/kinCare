import React from 'react';
import { ShieldAlert, BookOpen, ShieldCheck, Flag, Lock } from 'lucide-react';
import { SupportedLanguage } from '../../../shared/types';
import { getTranslation } from '../../../shared/utils/i18n';

interface SafetyHubBarProps {
  language: SupportedLanguage;
  privacyShield?: boolean;
  onOpenScamShield?: () => void;
  onOpenSimplifyModal?: () => void;
  onOpenVerificationModal?: () => void;
  onOpenReportModal?: () => void;
}

export const SafetyHubBar: React.FC<SafetyHubBarProps> = React.memo(({
  language,
  privacyShield = true,
  onOpenScamShield,
  onOpenSimplifyModal,
  onOpenVerificationModal,
  onOpenReportModal,
}) => {
  return (
    <div className="space-y-3">
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
    </div>
  );
});
