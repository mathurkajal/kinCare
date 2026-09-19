import React from 'react';
import { Lock, ShieldAlert, BookOpen, ShieldCheck } from 'lucide-react';

interface SafetySettingsSectionProps {
  privacyShield: boolean;
  onTogglePrivacyShield: () => void;
  onOpenScamShield?: () => void;
  onOpenSimplifyModal?: () => void;
  onOpenVerificationModal?: () => void;
}

export const SafetySettingsSection: React.FC<SafetySettingsSectionProps> = ({
  privacyShield,
  onTogglePrivacyShield,
  onOpenScamShield,
  onOpenSimplifyModal,
  onOpenVerificationModal,
}) => {
  return (
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
            privacyShield
              ? 'bg-[#1E4D3B] text-white border-[#1E4D3B]'
              : 'bg-white text-[#5C4A3B] border-[#D5C6B0]'
          }`}
        >
          {privacyShield ? '✓ Privacy Shield: Protected' : 'Turn Off Masking'}
        </button>
      </div>
    </div>
  );
};
