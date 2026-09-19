import React from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  XCircle, 
  Award, 
  UserCheck, 
  FileCheck, 
  Fingerprint, 
  Lock,
  HeartHandshake
} from 'lucide-react';

interface VerificationDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  seniorPin: string;
}

export const VerificationDrawerModal: React.FC<VerificationDrawerModalProps> = ({
  isOpen,
  onClose,
  seniorPin,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-labelledby="verification-modal-title"
    >
      <div className="bg-[#FFFDF9] rounded-3xl max-w-2xl w-full border-3 border-[#E5D7C2] shadow-2xl p-6 sm:p-8 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#EFE5D6] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF8F3] text-[#1E4D3B] flex items-center justify-center border-2 border-[#BDE7D1]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 id="verification-modal-title" className="font-serif-warm text-2xl sm:text-3xl font-bold text-[#1E4D3B]">
                KinCare Trust & Verification Standards
              </h2>
              <p className="text-xs sm:text-sm text-[#736352]">
                Complete transparency on what has been checked, and what our volunteers are permitted to do.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#FAF6EE] hover:bg-[#F0E6D5] text-[#5C4A3B] border border-[#E5D7C2] cursor-pointer btn-tactile shrink-0"
            aria-label="Close verification modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Pillars of Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 bg-white rounded-2xl border border-[#E5D7C2] flex items-start gap-3">
            <Fingerprint className="w-5 h-5 text-[#1E4D3B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#2E241C]">1. Government ID Verification</h4>
              <p className="text-xs text-[#635140] mt-0.5">
                Every volunteer must provide state photo ID cross-verified with facial biometrics.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5D7C2] flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-[#1E4D3B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#2E241C]">2. Background Checks</h4>
              <p className="text-xs text-[#635140] mt-0.5">
                County, state, and federal criminal checks including national sex offender registries.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5D7C2] flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-[#1E4D3B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#2E241C]">3. Community Reference Calls</h4>
              <p className="text-xs text-[#635140] mt-0.5">
                Three independent character references interviewed directly by KinCare coordinators.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5D7C2] flex items-start gap-3">
            <Award className="w-5 h-5 text-[#1E4D3B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#2E241C]">4. Elder Empathy Certification</h4>
              <p className="text-xs text-[#635140] mt-0.5">
                Required modules in dementia awareness, elder dignity, and financial boundary respect.
              </p>
            </div>
          </div>
        </div>

        {/* Clear Boundaries: What Volunteers CAN and CANNOT Do */}
        <div className="space-y-4 pt-2">
          <h3 className="font-serif-warm text-xl font-bold text-[#1E4D3B]">
            Clear Boundaries for Your Protection
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CAN DO */}
            <div className="p-4.5 bg-[#EFF8F3] rounded-2xl border-2 border-[#BDE7D1] space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-black text-[#1E4D3B]">
                <CheckCircle2 className="w-5 h-5 text-[#1E4D3B]" />
                <span>What Volunteers CAN Do:</span>
              </div>
              <ul className="text-xs sm:text-sm text-[#24543E] space-y-1.5 font-medium">
                <li>• Friendly conversation, tea, and reading aloud</li>
                <li>• Picking up groceries from community stores</li>
                <li>• Patient assistance with smartphones & tablets</li>
                <li>• Light porch gardening or playing board games</li>
                <li>• Escorting on gentle walks with walking canes</li>
              </ul>
            </div>

            {/* CANNOT DO */}
            <div className="p-4.5 bg-[#FEF2F2] rounded-2xl border-2 border-[#FECACA] space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-black text-[#B91C1C]">
                <XCircle className="w-5 h-5 text-[#B91C1C]" />
                <span>What Volunteers CANNOT Do:</span>
              </div>
              <ul className="text-xs sm:text-sm text-[#881337] space-y-1.5 font-medium">
                <li>• Administer medicine, injections, or clinical care</li>
                <li>• Give financial advice or handle bank cards</li>
                <li>• Ask for or accept cash gifts or inheritances</li>
                <li>• Bring unverified guests into your home</li>
                <li>• Arrive without reciting your secret PIN ({seniorPin})</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Doorstep Verification Protocol */}
        <div className="p-4.5 bg-[#FAF6EE] rounded-2xl border-2 border-[#E0D2BC] flex items-start gap-3">
          <Lock className="w-6 h-6 text-[#D97706] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#574737] space-y-1">
            <strong className="text-[#2E241C] block text-sm">Your Safety PIN: {seniorPin}</strong>
            <p>
              When a volunteer arrives at your porch, ask through the door: <em>"What is our secret visit PIN today?"</em>. Only open the door once they recite <strong>{seniorPin}</strong>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#1E4D3B] hover:bg-[#16382B] text-white font-bold text-sm cursor-pointer btn-tactile"
        >
          I Understand and Feel Reassured
        </button>
      </div>
    </div>
  );
};
